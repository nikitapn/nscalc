#ifndef NPKCALC_
#define NPKCALC_

#include <nprpc/flat.hpp>
#include <nprpc/nprpc.hpp>

namespace npkcalc { 
enum class ELEMENT : uint32_t {
  N_NO3,
  N_NH4,
  P,
  K,
  Ca,
  Mg,
  S,
  Cl,
  Fe,
  Zn,
  B,
  Mn,
  Cu,
  Mo,
  CO3,
  _P1,
  _P2,
  _P3,
  _P4,
  _P5,
  _P6,
  _P7,
  _P8,
  H,
  O,
  C,
  NH4,
  NO3,
  SO4,
  H2PO4
};
struct Solution {
  uint32_t id;
  std::string name;
  std::string owner;
  std::array<double,14> elements;
};

namespace flat {
struct Solution {
  uint32_t id;
  ::flat::String name;
  ::flat::String owner;
  ::flat::Array<double,14> elements;
};

class Solution_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Solution*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Solution*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  Solution_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& id() const noexcept { return base().id;}
  uint32_t& id() noexcept { return base().id;}
  void name(const char* str) { new (&base().name) ::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::flat::String(buffer_, str); }
  auto name() noexcept { return (::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::flat::Span<const char>)base().name; }
  auto name_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(Solution, name));  }
  void owner(const char* str) { new (&base().owner) ::flat::String(buffer_, str); }
  void owner(const std::string& str) { new (&base().owner) ::flat::String(buffer_, str); }
  auto owner() noexcept { return (::flat::Span<char>)base().owner; }
  auto owner() const noexcept { return (::flat::Span<const char>)base().owner; }
  auto owner_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(Solution, owner));  }
  auto elements() noexcept { return (::flat::Span<double>)base().elements; }
};
} // namespace flat

enum class FertilizerBottle : uint8_t {
  BOTTLE_A,
  BOTTLE_B,
  BOTTLE_C
};
enum class FertilizerType : uint8_t {
  DRY,
  LIQUID,
  SOLUTION
};
struct Fertilizer {
  uint32_t id;
  std::string name;
  std::string owner;
  std::string formula;
};

namespace flat {
struct Fertilizer {
  uint32_t id;
  ::flat::String name;
  ::flat::String owner;
  ::flat::String formula;
};

class Fertilizer_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Fertilizer*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Fertilizer*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  Fertilizer_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& id() const noexcept { return base().id;}
  uint32_t& id() noexcept { return base().id;}
  void name(const char* str) { new (&base().name) ::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::flat::String(buffer_, str); }
  auto name() noexcept { return (::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::flat::Span<const char>)base().name; }
  auto name_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(Fertilizer, name));  }
  void owner(const char* str) { new (&base().owner) ::flat::String(buffer_, str); }
  void owner(const std::string& str) { new (&base().owner) ::flat::String(buffer_, str); }
  auto owner() noexcept { return (::flat::Span<char>)base().owner; }
  auto owner() const noexcept { return (::flat::Span<const char>)base().owner; }
  auto owner_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(Fertilizer, owner));  }
  void formula(const char* str) { new (&base().formula) ::flat::String(buffer_, str); }
  void formula(const std::string& str) { new (&base().formula) ::flat::String(buffer_, str); }
  auto formula() noexcept { return (::flat::Span<char>)base().formula; }
  auto formula() const noexcept { return (::flat::Span<const char>)base().formula; }
  auto formula_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(Fertilizer, formula));  }
};
} // namespace flat

struct TargetElement {
  double value;
  double value_base;
  double ratio;
};

namespace flat {
struct TargetElement {
  double value;
  double value_base;
  double ratio;
};

class TargetElement_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<TargetElement*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const TargetElement*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  TargetElement_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const double& value() const noexcept { return base().value;}
  double& value() noexcept { return base().value;}
  const double& value_base() const noexcept { return base().value_base;}
  double& value_base() noexcept { return base().value_base;}
  const double& ratio() const noexcept { return base().ratio;}
  double& ratio() noexcept { return base().ratio;}
};
} // namespace flat

struct Calculation {
  uint32_t id;
  std::string name;
  std::array<TargetElement,14> elements;
  std::vector<uint32_t> fertilizers_ids;
  double volume;
  bool mode;
};

namespace flat {
struct Calculation {
  uint32_t id;
  ::flat::String name;
  ::flat::Array<npkcalc::flat::TargetElement,14> elements;
  ::flat::Vector<uint32_t> fertilizers_ids;
  double volume;
  bool mode;
};

class Calculation_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Calculation*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Calculation*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  Calculation_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& id() const noexcept { return base().id;}
  uint32_t& id() noexcept { return base().id;}
  void name(const char* str) { new (&base().name) ::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::flat::String(buffer_, str); }
  auto name() noexcept { return (::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::flat::Span<const char>)base().name; }
  auto name_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(Calculation, name));  }
  auto elements() noexcept { return ::flat::Span_ref<npkcalc::flat::TargetElement, npkcalc::flat::TargetElement_Direct>(buffer_, base().elements.range(buffer_.data().data())); }
  void fertilizers_ids(size_t elements_size) { new (&base().fertilizers_ids) ::flat::Vector<uint32_t>(buffer_, elements_size); }
  auto fertilizers_ids_vd() noexcept { return ::flat::Vector_Direct1<uint32_t>(buffer_, offset_ + offsetof(Calculation, fertilizers_ids)); }
  auto fertilizers_ids() noexcept { return (::flat::Span<uint32_t>)base().fertilizers_ids; }
  const double& volume() const noexcept { return base().volume;}
  double& volume() noexcept { return base().volume;}
  const bool& mode() const noexcept { return base().mode;}
  bool& mode() noexcept { return base().mode;}
};
} // namespace flat

struct Media {
  std::string name;
  std::vector<uint8_t> data;
};

namespace flat {
struct Media {
  ::flat::String name;
  ::flat::Vector<uint8_t> data;
};

class Media_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Media*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Media*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  Media_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void name(const char* str) { new (&base().name) ::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::flat::String(buffer_, str); }
  auto name() noexcept { return (::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::flat::Span<const char>)base().name; }
  auto name_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(Media, name));  }
  void data(size_t elements_size) { new (&base().data) ::flat::Vector<uint8_t>(buffer_, elements_size); }
  auto data_vd() noexcept { return ::flat::Vector_Direct1<uint8_t>(buffer_, offset_ + offsetof(Media, data)); }
  auto data() noexcept { return (::flat::Span<uint8_t>)base().data; }
};
} // namespace flat

enum class AuthorizationFailed_Reason : uint8_t {
  email_does_not_exist,
  incorrect_password,
  session_does_not_exist
};
class AuthorizationFailed : public ::nprpc::Exception {
public:
  AuthorizationFailed_Reason reason;

  AuthorizationFailed() : ::nprpc::Exception("AuthorizationFailed") {} 
  AuthorizationFailed(AuthorizationFailed_Reason _reason)
    : ::nprpc::Exception("AuthorizationFailed")
    , reason(_reason)
  {
  }
};

namespace flat {
struct AuthorizationFailed {
  uint32_t __ex_id;
  AuthorizationFailed_Reason reason;
};

class AuthorizationFailed_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<AuthorizationFailed*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const AuthorizationFailed*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  AuthorizationFailed_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& __ex_id() const noexcept { return base().__ex_id;}
  uint32_t& __ex_id() noexcept { return base().__ex_id;}
  const AuthorizationFailed_Reason& reason() const noexcept { return base().reason;}
  AuthorizationFailed_Reason& reason() noexcept { return base().reason;}
};
} // namespace flat

struct UserData {
  std::string name;
  std::string session_id;
  nprpc::ObjectId db;
};

namespace flat {
struct UserData {
  ::flat::String name;
  ::flat::String session_id;
  nprpc::detail::flat::ObjectId db;
};

class UserData_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<UserData*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const UserData*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  UserData_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void name(const char* str) { new (&base().name) ::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::flat::String(buffer_, str); }
  auto name() noexcept { return (::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::flat::Span<const char>)base().name; }
  auto name_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(UserData, name));  }
  void session_id(const char* str) { new (&base().session_id) ::flat::String(buffer_, str); }
  void session_id(const std::string& str) { new (&base().session_id) ::flat::String(buffer_, str); }
  auto session_id() noexcept { return (::flat::Span<char>)base().session_id; }
  auto session_id() const noexcept { return (::flat::Span<const char>)base().session_id; }
  auto session_id_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(UserData, session_id));  }
  auto db() noexcept { return nprpc::detail::flat::ObjectId_Direct(buffer_, offset_ + offsetof(UserData, db)); }
};
} // namespace flat

struct SolutionElement {
  uint32_t index;
  double value;
};

namespace flat {
struct SolutionElement {
  uint32_t index;
  double value;
};

class SolutionElement_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<SolutionElement*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const SolutionElement*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  SolutionElement_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& index() const noexcept { return base().index;}
  uint32_t& index() noexcept { return base().index;}
  const double& value() const noexcept { return base().value;}
  double& value() noexcept { return base().value;}
};
} // namespace flat

class IAuthorizator_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.Authorizator"; }
  std::string_view get_class() const noexcept override { return IAuthorizator_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual UserData LogIn (::flat::Span<char> login, ::flat::Span<char> password) = 0;
  virtual UserData LogInWithSessionId (::flat::Span<char> session_id) = 0;
  virtual bool LogOut (::flat::Span<char> session_id) = 0;
};

class Authorizator
  : public virtual nprpc::Object
{
  const uint8_t interface_idx_;
public:
  using servant_t = IAuthorizator_Servant;

  Authorizator(uint8_t interface_idx) : interface_idx_(interface_idx) {}
  UserData LogIn (/*in*/const std::string& login, /*in*/const std::string& password);
  UserData LogInWithSessionId (/*in*/const std::string& session_id);
  bool LogOut (/*in*/const std::string& session_id);
};

class IRegisteredUser_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.RegisteredUser"; }
  std::string_view get_class() const noexcept override { return IRegisteredUser_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual void GetMyCalculations (/*out*/::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct> calculations) = 0;
  virtual uint32_t AddSolution (::flat::Span<char> name, ::flat::Span<double> elements) = 0;
  virtual void SetSolutionName (uint32_t id, ::flat::Span<char> name) = 0;
  virtual void SetSolutionElements (uint32_t id, ::flat::Span_ref<npkcalc::flat::SolutionElement, npkcalc::flat::SolutionElement_Direct> name) = 0;
  virtual void DeleteSolution (uint32_t id) = 0;
  virtual uint32_t AddFertilizer (::flat::Span<char> name, ::flat::Span<char> formula) = 0;
  virtual void SetFertilizerName (uint32_t id, ::flat::Span<char> name) = 0;
  virtual void SetFertilizerFormula (uint32_t id, ::flat::Span<char> name) = 0;
  virtual void DeleteFertilizer (uint32_t id) = 0;
  virtual void SaveData () = 0;
  virtual void Advise (nprpc::Object* obj) = 0;
};

class RegisteredUser
  : public virtual nprpc::Object
{
  const uint8_t interface_idx_;
public:
  using servant_t = IRegisteredUser_Servant;

  RegisteredUser(uint8_t interface_idx) : interface_idx_(interface_idx) {}
  void GetMyCalculations (/*out*/std::vector<npkcalc::Calculation>& calculations);
  uint32_t AddSolution (/*in*/const std::string& name, /*in*/const std::array<double,14>& elements);
  void SetSolutionName (/*in*/uint32_t id, /*in*/const std::string& name);
  void SetSolutionElements (/*in*/uint32_t id, /*in*/::flat::Span<const npkcalc::SolutionElement> name);
  void DeleteSolution (/*in*/uint32_t id);
  uint32_t AddFertilizer (/*in*/const std::string& name, /*in*/const std::string& formula);
  void SetFertilizerName (/*in*/uint32_t id, /*in*/const std::string& name);
  void SetFertilizerFormula (/*in*/uint32_t id, /*in*/const std::string& name);
  void DeleteFertilizer (/*in*/uint32_t id);
  void SaveData ();
  void Advise (/*in*/const ObjectId& obj);
};

class IDataObserver_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.DataObserver"; }
  std::string_view get_class() const noexcept override { return IDataObserver_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual void DataChanged (uint32_t idx) = 0;
};

class DataObserver
  : public virtual nprpc::Object
{
  const uint8_t interface_idx_;
public:
  using servant_t = IDataObserver_Servant;

  DataObserver(uint8_t interface_idx) : interface_idx_(interface_idx) {}
  void DataChanged (/*in*/uint32_t idx);
};

class ICalculator_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.Calculator"; }
  std::string_view get_class() const noexcept override { return ICalculator_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual void GetData (/*out*/::flat::Vector_Direct2<npkcalc::flat::Solution, npkcalc::flat::Solution_Direct> solutions, /*out*/::flat::Vector_Direct2<npkcalc::flat::Fertilizer, npkcalc::flat::Fertilizer_Direct> fertilizers) = 0;
  virtual void GetImages (/*out*/::flat::Vector_Direct2<npkcalc::flat::Media, npkcalc::flat::Media_Direct> images) = 0;
};

class Calculator
  : public virtual nprpc::Object
{
  const uint8_t interface_idx_;
public:
  using servant_t = ICalculator_Servant;

  Calculator(uint8_t interface_idx) : interface_idx_(interface_idx) {}
  void GetData (/*out*/std::vector<npkcalc::Solution>& solutions, /*out*/std::vector<npkcalc::Fertilizer>& fertilizers);
  void GetImages (/*out*/std::vector<npkcalc::Media>& images);
};

} // namespace npkcalc

namespace npkcalc::helper {
template<::nprpc::IterableCollection T>
void assign_LogIn_ret_val(npkcalc::flat::UserData_Direct& dest, const T & src) {
  dest.name(src.name);
  dest.session_id(src.session_id);
  memcpy(dest.db().__data(), &src.db._data(), 24);
  dest.db().class_id(src.db._data().class_id);
}
template<::nprpc::IterableCollection T>
void assign_GetMyCalculations_calculations(/*out*/::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct>& dest, const T & src) {
  dest.length(src.size());
  auto span = dest();
  auto it = src.begin();
  for (auto e : span) {
    auto __ptr = ::nprpc::make_wrapper1(*it);
    e.id() = __ptr->id;
    e.name(__ptr->name);
  memcpy(  e.elements().data(), __ptr->elements.data(), __ptr->elements.size() * 24);
    e.fertilizers_ids(__ptr->fertilizers_ids.size());
  memcpy(  e.fertilizers_ids().data(), __ptr->fertilizers_ids.data(), __ptr->fertilizers_ids.size() * 4);
    e.volume() = __ptr->volume;
    e.mode() = __ptr->mode;
    ++it;
  }
}
template<::nprpc::IterableCollection T>
void assign_GetData_solutions(/*out*/::flat::Vector_Direct2<npkcalc::flat::Solution, npkcalc::flat::Solution_Direct>& dest, const T & src) {
  dest.length(src.size());
  auto span = dest();
  auto it = src.begin();
  for (auto e : span) {
    auto __ptr = ::nprpc::make_wrapper1(*it);
    e.id() = __ptr->id;
    e.name(__ptr->name);
    e.owner(__ptr->owner);
  memcpy(  e.elements().data(), __ptr->elements.data(), __ptr->elements.size() * 8);
    ++it;
  }
}
template<::nprpc::IterableCollection T>
void assign_GetData_fertilizers(/*out*/::flat::Vector_Direct2<npkcalc::flat::Fertilizer, npkcalc::flat::Fertilizer_Direct>& dest, const T & src) {
  dest.length(src.size());
  auto span = dest();
  auto it = src.begin();
  for (auto e : span) {
    auto __ptr = ::nprpc::make_wrapper1(*it);
    e.id() = __ptr->id;
    e.name(__ptr->name);
    e.owner(__ptr->owner);
    e.formula(__ptr->formula);
    ++it;
  }
}
template<::nprpc::IterableCollection T>
void assign_GetImages_images(/*out*/::flat::Vector_Direct2<npkcalc::flat::Media, npkcalc::flat::Media_Direct>& dest, const T & src) {
  dest.length(src.size());
  auto span = dest();
  auto it = src.begin();
  for (auto e : span) {
    auto __ptr = ::nprpc::make_wrapper1(*it);
    e.name(__ptr->name);
    e.data(__ptr->data.size());
  memcpy(  e.data().data(), __ptr->data.data(), __ptr->data.size() * 1);
    ++it;
  }
}
} // namespace npkcalc::helper

#endif