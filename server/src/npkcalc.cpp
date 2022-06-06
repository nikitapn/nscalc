#include "npkcalc.hpp"
#include "npkcalc_m.hpp"
#include <nprpc/nprpc_impl.hpp>

void npkcalc_throw_exception(boost::beast::flat_buffer& buf);

namespace npkcalc { 
UserData npkcalc::Authorizator::LogIn(/*in*/const std::string& login, /*in*/const std::string& password) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(176);
    buf.commit(48);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 0;
  ::flat::npkcalc_M1_Direct _(buf,32);
  _._1(login);
  _._2(password);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M2_Direct out(buf, sizeof(::nprpc::impl::Header));
  UserData __ret_value;
  __ret_value.name = (std::string_view)out._1().name();
  __ret_value.session_id = (std::string_view)out._1().session_id();
  __ret_value.db.assign_from_direct(out._1().db());
  return __ret_value;
}

UserData npkcalc::Authorizator::LogInWithSessionId(/*in*/const std::string& session_id) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(168);
    buf.commit(40);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 1;
  ::flat::npkcalc_M3_Direct _(buf,32);
  _._1(session_id);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M2_Direct out(buf, sizeof(::nprpc::impl::Header));
  UserData __ret_value;
  __ret_value.name = (std::string_view)out._1().name();
  __ret_value.session_id = (std::string_view)out._1().session_id();
  __ret_value.db.assign_from_direct(out._1().db());
  return __ret_value;
}

bool npkcalc::Authorizator::LogOut(/*in*/const std::string& session_id) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(168);
    buf.commit(40);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 2;
  ::flat::npkcalc_M3_Direct _(buf,32);
  _._1(session_id);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M4_Direct out(buf, sizeof(::nprpc::impl::Header));
  bool __ret_value;
  __ret_value = out._1();
  return __ret_value;
}

void npkcalc::IAuthorizator_Servant::dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) {
  nprpc::impl::flat::CallHeader_Direct __ch(bufs(), sizeof(::nprpc::impl::Header));
  switch(__ch.function_idx()) {
    case 0: {
      ::flat::npkcalc_M1_Direct ia(bufs(), 32);
      auto& obuf = bufs.flip();
      obuf.consume(obuf.size());
      obuf.prepare(200);
      obuf.commit(72);
      ::flat::npkcalc_M2_Direct oa(obuf,16);
UserData __ret_val;
      try {
      __ret_val = LogIn(ia._1(), ia._2());
      }
      catch(npkcalc::AuthorizationFailed& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(24);
        obuf.commit(24);
        npkcalc::flat::AuthorizationFailed_Direct oa(obuf,16);
        oa.__ex_id() = 0;
  oa.reason() = e.reason;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
  oa._1().name(__ret_val.name);
  oa._1().session_id(__ret_val.session_id);
  memcpy(oa._1().db().__data(), &__ret_val.db._data(), 24);
  oa._1().db().class_id(__ret_val.db._data().class_id);
  oa._1().db().hostname(__ret_val.db._data().hostname);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 1: {
      ::flat::npkcalc_M3_Direct ia(bufs(), 32);
      auto& obuf = bufs.flip();
      obuf.consume(obuf.size());
      obuf.prepare(200);
      obuf.commit(72);
      ::flat::npkcalc_M2_Direct oa(obuf,16);
UserData __ret_val;
      try {
      __ret_val = LogInWithSessionId(ia._1());
      }
      catch(npkcalc::AuthorizationFailed& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(24);
        obuf.commit(24);
        npkcalc::flat::AuthorizationFailed_Direct oa(obuf,16);
        oa.__ex_id() = 0;
  oa.reason() = e.reason;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
  oa._1().name(__ret_val.name);
  oa._1().session_id(__ret_val.session_id);
  memcpy(oa._1().db().__data(), &__ret_val.db._data(), 24);
  oa._1().db().class_id(__ret_val.db._data().class_id);
  oa._1().db().hostname(__ret_val.db._data().hostname);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 2: {
      ::flat::npkcalc_M3_Direct ia(bufs(), 32);
bool __ret_val;
      __ret_val = LogOut(ia._1());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(17);
      obuf.commit(17);
      ::flat::npkcalc_M4_Direct oa(obuf,16);
  oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    default:
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Error_UnknownFunctionIdx);
  }
}

void npkcalc::RegisteredUser::GetMyCalculations(/*out*/std::vector<npkcalc::Calculation>& calculations) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(32);
    buf.commit(32);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 0;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M5_Direct out(buf, sizeof(::nprpc::impl::Header));
  {
    auto span = out._1();
    calculations.resize(span.size());
  }
}

uint32_t npkcalc::RegisteredUser::AddSolution(/*in*/const std::string& name, /*in*/const std::array<double,14>& elements) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(280);
    buf.commit(152);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 1;
  ::flat::npkcalc_M6_Direct _(buf,32);
  _._1(name);
  memcpy(_._2().data(), elements.data(), elements.size() * 8);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M7_Direct out(buf, sizeof(::nprpc::impl::Header));
  uint32_t __ret_value;
  __ret_value = out._1();
  return __ret_value;
}

void npkcalc::RegisteredUser::SetSolutionName(/*in*/uint32_t id, /*in*/const std::string& name) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(172);
    buf.commit(44);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 2;
  ::flat::npkcalc_M8_Direct _(buf,32);
  _._1() = id;
  _._2(name);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::SetSolutionElements(/*in*/uint32_t id, /*in*/::flat::Span<const npkcalc::SolutionElement> name) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(172);
    buf.commit(44);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 3;
  ::flat::npkcalc_M9_Direct _(buf,32);
  _._1() = id;
  _._2(name.size());
  memcpy(_._2().data(), name.data(), name.size() * 16);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::DeleteSolution(/*in*/uint32_t id) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(36);
    buf.commit(36);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 4;
  ::flat::npkcalc_M7_Direct _(buf,32);
  _._1() = id;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

uint32_t npkcalc::RegisteredUser::AddFertilizer(/*in*/const std::string& name, /*in*/const std::string& formula) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(176);
    buf.commit(48);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 5;
  ::flat::npkcalc_M1_Direct _(buf,32);
  _._1(name);
  _._2(formula);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M7_Direct out(buf, sizeof(::nprpc::impl::Header));
  uint32_t __ret_value;
  __ret_value = out._1();
  return __ret_value;
}

void npkcalc::RegisteredUser::SetFertilizerName(/*in*/uint32_t id, /*in*/const std::string& name) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(172);
    buf.commit(44);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 6;
  ::flat::npkcalc_M8_Direct _(buf,32);
  _._1() = id;
  _._2(name);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::SetFertilizerFormula(/*in*/uint32_t id, /*in*/const std::string& name) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(172);
    buf.commit(44);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 7;
  ::flat::npkcalc_M8_Direct _(buf,32);
  _._1() = id;
  _._2(name);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::DeleteFertilizer(/*in*/uint32_t id) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(36);
    buf.commit(36);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 8;
  ::flat::npkcalc_M7_Direct _(buf,32);
  _._1() = id;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::SaveData() {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(32);
    buf.commit(32);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 9;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

uint32_t npkcalc::RegisteredUser::UpdateCalculation(/*in*/const npkcalc::Calculation& calculation) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(536);
    buf.commit(408);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 10;
  ::flat::npkcalc_M10_Direct _(buf,32);
  _._1().id() = calculation.id;
  _._1().name(calculation.name);
  memcpy(_._1().elements().data(), calculation.elements.data(), calculation.elements.size() * 24);
  _._1().fertilizers_ids(calculation.fertilizers_ids.size());
  memcpy(_._1().fertilizers_ids().data(), calculation.fertilizers_ids.data(), calculation.fertilizers_ids.size() * 4);
  _._1().volume() = calculation.volume;
  _._1().mode() = calculation.mode;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M7_Direct out(buf, sizeof(::nprpc::impl::Header));
  uint32_t __ret_value;
  __ret_value = out._1();
  return __ret_value;
}

void npkcalc::RegisteredUser::DeleteCalculation(/*in*/uint32_t id) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(36);
    buf.commit(36);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 11;
  ::flat::npkcalc_M7_Direct _(buf,32);
  _._1() = id;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::IRegisteredUser_Servant::dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) {
  nprpc::impl::flat::CallHeader_Direct __ch(bufs(), sizeof(::nprpc::impl::Header));
  switch(__ch.function_idx()) {
    case 0: {
      auto& obuf = bufs.flip();
      obuf.consume(obuf.size());
      obuf.prepare(152);
      obuf.commit(24);
      ::flat::npkcalc_M5_Direct oa(obuf,16);
      GetMyCalculations(oa._1_vd());
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 1: {
      ::flat::npkcalc_M6_Direct ia(bufs(), 32);
uint32_t __ret_val;
      __ret_val = AddSolution(ia._1(), ia._2());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(20);
      obuf.commit(20);
      ::flat::npkcalc_M7_Direct oa(obuf,16);
  oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 2: {
      ::flat::npkcalc_M8_Direct ia(bufs(), 32);
      SetSolutionName(ia._1(), ia._2());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 3: {
      ::flat::npkcalc_M9_Direct ia(bufs(), 32);
      SetSolutionElements(ia._1(), ia._2());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 4: {
      ::flat::npkcalc_M7_Direct ia(bufs(), 32);
      DeleteSolution(ia._1());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 5: {
      ::flat::npkcalc_M1_Direct ia(bufs(), 32);
uint32_t __ret_val;
      __ret_val = AddFertilizer(ia._1(), ia._2());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(20);
      obuf.commit(20);
      ::flat::npkcalc_M7_Direct oa(obuf,16);
  oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 6: {
      ::flat::npkcalc_M8_Direct ia(bufs(), 32);
      SetFertilizerName(ia._1(), ia._2());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 7: {
      ::flat::npkcalc_M8_Direct ia(bufs(), 32);
      SetFertilizerFormula(ia._1(), ia._2());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 8: {
      ::flat::npkcalc_M7_Direct ia(bufs(), 32);
      DeleteFertilizer(ia._1());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 9: {
      SaveData();
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 10: {
      ::flat::npkcalc_M10_Direct ia(bufs(), 32);
uint32_t __ret_val;
      __ret_val = UpdateCalculation(ia._1());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(20);
      obuf.commit(20);
      ::flat::npkcalc_M7_Direct oa(obuf,16);
  oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 11: {
      ::flat::npkcalc_M7_Direct ia(bufs(), 32);
      DeleteCalculation(ia._1());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    default:
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Error_UnknownFunctionIdx);
  }
}

void npkcalc::DataObserver::DataChanged(/*in*/uint32_t idx) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(36);
    buf.commit(36);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 0;
  ::flat::npkcalc_M7_Direct _(buf,32);
  _._1() = idx;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::DataObserver::OnAlarm(/*in*/const npkcalc::Alarm& alarm) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(176);
    buf.commit(48);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 1;
  ::flat::npkcalc_M11_Direct _(buf,32);
  _._1().id() = alarm.id;
  _._1().type() = alarm.type;
  _._1().msg(alarm.msg);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::IDataObserver_Servant::dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) {
  nprpc::impl::flat::CallHeader_Direct __ch(bufs(), sizeof(::nprpc::impl::Header));
  switch(__ch.function_idx()) {
    case 0: {
      ::flat::npkcalc_M7_Direct ia(bufs(), 32);
      DataChanged(ia._1());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 1: {
      ::flat::npkcalc_M11_Direct ia(bufs(), 32);
      OnAlarm(ia._1());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    default:
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Error_UnknownFunctionIdx);
  }
}

void npkcalc::Calculator::GetData(/*out*/std::vector<npkcalc::Solution>& solutions, /*out*/std::vector<npkcalc::Fertilizer>& fertilizers) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(32);
    buf.commit(32);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 0;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M12_Direct out(buf, sizeof(::nprpc::impl::Header));
  {
    auto span = out._1();
    solutions.resize(span.size());
  }
  {
    auto span = out._2();
    fertilizers.resize(span.size());
  }
}

void npkcalc::Calculator::GetImages(/*out*/std::vector<npkcalc::Media>& images) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(32);
    buf.commit(32);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 1;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M13_Direct out(buf, sizeof(::nprpc::impl::Header));
  {
    auto span = out._1();
    images.resize(span.size());
  }
}

void npkcalc::Calculator::Subscribe(/*in*/const ObjectId& obj) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(200);
    buf.commit(72);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 2;
  ::flat::npkcalc_M14_Direct _(buf,32);
  memcpy(_._1().__data(), &obj._data(), 24);
  _._1().class_id(obj._data().class_id);
  _._1().hostname(obj._data().hostname);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::Calculator::GetGuestCalculations(/*out*/std::vector<npkcalc::Calculation>& calculations) {
  boost::beast::flat_buffer buf;
  {
    auto mb = buf.prepare(32);
    buf.commit(32);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 3;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  ::flat::npkcalc_M5_Direct out(buf, sizeof(::nprpc::impl::Header));
  {
    auto span = out._1();
    calculations.resize(span.size());
  }
}

void npkcalc::ICalculator_Servant::dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) {
  nprpc::impl::flat::CallHeader_Direct __ch(bufs(), sizeof(::nprpc::impl::Header));
  switch(__ch.function_idx()) {
    case 0: {
      auto& obuf = bufs.flip();
      obuf.consume(obuf.size());
      obuf.prepare(160);
      obuf.commit(32);
      ::flat::npkcalc_M12_Direct oa(obuf,16);
      GetData(oa._1_vd(), oa._2_vd());
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 1: {
      auto& obuf = bufs.flip();
      obuf.consume(obuf.size());
      obuf.prepare(152);
      obuf.commit(24);
      ::flat::npkcalc_M13_Direct oa(obuf,16);
      GetImages(oa._1_vd());
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 2: {
      ::flat::npkcalc_M14_Direct ia(bufs(), 32);
      Subscribe(nprpc::impl::g_orb->create_object_from_flat(ia._1(), remote_endpoint));
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 3: {
      auto& obuf = bufs.flip();
      obuf.consume(obuf.size());
      obuf.prepare(152);
      obuf.commit(24);
      ::flat::npkcalc_M5_Direct oa(obuf,16);
      GetGuestCalculations(oa._1_vd());
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    default:
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Error_UnknownFunctionIdx);
  }
}

} // namespace npkcalc


void npkcalc_throw_exception(boost::beast::flat_buffer& buf) { 
  switch(*(uint32_t*)( (char*)buf.data().data() + sizeof(::nprpc::impl::Header)) ) {
  case 0:
  {
    npkcalc::flat::AuthorizationFailed_Direct ex_flat(buf, sizeof(::nprpc::impl::Header));
    npkcalc::AuthorizationFailed ex;
  ex.reason = ex_flat.reason();
    throw ex;
  }
  default:
    throw std::runtime_error("unknown rpc exception");
  }
}
