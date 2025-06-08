#pragma once

#include "proxy_stub/proxy.hpp"
#include <boost/asio.hpp>
#include <boost/asio/ip/tcp.hpp>

#include <memory>
#include <map>
#include <iostream>

#include "util/util.hpp"


// SOCKS5 Protocol Constants
namespace socks5 {
  enum class AUTH : uint8_t {
    NO_AUTH = 0x00,
    GSSAPI = 0x01,
    USERNAME_PASSWORD = 0x02,
    NO_ACCEPTABLE = 0xFF
  };

  enum class CMD : uint8_t {
    CONNECT = 0x01,
    BIND = 0x02,
    UDP_ASSOCIATE = 0x03
  };

  enum class ATYP : uint8_t {
    IPV4 = 0x01,
    DOMAINNAME = 0x03,
    IPV6 = 0x04
  };

  enum class REP : uint8_t {
    SUCCEEDED = 0x00,
    GENERAL_FAILURE = 0x01,
    CONNECTION_NOT_ALLOWED = 0x02,
    NETWORK_UNREACHABLE = 0x03,
    HOST_UNREACHABLE = 0x04,
    CONNECTION_REFUSED = 0x05,
    TTL_EXPIRED = 0x06,
    COMMAND_NOT_SUPPORTED = 0x07,
    ADDRESS_TYPE_NOT_SUPPORTED = 0x08
  };
}




// TCP Connection management for SOCKS5 tunnels
class ProxyConnection : public std::enable_shared_from_this<ProxyConnection> {
private:
  boost::asio::ip::tcp::socket socket_;
  std::array<uint8_t, 8192> buffer_;
  std::function<void(const proxy::bytestream&)> data_callback_;
  
public:
  ProxyConnection(boost::asio::io_context& ioc) 
    : socket_(ioc) {}
  
  boost::asio::ip::tcp::socket& socket() { return socket_; }
  
  void set_data_callback(std::function<void(const proxy::bytestream&)> callback) {
    data_callback_ = callback;
  }
  
  void start_reading() {
    do_read();
  }
  
  void send_data(const nprpc::flat::Span<uint8_t>& data) {
    auto self = shared_from_this();
    // Make a copy of the data to keep it alive during the async operation
    auto data_copy = std::make_shared<std::vector<uint8_t>>(data.begin(), data.end());
    boost::asio::async_write(socket_, boost::asio::buffer(data_copy->data(), data_copy->size()),
      [self, data_copy](boost::system::error_code ec, std::size_t) {
        if (ec) {
          std::cerr << "Error writing to target socket: " << ec.message() << std::endl;
        }
        // data_copy will be automatically destroyed when lambda goes out of scope
      });
  }
  
private:
  void do_read() {
    auto self = shared_from_this();
    socket_.async_read_some(boost::asio::buffer(buffer_),
      [self](boost::system::error_code ec, std::size_t length) {
        if (!ec) {
          if (self->data_callback_) {
            proxy::bytestream data(self->buffer_.begin(), self->buffer_.begin() + length);
            self->data_callback_(data);
          }
          self->do_read();
        } else if (ec != boost::asio::error::eof) {
          std::cerr << "Error reading from target socket: " << ec.message() << std::endl;
        }
      });
  }
};

class ProxyUser : public proxy::IUser_Servant {
private:
  boost::asio::io_context& ioc_;
  std::map<uint32_t, std::shared_ptr<ProxyConnection>> connections_;
  uint32_t next_connection_id_ = 1;
  proxy::SessionCallbacks* session_callbacks_ = nullptr;
  
public:
  ProxyUser(boost::asio::io_context& ioc) : ioc_(ioc) {}
  ~ProxyUser() {
    std::cout << "ProxyUser destructor called." << std::endl;
  }
  
  virtual void RegisterCallbacks(nprpc::Object* callbacks) override {
    session_callbacks_ = nprpc::narrow<proxy::SessionCallbacks>(callbacks);
  }
  
  virtual uint32_t EstablishTunnel(::nprpc::flat::Span<char> target_host, uint16_t target_port) override {
    std::string host = target_host;
    try {
      // Create new connection
      auto connection = std::make_shared<ProxyConnection>(ioc_);
      uint32_t connection_id = next_connection_id_++;
      
      // Set up connection resolver and connect
      auto resolver = std::make_shared<boost::asio::ip::tcp::resolver>(ioc_);
      auto endpoints = resolver->resolve(host, std::to_string(target_port));
      
      boost::system::error_code ec;
      boost::asio::connect(connection->socket(), endpoints, ec);

      if (ec) {
        std::cerr << "Failed to connect to " << host << ":" << target_port 
                  << " - " << ec.message() << std::endl;
        return 0; // Return 0 to indicate failure
      }
      
      // Store connection
      connections_[connection_id] = connection;
      
      // Set up data forwarding callback
      connection->set_data_callback([this, connection_id](const proxy::bytestream& data) {
        if (session_callbacks_) {
          session_callbacks_->OnDataReceived(std::nullopt, connection_id, data);
        }
      });

      connection->start_reading();

      return connection_id;
      
    } catch (const std::exception& e) {
      std::cerr << "Exception during EstablishTunnel: " << e.what() << std::endl;
      return 0; // Return 0 to indicate failure
    }
  }
  
  virtual bool SendData(uint32_t session_id, ::nprpc::flat::Span<uint8_t> data) override {
    auto it = connections_.find(session_id);
    if (it == connections_.end()) {
      std::cerr << "Connection " << session_id << " not found" << std::endl;
      return false;
    }

    try {
      it->second->send_data(data);
      return true;
    } catch (const std::exception& e) {
      std::cerr << "Error sending data to connection " << session_id 
                << ": " << e.what() << std::endl;
      return false;
    }
  }
  
  virtual void CloseTunnel(uint32_t session_id) override {
    auto it = connections_.find(session_id);
    if (it != connections_.end()) {
      it->second->socket().close();
      connections_.erase(it);
      
      // Notify client that session is closed
      if (session_callbacks_) {
        session_callbacks_->OnSessionClosed(std::nullopt, session_id, 0);
      }
    }
  }
};

class ProxyImpl : public proxy::IServer_Servant {
  nprpc::Rpc& rpc_;
  nprpc::Poa* poa_ = nullptr;
  boost::asio::io_context ioc_;
  boost::asio::executor_work_guard<boost::asio::io_context::executor_type> work_guard_ = 
    boost::asio::make_work_guard(ioc_);
  std::thread ioc_thread_;
public:
  virtual void LogIn (::nprpc::flat::Span<char> secret, nprpc::detail::flat::ObjectId_Direct user)
  {
    // TODO: Check secret to some database or something
    auto oid = poa_->activate_object(
      new ProxyUser(ioc_), // create a new ProxyUser object
      nprpc::ObjectActivationFlags::SESSION_SPECIFIC, // activation_flags
      &nprpc::get_context() // session context
    );
    nprpc::Object::assign_to_direct(oid, user);
  }

  ProxyImpl(nprpc::Rpc& rpc)
    : rpc_(rpc)
  {
    poa_ = nprpc::PoaBuilder(&rpc_)
      .with_lifespan(nprpc::PoaPolicy::Lifespan::Transient)
      .with_max_objects(32)
      .build();
    
    ioc_thread_ = std::thread([this]() {
      try {
        ioc_.run();
      } catch (const std::exception& e) {
        std::cerr << "IO context thread exception: " << e.what() << std::endl;
      }
    });
  }
};