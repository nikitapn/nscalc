#pragma once

#include "proxy_stub/proxy.hpp"
#include <boost/asio.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <spdlog/spdlog.h>
#include <spdlog/spdlog.h>

#include <memory>
#include <map>
#include <iostream>

#include "util/util.hpp"


// SOCKS5 Protocol Constants
namespace socks5 {
  enum class AUTH : uint8_t {
    NO_AUTH           = 0x00,
    GSSAPI            = 0x01,
    USERNAME_PASSWORD = 0x02,
    NO_ACCEPTABLE     = 0xFF
  };

  enum class CMD : uint8_t {
    CONNECT       = 0x01,
    BIND          = 0x02,
    UDP_ASSOCIATE = 0x03
  };

  enum class ATYP : uint8_t {
    IPV4          = 0x01,
    DOMAINNAME    = 0x03,
    IPV6          = 0x04
  };

  enum class REP : uint8_t {
    SUCCEEDED                  = 0x00,
    GENERAL_FAILURE            = 0x01,
    CONNECTION_NOT_ALLOWED     = 0x02,
    NETWORK_UNREACHABLE        = 0x03,
    HOST_UNREACHABLE           = 0x04,
    CONNECTION_REFUSED         = 0x05,
    TTL_EXPIRED                = 0x06,
    COMMAND_NOT_SUPPORTED      = 0x07,
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
          spdlog::warn("[Proxy] Error writing to target socket: {}", ec.message());
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
          spdlog::warn("[Proxy] Error reading from target socket: {}", ec.message());
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
    spdlog::info("[Proxy] ProxyUser destructor called");
  }

  virtual void RegisterCallbacks(nprpc::Object* callbacks) override {
    session_callbacks_ = nprpc::narrow<proxy::SessionCallbacks>(callbacks);
  }

  virtual uint32_t EstablishTunnel(::nprpc::flat::Span<char> target_host, uint16_t target_port) override {
    std::string host = target_host;
    std::string port = std::to_string(target_port);
    auto this_ = this;
    try {
      // Create new connection
      // Don't need strand for now as there is only one thread handling connections
      auto connection = std::make_shared<ProxyConnection>(ioc_);
      uint32_t connection_id = next_connection_id_++;

      // Set up connection resolver and connect
      auto resolver = std::make_shared<boost::asio::ip::tcp::resolver>(ioc_);
      this->add_ref(); // Increase reference count to keep ProxyUser alive during async operations
      resolver->async_resolve(host, port, [connection, connection_id, this_] (
        boost::system::error_code ec, 
        const boost::asio::ip::tcp::resolver::results_type& endpoints)
        {
          if (ec) {
            spdlog::warn("[Proxy] Resolver error: {}", ec.message());
            this_->release(); // Decrease reference count
            return;
          }
          boost::asio::async_connect(connection->socket(), endpoints,
            [this_, connection, connection_id](
              boost::system::error_code ec,
              const boost::asio::ip::tcp::endpoint&)
            {
              if (ec) {
                spdlog::warn("[Proxy] Failed to connect: {}", ec.message());
                // Handle connection failure
                if (this_->session_callbacks_) {
                  this_->session_callbacks_->OnSessionClosed(std::nullopt, connection_id, proxy::CloseReason::ConnectionRefused);
                }
                this_->release(); // Decrease reference count
                return;
              }

              // Connection successful - set up data forwarding and start reading
              connection->set_data_callback([this_, connection_id](const proxy::bytestream& data) {
                if (this_->session_callbacks_) {
                  this_->session_callbacks_->OnDataReceived(std::nullopt, connection_id, data);
                }
              });
          
              if (this_->session_callbacks_) {
                this_->session_callbacks_->OnTunnelEstablished(std::nullopt, connection_id);
              }

              connection->start_reading();
              this_->release(); // Decrease reference count
            });
      });

      spdlog::info("[Proxy] Establishing tunnel to {}:{}", host, port);
      // Store connection immediately and return ID
      connections_[connection_id] = connection;
      return connection_id;
    } catch (const std::exception& e) {
      spdlog::warn("[Proxy] Exception during EstablishTunnel: {}", e.what());
      return 0; // Return 0 to indicate failure
    }
  }

  virtual bool SendData(uint32_t session_id, ::nprpc::flat::Span<uint8_t> data) override {
    auto it = connections_.find(session_id);
    if (it == connections_.end()) {
      spdlog::warn("[Proxy] Connection {} not found", session_id);
      return false;
    }

    try {
      it->second->send_data(data);
      return true;
    } catch (const std::exception& e) {
      spdlog::warn("[Proxy] Error sending data to connection {}: {}",session_id, e.what());
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
        session_callbacks_->OnSessionClosed(std::nullopt, session_id, proxy::CloseReason::Normal);
      }
    }
  }
};

class ProxyImpl : public proxy::IServer_Servant {
  nprpc::Rpc& rpc_;
  std::shared_ptr<UserService> userService_;
  nprpc::Poa* poa_ = nullptr;
  boost::asio::io_context ioc_;
  boost::asio::executor_work_guard<boost::asio::io_context::executor_type> work_guard_ = 
    boost::asio::make_work_guard(ioc_);
  std::thread ioc_thread_;
public:
  void LogIn (::nprpc::flat::Span<char> login, ::nprpc::flat::Span<char> password, nprpc::detail::flat::ObjectId_Direct user) override
  {
    if (password.size() == 0 || login.size() == 0)
      throw proxy::AuthorizationFailed();
    {
      std::lock_guard lk(*userService_);
      if (auto user = userService_->getUserByName(login); user) {
        if (UserService::checkPassword(*user, password) == false)
          throw proxy::AuthorizationFailed();
        if (UserService::isUserAllowedToUseProxy(*user) == false)
          throw proxy::AuthorizationFailed();
        // User exists and password is correct and user is allowed to use proxy
        spdlog::info("[Proxy] User \"{}\" logged in successfully", user->user_name);
      } else {
        throw proxy::AuthorizationFailed();
      }
    }

    // Create a new ProxyUser object and activate it in the POA
    auto oid = poa_->activate_object(
      new ProxyUser(ioc_), // create a new ProxyUser object
      nprpc::ObjectActivationFlags::SESSION_SPECIFIC, // activation_flags
      &nprpc::get_context() // session context
    );
    nprpc::Object::assign_to_direct(oid, user);
  }

  ProxyImpl(nprpc::Rpc& rpc, std::shared_ptr<UserService> userService)
    : rpc_(rpc)
    , userService_{userService}
  {
    poa_ = nprpc::PoaBuilder(&rpc_)
      .with_lifespan(nprpc::PoaPolicy::Lifespan::Transient)
      .with_max_objects(32)
      .build();

    ioc_thread_ = std::thread([this]() { 
      // In case of any communication failure triggered by NPRPC, we will retry running the IO context
      // which handles non-NPRPC related tasks with socks5 connections.
      while(true) {
        try {
          ioc_.run();
          break; // Exit the loop if run() completes normally
        } catch (nprpc::ExceptionCommFailure& e) {
          spdlog::warn("[Proxy] Communication failure in IO context thread: {}", e.what);
        } catch (nprpc::Exception& e) {
          spdlog::warn("[Proxy] NPRPC exception in IO context thread: {}", e.what());
        } catch (const std::exception& e) {
          spdlog::warn("[Proxy] Error in IO context thread: {}", e.what());
          break; // Exit on other exceptions
        } catch (...) {
          spdlog::error("[Proxy] Unknown error in IO context thread.");
          break; // Exit on unknown errors
        }
      }
    });
  }
};