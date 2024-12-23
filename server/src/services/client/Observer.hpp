#pragma once

#include <nprpc/nprpc.hpp>
#include "util/util.hpp"

template <typename T>
class ObserversT {
  boost::asio::io_context::strand strand_;

protected:
  std::vector<std::unique_ptr<T>> observers;

  auto& executor() { return strand_; }

  struct no_condition_t {
    bool operator()(std::unique_ptr<T>&) {
      return false;
    }
  };

  struct not_equal_t {
    T *target;
    bool operator()(std::unique_ptr<T>& obj) const noexcept {
      return target == obj.get();
    }
  };

  struct not_equal_to_endpoint_t {
    const nprpc::EndPoint& endpoint;
    bool operator()(std::unique_ptr<T>& obj) const noexcept {
      return obj->_data().ip4 == endpoint.ip4 &&
             obj->_data().port == endpoint.port;
    }
  };

  static constexpr auto no_condition = no_condition_t{};

  template <typename F, typename Condition, typename... Args>
  void broadcast(F fn, Condition cond, const Args&... args) {
    for (auto it = std::begin(observers); it != observers.end();) {
      if (cond(*it)) {
        it = std::next(it);
        continue;
      }
      try {
        std::mem_fn(fn)(*it, std::nullopt, args...);
        it = std::next(it);
      } catch (nprpc::Exception&) {
        it = observers.erase(it); // session was closed
      }
    }
  }

  void add_impl(T* observer) { observers.emplace_back(observer); }

public:
  void add(T* observer) { nplib::async<false>(executor(), &ObserversT::add_impl, this, observer); }

  ObserversT() : strand_{ thread_pool::get_instance().make_strand() } {}
};
