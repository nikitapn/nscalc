#ifndef PROXY_HPP
#define PROXY_HPP

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
};


#endif // PROXY_HPP