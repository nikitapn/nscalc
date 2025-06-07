#include "proxy.hpp"
#include "util.hpp"

#include <boost/asio.hpp>
#include <boost/asio/ip/tcp.hpp>

#include <proxy_stub/proxy.hpp>

#include <iostream>

// using namespace boost::asio;
// using namespace boost::asio::ip;

/*
class Session_Socket
  : public std::enable_shared_from_this<Session_Socket> {

  struct work {
    virtual void operator()() = 0;
    virtual ~work() = default;
  };

  tcp::socket socket_;
  uint32_t size_to_read_ = 0;
  std::deque<std::unique_ptr<work>> write_queue_;
public:
  virtual void timeout_action() final {
    assert(false);
  }
  virtual void send_receive(
		flat_buffer&,
		uint32_t
	) {
    assert(false);
	}

	virtual void send_receive_async(
		flat_buffer&&,
		std::optional<std::function<void(const boost::system::error_code&, flat_buffer&)>>&&,
		uint32_t
	) {
    assert(false);
	}

  void on_write(boost::system::error_code ec, std::size_t) {
    if (ec) return fail(ec, "write");

    assert(write_queue_.size() >= 1);
    write_queue_.pop_front();

    if (write_queue_.size()) {
      (*write_queue_.front())();
    } else {
      do_read_size();
    }
  }

  void on_read_body(const boost::system::error_code& ec, size_t len) {
    if (ec) {
      fail(ec, "read");
      return;
    }

    rx_buffer_().commit(len);
    size_to_read_ -= static_cast<uint32_t>(len);

    if (size_to_read_ != 0) {
      do_read_body();
      return;
    }

    // readed the whole message

    handle_request();

    write_queue_.push_front({});

    socket_.async_send(rx_buffer_().cdata(),
      std::bind(&Session_Socket::on_write, shared_from_this(),
        std::placeholders::_1, std::placeholders::_2)
    );
  }

  void do_read_body() {
    socket_.async_read_some(rx_buffer_().prepare(size_to_read_),
      std::bind(&Session_Socket::on_read_body, shared_from_this(),
        std::placeholders::_1, std::placeholders::_2)
    );
  }

  void on_read_size(const boost::system::error_code& ec, size_t len) {
    if (ec) {
      fail(ec, "read");
      return;
    }

    assert(len == 4);

    if (size_to_read_ > max_message_size) return;

    *(uint32_t*)rx_buffer_().data().data() = size_to_read_;
    rx_buffer_().commit(4);

    do_read_body();
  }

  void do_read_size() {
    rx_buffer_().consume(rx_buffer_().size());
    rx_buffer_().prepare(4);
    socket_.async_read_some(net::mutable_buffer(&size_to_read_, 4),
      std::bind(&Session_Socket::on_read_size, shared_from_this(),
        std::placeholders::_1, std::placeholders::_2)
    );
  }

  void run() {
    do_read_size();
  }

  Session(tcp::socket&& socket)
    : Session(socket.get_executor())
    , socket_(std::move(socket))
  {
  }
};

class Acceptor : public std::enable_shared_from_this<Acceptor> {
  io_context& ioc_;
  tcp::acceptor acceptor_;
public:
  void on_accept(const boost::system::error_code& ec, tcp::socket socket) {
    if (ec) {
      fail(ec, "accept");
    }
    std::make_shared<Session_Socket>(std::move(socket))->run();
    do_accept();
  }

  void do_accept() {
    acceptor_.async_accept(net::make_strand(ioc_),
      boost::beast::bind_front_handler(&Acceptor::on_accept, shared_from_this())
    );
  }

  Acceptor(io_context& ioc, unsigned short port)
    : ioc_(ioc)
    , acceptor_(ioc, tcp::endpoint(tcp::v4(), port))
  {
  }
};
*/


class Proxy::Impl {
  proxy::Server* server_;
  proxy::User* user_;
public:
  Impl(
    std::string_view host,
    std::string_view port, 
    std::string_view secret)
  {
    try {
    // Implementation details go here
      auto rpc = nprpc::RpcBuilder()
        .build(thpool::get_instance().ctx());
    
      server_ = new proxy::Server(0); // Assuming 0 is the interface index
      auto& oid = server_->get_data();
      oid.object_id = 3;
      oid.poa_idx = 0;
      oid.flags = 1;
      oid.class_id = "proxy/proxy.Server";
      oid.urls = "ws://127.0.0.1:8080;wss://127.0.0.1:8080";
      server_->select_endpoint(std::nullopt);

      nprpc::Object* user;
      server_->LogIn("1234", user);
    } catch (const proxy::AuthorizationFailed& ex) {
      std::cerr << "Authorization failed: " << ex.what() << std::endl;
      throw;
    } catch (const std::exception& ex) {
      std::cerr << "An error occurred: " << ex.what() << std::endl;
      throw;
    }
  }
};


Proxy::Proxy(
    std::string_view host,
    std::string_view secret,
    std::string_view socks5_port) 
{
  impl_ = new Impl(host, secret, socks5_port);
  // Additional initialization if needed
}
