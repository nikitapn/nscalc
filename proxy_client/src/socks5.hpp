#pragma once

#include <string_view>

class Proxy
{
  class Impl;
  Impl* impl_;
public:
  Proxy(
    std::string_view host,
    std::string_view port,
    std::string_view secret);
  ~Proxy();
};
