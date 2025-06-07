#pragma once

#include "proxy_stub/proxy.hpp"

class ProxyUser : public proxy::IUser_Servant {
public:
  virtual proxy::bytestream SendRecive(::nprpc::flat::Span<uint8_t> data) override
  {
    std::cout << "ProxyUser::SendRecive called." << std::endl;
    return proxy::bytestream();
  }
};

class ProxyImpl : public proxy::IServer_Servant {
  nprpc::Rpc& rpc_;
  nprpc::Poa* poa_ = nullptr;
public:
  virtual void LogIn (::nprpc::flat::Span<char> secret, nprpc::detail::flat::ObjectId_Direct user)
  {
    // TODO: Check secret to some database or something
    std::cout << "ProxyImpl::LogIn called." << std::endl;
    auto oid = poa_->activate_object(
      new ProxyUser(),
      nprpc::ObjectActivationFlags::SESSION_SPECIFIC, // activation_flags
      &nprpc::get_context() // session context
    );
    nprpc::Object::assign_to_direct(oid, user);
    std::cout << "User logged in with ID: " << oid.object_id() << std::endl;
  }

  ProxyImpl(nprpc::Rpc& rpc)
    : rpc_(rpc)
  {
    poa_ = nprpc::PoaBuilder(&rpc_)
      .with_lifespan(nprpc::PoaPolicy::Lifespan::Transient)
      .with_max_objects(32)
      .build();
  }
};