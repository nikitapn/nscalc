#include <iostream>
#include <memory>
#include <deque>
#include <array>
#include <stdexcept>
#include <optional>
#include <unordered_map>
#include <mutex>

#include "socks5.hpp"
#include "util.hpp"

#include <boost/asio.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/beast/core.hpp>
#include <nprpc/nprpc.hpp>

#include <proxy_stub/proxy.hpp>

// SOCKS5 Protocol Constants
enum class SOCKS5_AUTH : uint8_t {
  NO_AUTH = 0x00,
  GSSAPI = 0x01,
  USERNAME_PASSWORD = 0x02,
  NO_ACCEPTABLE = 0xFF
};

enum class SOCKS5_CMD : uint8_t {
  CONNECT = 0x01,
  BIND = 0x02,
  UDP_ASSOCIATE = 0x03
};

enum class SOCKS5_ATYP : uint8_t {
  IPV4 = 0x01,
  DOMAINNAME = 0x03,
  IPV6 = 0x04
};

enum class SOCKS5_REP : uint8_t {
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



// Forward declaration

namespace {

void fail(boost::system::error_code ec, char const* what) {
  std::cerr << what << ": " << ec.message() << "\n";
}

class SOCKS5Session;
// Session manager to map session IDs to SOCKS5Session objects
class SessionManager {
private:
  static SessionManager* instance_;
  std::unordered_map<uint32_t, std::weak_ptr<SOCKS5Session>> sessions_;
  mutable std::mutex mutex_;

public:
  static SessionManager& getInstance() {
    if (!instance_) {
      instance_ = new SessionManager();
    }
    return *instance_;
  }

  void registerSession(uint32_t session_id, std::shared_ptr<SOCKS5Session> session);

  void unregisterSession(uint32_t session_id); 

  std::shared_ptr<SOCKS5Session> getSession(uint32_t session_id);
  
};

SessionManager* SessionManager::instance_ = nullptr;

class SOCKS5Session : public std::enable_shared_from_this<SOCKS5Session> {
private:
  boost::asio::ip::tcp::socket client_socket_;
  proxy::User* proxy_user_;
  std::array<uint8_t, 8192> buffer_;
  std::string target_host_;
  uint16_t target_port_;
  uint32_t session_id_;
  bool tunnel_established_;

public:
  SOCKS5Session(boost::asio::ip::tcp::socket socket, proxy::User* proxy_user)
    : client_socket_(std::move(socket))
    , proxy_user_(proxy_user)
    , session_id_(0)
    , tunnel_established_(false) {
  }

  void start() {
    do_read_auth_request();
  }

  // Called when data is received from the proxy server
  void onDataFromServer(::nprpc::flat::Span<uint8_t> data) {
    if (!tunnel_established_) {
      std::cerr << "Received data but tunnel not established" << std::endl;
      return;
    }

    // Forward data to client
    auto self = shared_from_this();
    boost::asio::async_write(client_socket_, boost::asio::buffer(data.data(), data.size()),
      [self](boost::system::error_code ec, std::size_t) {
        if (ec) {
          std::cerr << "Error writing to client: " << ec.message() << std::endl;
        }
      });
  }

  // Called when the server closes the session
  void onServerClosed(uint32_t reason) {
    std::cout << "Server closed session, reason: " << reason << std::endl;
    client_socket_.close();
  }

private:
  void do_read_auth_request() {
    auto self = shared_from_this();
    client_socket_.async_read_some(
      boost::asio::buffer(buffer_.data(), 2),
      [self](boost::system::error_code ec, std::size_t length) {
        if (ec) {
          fail(ec, "auth request read");
          return;
        }
        
        if (length < 2 || self->buffer_[0] != 0x05) {
          std::cerr << "Invalid SOCKS5 version\n";
          return;
        }
        
        uint8_t nmethods = self->buffer_[1];
        if (nmethods == 0) {
          std::cerr << "No authentication methods\n";
          return;
        }
        
        self->do_read_auth_methods(nmethods);
      });
  }

  void do_read_auth_methods(uint8_t nmethods) {
    auto self = shared_from_this();
    client_socket_.async_read_some(
      boost::asio::buffer(buffer_.data(), nmethods),
      [self, nmethods](boost::system::error_code ec, std::size_t length) {
        if (ec) {
          fail(ec, "auth methods read");
          return;
        }
        
        // For simplicity, we accept NO_AUTH (0x00)
        bool no_auth_found = false;
        for (size_t i = 0; i < length; ++i) {
          if (self->buffer_[i] == static_cast<uint8_t>(SOCKS5_AUTH::NO_AUTH)) {
            no_auth_found = true;
            break;
          }
        }
        
        // Send auth response
        self->buffer_[0] = 0x05; // SOCKS5 version
        self->buffer_[1] = no_auth_found ? 
          static_cast<uint8_t>(SOCKS5_AUTH::NO_AUTH) : 
          static_cast<uint8_t>(SOCKS5_AUTH::NO_ACCEPTABLE);
        
        self->do_write_auth_response();
      });
  }

  void do_write_auth_response() {
    auto self = shared_from_this();
    boost::asio::async_write(client_socket_, boost::asio::buffer(buffer_.data(), 2),
      [self](boost::system::error_code ec, std::size_t) {
        if (ec) {
          fail(ec, "auth response write");
          return;
        }
        
        if (self->buffer_[1] == static_cast<uint8_t>(SOCKS5_AUTH::NO_ACCEPTABLE)) {
          std::cerr << "No acceptable authentication method\n";
          return;
        }
        
        self->do_read_connect_request();
      });
  }

  void do_read_connect_request() {
    auto self = shared_from_this();
    client_socket_.async_read_some(
      boost::asio::buffer(buffer_.data(), 4),
      [self](boost::system::error_code ec, std::size_t length) {
        if (ec) {
          fail(ec, "connect request read");
          return;
        }
        
        if (length < 4 || self->buffer_[0] != 0x05) {
          std::cerr << "Invalid SOCKS5 connect request\n";
          return;
        }
        
        uint8_t cmd = self->buffer_[1];
        uint8_t atyp = self->buffer_[3];
        
        if (cmd != static_cast<uint8_t>(SOCKS5_CMD::CONNECT)) {
          self->send_connect_response(SOCKS5_REP::COMMAND_NOT_SUPPORTED);
          return;
        }
        
        self->do_read_target_address(static_cast<SOCKS5_ATYP>(atyp));
      });
  }

  void do_read_target_address(SOCKS5_ATYP atyp) {
    auto self = shared_from_this();
    
    if (atyp == SOCKS5_ATYP::IPV4) {
      client_socket_.async_read_some(
        boost::asio::buffer(buffer_.data(), 6), // 4 bytes IP + 2 bytes port
        [self](boost::system::error_code ec, std::size_t length) {
          if (ec || length < 6) {
            fail(ec, "IPv4 address read");
            return;
          }
          
          // Convert IPv4 to string
          self->target_host_ = std::to_string(self->buffer_[0]) + "." +
                              std::to_string(self->buffer_[1]) + "." +
                              std::to_string(self->buffer_[2]) + "." +
                              std::to_string(self->buffer_[3]);
          
          self->target_port_ = (self->buffer_[4] << 8) | self->buffer_[5];
          self->establish_tunnel();
        });
    } else if (atyp == SOCKS5_ATYP::DOMAINNAME) {
      client_socket_.async_read_some(
        boost::asio::buffer(buffer_.data(), 1), // domain length
        [self](boost::system::error_code ec, std::size_t length) {
          if (ec || length < 1) {
            fail(ec, "domain length read");
            return;
          }
          
          uint8_t domain_len = self->buffer_[0];
          self->client_socket_.async_read_some(
            boost::asio::buffer(self->buffer_.data(), domain_len + 2), // domain + port
            [self, domain_len](boost::system::error_code ec, std::size_t length) {
              if (ec || length < domain_len + 2) {
                fail(ec, "domain address read");
                return;
              }
              
              self->target_host_ = std::string(
                reinterpret_cast<char*>(self->buffer_.data()), domain_len);
              self->target_port_ = (self->buffer_[domain_len] << 8) | 
                                  self->buffer_[domain_len + 1];
              self->establish_tunnel();
            });
        });
    } else {
      self->send_connect_response(SOCKS5_REP::ADDRESS_TYPE_NOT_SUPPORTED);
    }
  }

  void establish_tunnel() {
    std::cout << "Establishing tunnel to " << target_host_ << ":" << target_port_ << std::endl;
    
    try {
      // Use the new EstablishTunnel method
      session_id_ = proxy_user_->EstablishTunnel(target_host_, target_port_);
      
      if (session_id_ == 0) {
        std::cerr << "Failed to establish tunnel" << std::endl;
        send_connect_response(SOCKS5_REP::GENERAL_FAILURE);
        return;
      }
      
      // Register this session with the session manager
      SessionManager::getInstance().registerSession(session_id_, shared_from_this());
      
      tunnel_established_ = true;
      send_connect_response(SOCKS5_REP::SUCCEEDED);
      
    } catch (const std::exception& e) {
      std::cerr << "Tunnel establishment failed: " << e.what() << std::endl;
      send_connect_response(SOCKS5_REP::GENERAL_FAILURE);
    }
  }

  void send_connect_response(SOCKS5_REP rep) {
    // Build SOCKS5 response
    buffer_[0] = 0x05; // SOCKS5 version
    buffer_[1] = static_cast<uint8_t>(rep);
    buffer_[2] = 0x00; // Reserved
    buffer_[3] = static_cast<uint8_t>(SOCKS5_ATYP::IPV4); // Address type
    
    // Bound address and port (we can use 0.0.0.0:0 for success)
    buffer_[4] = 0x00; // 0.0.0.0
    buffer_[5] = 0x00;
    buffer_[6] = 0x00;
    buffer_[7] = 0x00;
    buffer_[8] = 0x00; // Port 0
    buffer_[9] = 0x00;

    auto self = shared_from_this();
    boost::asio::async_write(client_socket_, boost::asio::buffer(buffer_.data(), 10),
      [self, rep](boost::system::error_code ec, std::size_t) {
        if (ec) {
          fail(ec, "connect response write");
          return;
        }
        
        if (rep == SOCKS5_REP::SUCCEEDED) {
          self->start_forwarding();
        }
      });
  }

  void start_forwarding() {
    // Start forwarding data between client and proxy
    do_read_from_client();
  }

  void do_read_from_client() {
    auto self = shared_from_this();
    client_socket_.async_read_some(
      boost::asio::buffer(buffer_.data(), buffer_.size()),
      [self](boost::system::error_code ec, std::size_t length) {
        if (ec) {
          if (ec != boost::asio::error::eof) {
            fail(ec, "client read");
          }
          // Close the tunnel when client disconnects
          if (self->session_id_ != 0) {
            try {
              self->proxy_user_->CloseTunnel(self->session_id_);
            } catch (const std::exception& e) {
              std::cerr << "Error closing tunnel: " << e.what() << std::endl;
            }
          }
          return;
        }
        
        // Forward data through NPRPC proxy using SendData
        if (self->session_id_ != 0 && self->tunnel_established_) {
          try {
            proxy::bytestream data(self->buffer_.begin(), self->buffer_.begin() + length);
            bool success = self->proxy_user_->SendData(self->session_id_, data);
            if (!success) {
              std::cerr << "Failed to send data through proxy" << std::endl;
            }
          } catch (const std::exception& e) {
            std::cerr << "Proxy send error: " << e.what() << std::endl;
          }
        }
        
        // Continue reading from client
        self->do_read_from_client();
      });
  }
};

class SOCKS5Server : public std::enable_shared_from_this<SOCKS5Server> {
private:
  boost::asio::io_context& ioc_;
  boost::asio::ip::tcp::acceptor acceptor_;
  proxy::User* proxy_user_;

public:
  SOCKS5Server(boost::asio::io_context& ioc, unsigned short port, proxy::User* proxy_user)
    : ioc_(ioc)
    , acceptor_(ioc, boost::asio::ip::tcp::endpoint(boost::asio::ip::tcp::v4(), port))
    , proxy_user_(proxy_user) {
  }

  void start() {
    do_accept();
  }

private:
  void do_accept() {
    acceptor_.async_accept(
      [this](boost::system::error_code ec, boost::asio::ip::tcp::socket socket) {
        if (ec) {
          fail(ec, "accept");
        } else {
          std::cout << "New SOCKS5 connection accepted\n";
          std::make_shared<SOCKS5Session>(std::move(socket), proxy_user_)->start();
        }
        
        do_accept();
      });
  }
};

// Callback implementation for receiving data from proxy server
class ProxySessionCallbacks : public proxy::ISessionCallbacks_Servant {
public:
  void OnDataReceived(uint32_t session_id, ::nprpc::flat::Span<uint8_t> data) override {
    std::cout << "OnDataReceived: session " << session_id << ", " << data.size() << " bytes" << std::endl;
    auto session = SessionManager::getInstance().getSession(session_id);
    if (session) {
      session->onDataFromServer(data);
    } else {
      std::cerr << "Session " << session_id << " not found for data forwarding" << std::endl;
    }
  }

  void OnSessionClosed(uint32_t session_id, uint32_t reason) override {
    std::cout << "OnSessionClosed: session " << session_id << ", reason " << reason << std::endl;
    auto session = SessionManager::getInstance().getSession(session_id);
    if (session) {
      session->onServerClosed(reason);
    }
    SessionManager::getInstance().unregisterSession(session_id);
  }
};

// SessionManager implementation should be placed after the SOCKS5Session class
void SessionManager::registerSession(uint32_t session_id, std::shared_ptr<SOCKS5Session> session) {
  std::lock_guard<std::mutex> lock(mutex_);
  sessions_[session_id] = session;
  std::cout << "Registered session " << session_id << std::endl;
}

void SessionManager::unregisterSession(uint32_t session_id) {
  std::lock_guard<std::mutex> lock(mutex_);
  sessions_.erase(session_id);
  std::cout << "Unregistered session " << session_id << std::endl;
}

std::shared_ptr<SOCKS5Session> SessionManager::getSession(uint32_t session_id) {
  std::lock_guard<std::mutex> lock(mutex_);
  auto it = sessions_.find(session_id);
  if (it != sessions_.end()) {
    return it->second.lock();
  }
  return nullptr;
}

} // anonymous namespace

class Proxy::Impl {
  nprpc::Rpc* rpc_;
  nprpc::Poa* poa_;
  proxy::Server* server_;
  proxy::User* user_;
  std::shared_ptr<SOCKS5Server> socks5_server_;
  std::unique_ptr<ProxySessionCallbacks> callbacks_;
  nprpc::ObjectId callbacks_activation_;

public:
  Impl(
    std::string_view host,
    std::string_view port, 
    std::string_view secret)
  {
    try {
      // Initialize NPRPC
      rpc_ = nprpc::RpcBuilder()
        .set_debug_level(nprpc::DebugLevel::DebugLevel_EveryCall)
        .build(thpool::get_instance().ctx());

      poa_ = nprpc::PoaBuilder(rpc_)
        .with_lifespan(nprpc::PoaPolicy::Lifespan::Persistent)
        .build();

      server_ = new proxy::Server(0); // Assuming 0 is the interface index
      auto& oid = server_->get_data();
      oid.object_id = 3;
      oid.poa_idx = 0;
      oid.flags = 1;
      oid.class_id = "proxy/proxy.Server";
      
      // Use the provided host and port
      std::string url = "ws://" + std::string(host) + ":" + std::string(port);
      oid.urls = url;
      server_->select_endpoint(std::nullopt);

      // Login to get the User proxy object
      nprpc::Object* user_obj;
      server_->LogIn(std::string(secret), user_obj);
      user_ = nprpc::narrow<proxy::User>(user_obj);
      
      if (!user_) {
        throw std::runtime_error("Failed to cast to proxy::User");
      }

      user_->add_ref(); // Increase reference count

      std::cout << "Successfully connected to proxy server" << std::endl;

      // Create and register session callbacks
      callbacks_ = std::make_unique<ProxySessionCallbacks>();
      callbacks_activation_ = poa_->activate_object(
        callbacks_.get(), 
        nprpc::ObjectActivationFlags::SESSION_SPECIFIC);
      
      user_->RegisterCallbacks(callbacks_activation_);
      std::cout << "Session callbacks registered" << std::endl;

      // Start SOCKS5 server on port 1080
      socks5_server_ = std::make_shared<SOCKS5Server>(
        thpool::get_instance().ctx(), 1080, user_);
      socks5_server_->start();

      std::cout << "SOCKS5 server started on port 1080" << std::endl;
      
    } catch (const proxy::AuthorizationFailed& ex) {
      std::cerr << "Authorization failed" << std::endl;
      throw;
    } catch (const std::exception& ex) {
      std::cerr << "An error occurred: " << ex.what() << std::endl;
      throw;
    }
  }
  
  ~Impl() {
    delete server_;
    // user_ is managed by NPRPC, don't delete it directly
  }
};



Proxy::Proxy(
    std::string_view host,
    std::string_view port,
    std::string_view secret) 
{
  impl_ = new Impl(host, port, secret);
}

Proxy::~Proxy() {
  delete impl_;
}
