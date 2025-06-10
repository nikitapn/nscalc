#pragma once

#include <nprpc/nprpc.hpp>

#include <memory>
#include <string_view>

enum class ProxyStatus {
  Disconnected,
  Connecting,
  Connected,
  Error
};

class Proxy
{
  class Impl;
  Impl* impl_;
public:
  void connect(
    std::string_view host,
    std::string_view port,
    std::string_view login,
    std::string_view password,
    std::function<void(ProxyStatus)> status_callback);

  static std::unique_ptr<Proxy> create();

  Proxy(nprpc::Rpc& rpc);
  ~Proxy();
};


