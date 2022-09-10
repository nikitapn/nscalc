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
  ::nprpc::flat::String name;
  ::nprpc::flat::String owner;
  ::nprpc::flat::Array<double,14> elements;
};

class Solution_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Solution*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Solution*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  Solution_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& id() const noexcept { return base().id;}
  uint32_t& id() noexcept { return base().id;}
  void name(const char* str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  auto name() noexcept { return (::nprpc::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::nprpc::flat::Span<const char>)base().name; }
  auto name_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(Solution, name));  }
  void owner(const char* str) { new (&base().owner) ::nprpc::flat::String(buffer_, str); }
  void owner(const std::string& str) { new (&base().owner) ::nprpc::flat::String(buffer_, str); }
  auto owner() noexcept { return (::nprpc::flat::Span<char>)base().owner; }
  auto owner() const noexcept { return (::nprpc::flat::Span<const char>)base().owner; }
  auto owner_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(Solution, owner));  }
  auto elements() noexcept { return (::nprpc::flat::Span<double>)base().elements; }
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
  ::nprpc::flat::String name;
  ::nprpc::flat::String owner;
  ::nprpc::flat::String formula;
};

class Fertilizer_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Fertilizer*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Fertilizer*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  Fertilizer_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& id() const noexcept { return base().id;}
  uint32_t& id() noexcept { return base().id;}
  void name(const char* str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  auto name() noexcept { return (::nprpc::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::nprpc::flat::Span<const char>)base().name; }
  auto name_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(Fertilizer, name));  }
  void owner(const char* str) { new (&base().owner) ::nprpc::flat::String(buffer_, str); }
  void owner(const std::string& str) { new (&base().owner) ::nprpc::flat::String(buffer_, str); }
  auto owner() noexcept { return (::nprpc::flat::Span<char>)base().owner; }
  auto owner() const noexcept { return (::nprpc::flat::Span<const char>)base().owner; }
  auto owner_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(Fertilizer, owner));  }
  void formula(const char* str) { new (&base().formula) ::nprpc::flat::String(buffer_, str); }
  void formula(const std::string& str) { new (&base().formula) ::nprpc::flat::String(buffer_, str); }
  auto formula() noexcept { return (::nprpc::flat::Span<char>)base().formula; }
  auto formula() const noexcept { return (::nprpc::flat::Span<const char>)base().formula; }
  auto formula_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(Fertilizer, formula));  }
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
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<TargetElement*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const TargetElement*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  TargetElement_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
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
  ::nprpc::flat::String name;
  ::nprpc::flat::Array<npkcalc::flat::TargetElement,14> elements;
  ::nprpc::flat::Vector<uint32_t> fertilizers_ids;
  double volume;
  ::nprpc::flat::Boolean mode;
};

class Calculation_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Calculation*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Calculation*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  Calculation_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& id() const noexcept { return base().id;}
  uint32_t& id() noexcept { return base().id;}
  void name(const char* str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  auto name() noexcept { return (::nprpc::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::nprpc::flat::Span<const char>)base().name; }
  auto name_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(Calculation, name));  }
  auto elements() noexcept { return ::nprpc::flat::Span_ref<npkcalc::flat::TargetElement, npkcalc::flat::TargetElement_Direct>(buffer_, base().elements.range(buffer_.data().data())); }
  void fertilizers_ids(std::uint32_t elements_size) { new (&base().fertilizers_ids) ::nprpc::flat::Vector<uint32_t>(buffer_, elements_size); }
  auto fertilizers_ids_d() noexcept { return ::nprpc::flat::Vector_Direct1<uint32_t>(buffer_, offset_ + offsetof(Calculation, fertilizers_ids)); }
  auto fertilizers_ids() noexcept { return (::nprpc::flat::Span<uint32_t>)base().fertilizers_ids; }
  const double& volume() const noexcept { return base().volume;}
  double& volume() noexcept { return base().volume;}
  const ::nprpc::flat::Boolean& mode() const noexcept { return base().mode;}
  ::nprpc::flat::Boolean& mode() noexcept { return base().mode;}
};
} // namespace flat

struct Media {
  std::string name;
  std::vector<uint8_t> data;
};

namespace flat {
struct Media {
  ::nprpc::flat::String name;
  ::nprpc::flat::Vector<uint8_t> data;
};

class Media_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Media*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Media*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  Media_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void name(const char* str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  auto name() noexcept { return (::nprpc::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::nprpc::flat::Span<const char>)base().name; }
  auto name_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(Media, name));  }
  void data(std::uint32_t elements_size) { new (&base().data) ::nprpc::flat::Vector<uint8_t>(buffer_, elements_size); }
  auto data_d() noexcept { return ::nprpc::flat::Vector_Direct1<uint8_t>(buffer_, offset_ + offsetof(Media, data)); }
  auto data() noexcept { return (::nprpc::flat::Span<uint8_t>)base().data; }
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
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<AuthorizationFailed*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const AuthorizationFailed*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  AuthorizationFailed_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
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

enum class RegistrationFailed_Reason : uint8_t {
  username_already_exist,
  email_already_registered,
  incorrect_code,
  invalid_username
};
class RegistrationFailed : public ::nprpc::Exception {
public:
  RegistrationFailed_Reason reason;

  RegistrationFailed() : ::nprpc::Exception("RegistrationFailed") {} 
  RegistrationFailed(RegistrationFailed_Reason _reason)
    : ::nprpc::Exception("RegistrationFailed")
    , reason(_reason)
  {
  }
};

namespace flat {
struct RegistrationFailed {
  uint32_t __ex_id;
  RegistrationFailed_Reason reason;
};

class RegistrationFailed_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<RegistrationFailed*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const RegistrationFailed*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  RegistrationFailed_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& __ex_id() const noexcept { return base().__ex_id;}
  uint32_t& __ex_id() noexcept { return base().__ex_id;}
  const RegistrationFailed_Reason& reason() const noexcept { return base().reason;}
  RegistrationFailed_Reason& reason() noexcept { return base().reason;}
};
} // namespace flat

class PermissionViolation : public ::nprpc::Exception {
public:
  std::string msg;

  PermissionViolation() : ::nprpc::Exception("PermissionViolation") {} 
  PermissionViolation(std::string _msg)
    : ::nprpc::Exception("PermissionViolation")
    , msg(_msg)
  {
  }
};

namespace flat {
struct PermissionViolation {
  uint32_t __ex_id;
  ::nprpc::flat::String msg;
};

class PermissionViolation_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<PermissionViolation*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const PermissionViolation*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  PermissionViolation_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& __ex_id() const noexcept { return base().__ex_id;}
  uint32_t& __ex_id() noexcept { return base().__ex_id;}
  void msg(const char* str) { new (&base().msg) ::nprpc::flat::String(buffer_, str); }
  void msg(const std::string& str) { new (&base().msg) ::nprpc::flat::String(buffer_, str); }
  auto msg() noexcept { return (::nprpc::flat::Span<char>)base().msg; }
  auto msg() const noexcept { return (::nprpc::flat::Span<const char>)base().msg; }
  auto msg_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(PermissionViolation, msg));  }
};
} // namespace flat

struct UserData {
  std::string name;
  std::string session_id;
  nprpc::ObjectId db;
};

namespace flat {
struct UserData {
  ::nprpc::flat::String name;
  ::nprpc::flat::String session_id;
  nprpc::detail::flat::ObjectId db;
};

class UserData_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<UserData*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const UserData*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  UserData_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void name(const char* str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  auto name() noexcept { return (::nprpc::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::nprpc::flat::Span<const char>)base().name; }
  auto name_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(UserData, name));  }
  void session_id(const char* str) { new (&base().session_id) ::nprpc::flat::String(buffer_, str); }
  void session_id(const std::string& str) { new (&base().session_id) ::nprpc::flat::String(buffer_, str); }
  auto session_id() noexcept { return (::nprpc::flat::Span<char>)base().session_id; }
  auto session_id() const noexcept { return (::nprpc::flat::Span<const char>)base().session_id; }
  auto session_id_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(UserData, session_id));  }
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
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<SolutionElement*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const SolutionElement*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  SolutionElement_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
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

enum class AlarmType : uint32_t {
  Info,
  Warning,
  Critical
};
struct Alarm {
  uint32_t id;
  AlarmType type;
  std::string msg;
};

namespace flat {
struct Alarm {
  uint32_t id;
  AlarmType type;
  ::nprpc::flat::String msg;
};

class Alarm_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Alarm*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Alarm*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  Alarm_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& id() const noexcept { return base().id;}
  uint32_t& id() noexcept { return base().id;}
  const AlarmType& type() const noexcept { return base().type;}
  AlarmType& type() noexcept { return base().type;}
  void msg(const char* str) { new (&base().msg) ::nprpc::flat::String(buffer_, str); }
  void msg(const std::string& str) { new (&base().msg) ::nprpc::flat::String(buffer_, str); }
  auto msg() noexcept { return (::nprpc::flat::Span<char>)base().msg; }
  auto msg() const noexcept { return (::nprpc::flat::Span<const char>)base().msg; }
  auto msg_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(Alarm, msg));  }
};
} // namespace flat

enum class ChatAttachmentType : uint32_t {
  Picture,
  File
};
struct ChatAttachment {
  ChatAttachmentType type;
  std::string name;
  std::vector<uint8_t> data;
};

namespace flat {
struct ChatAttachment {
  ChatAttachmentType type;
  ::nprpc::flat::String name;
  ::nprpc::flat::Vector<uint8_t> data;
};

class ChatAttachment_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<ChatAttachment*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const ChatAttachment*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  ChatAttachment_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const ChatAttachmentType& type() const noexcept { return base().type;}
  ChatAttachmentType& type() noexcept { return base().type;}
  void name(const char* str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  void name(const std::string& str) { new (&base().name) ::nprpc::flat::String(buffer_, str); }
  auto name() noexcept { return (::nprpc::flat::Span<char>)base().name; }
  auto name() const noexcept { return (::nprpc::flat::Span<const char>)base().name; }
  auto name_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(ChatAttachment, name));  }
  void data(std::uint32_t elements_size) { new (&base().data) ::nprpc::flat::Vector<uint8_t>(buffer_, elements_size); }
  auto data_d() noexcept { return ::nprpc::flat::Vector_Direct1<uint8_t>(buffer_, offset_ + offsetof(ChatAttachment, data)); }
  auto data() noexcept { return (::nprpc::flat::Span<uint8_t>)base().data; }
};
} // namespace flat

struct ChatMessage {
  uint32_t timestamp;
  std::string str;
  std::optional<ChatAttachment> attachment;
};

namespace flat {
struct ChatMessage {
  uint32_t timestamp;
  ::nprpc::flat::String str;
  ::nprpc::flat::Optional<npkcalc::flat::ChatAttachment> attachment;
};

class ChatMessage_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<ChatMessage*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const ChatMessage*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  ChatMessage_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& timestamp() const noexcept { return base().timestamp;}
  uint32_t& timestamp() noexcept { return base().timestamp;}
  void str(const char* str) { new (&base().str) ::nprpc::flat::String(buffer_, str); }
  void str(const std::string& str) { new (&base().str) ::nprpc::flat::String(buffer_, str); }
  auto str() noexcept { return (::nprpc::flat::Span<char>)base().str; }
  auto str() const noexcept { return (::nprpc::flat::Span<const char>)base().str; }
  auto str_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(ChatMessage, str));  }
  auto attachment() noexcept { return ::nprpc::flat::Optional_Direct<npkcalc::flat::ChatAttachment,npkcalc::flat::ChatAttachment_Direct>(buffer_, offset_ + offsetof(ChatMessage, attachment));  }
};
} // namespace flat

struct Vector3 {
  float x;
  float y;
  float z;
};

namespace flat {
struct Vector3 {
  float x;
  float y;
  float z;
};

class Vector3_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Vector3*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Vector3*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  Vector3_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const float& x() const noexcept { return base().x;}
  float& x() noexcept { return base().x;}
  const float& y() const noexcept { return base().y;}
  float& y() noexcept { return base().y;}
  const float& z() const noexcept { return base().z;}
  float& z() noexcept { return base().z;}
};
} // namespace flat

struct Vector2 {
  float x;
  float y;
};

namespace flat {
struct Vector2 {
  float x;
  float y;
};

class Vector2_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Vector2*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Vector2*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  Vector2_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const float& x() const noexcept { return base().x;}
  float& x() noexcept { return base().x;}
  const float& y() const noexcept { return base().y;}
  float& y() noexcept { return base().y;}
};
} // namespace flat

struct Footstep {
  Vector3 color;
  Vector2 pos;
  Vector2 dir;
};

namespace flat {
struct Footstep {
  npkcalc::flat::Vector3 color;
  npkcalc::flat::Vector2 pos;
  npkcalc::flat::Vector2 dir;
};

class Footstep_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<Footstep*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const Footstep*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  Footstep_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto color() noexcept { return npkcalc::flat::Vector3_Direct(buffer_, offset_ + offsetof(Footstep, color)); }
  auto pos() noexcept { return npkcalc::flat::Vector2_Direct(buffer_, offset_ + offsetof(Footstep, pos)); }
  auto dir() noexcept { return npkcalc::flat::Vector2_Direct(buffer_, offset_ + offsetof(Footstep, dir)); }
};
} // namespace flat

class IAuthorizator_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.Authorizator"; }
  std::string_view get_class() const noexcept override { return IAuthorizator_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual UserData LogIn (::nprpc::flat::Span<char> login, ::nprpc::flat::Span<char> password) = 0;
  virtual UserData LogInWithSessionId (::nprpc::flat::Span<char> session_id) = 0;
  virtual bool LogOut (::nprpc::flat::Span<char> session_id) = 0;
  virtual bool CheckUsername (::nprpc::flat::Span<char> username) = 0;
  virtual bool CheckEmail (::nprpc::flat::Span<char> email) = 0;
  virtual void RegisterStepOne (::nprpc::flat::Span<char> username, ::nprpc::flat::Span<char> email, ::nprpc::flat::Span<char> password) = 0;
  virtual void RegisterStepTwo (::nprpc::flat::Span<char> username, uint32_t code) = 0;
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
  bool CheckUsername (/*in*/const std::string& username);
  bool CheckEmail (/*in*/const std::string& email);
  void RegisterStepOne (/*in*/const std::string& username, /*in*/const std::string& email, /*in*/const std::string& password);
  void RegisterStepTwo (/*in*/const std::string& username, /*in*/uint32_t code);
};

class IRegisteredUser_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.RegisteredUser"; }
  std::string_view get_class() const noexcept override { return IRegisteredUser_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual void GetMyCalculations (/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct> calculations) = 0;
  virtual uint32_t AddSolution (::nprpc::flat::Span<char> name, ::nprpc::flat::Span<double> elements) = 0;
  virtual void SetSolutionName (uint32_t id, ::nprpc::flat::Span<char> name) = 0;
  virtual void SetSolutionElements (uint32_t id, ::nprpc::flat::Span_ref<npkcalc::flat::SolutionElement, npkcalc::flat::SolutionElement_Direct> name) = 0;
  virtual void DeleteSolution (uint32_t id) = 0;
  virtual uint32_t AddFertilizer (::nprpc::flat::Span<char> name, ::nprpc::flat::Span<char> formula) = 0;
  virtual void SetFertilizerName (uint32_t id, ::nprpc::flat::Span<char> name) = 0;
  virtual void SetFertilizerFormula (uint32_t id, ::nprpc::flat::Span<char> name) = 0;
  virtual void DeleteFertilizer (uint32_t id) = 0;
  virtual void SaveData () = 0;
  virtual uint32_t UpdateCalculation (npkcalc::flat::Calculation_Direct calculation) = 0;
  virtual void DeleteCalculation (uint32_t id) = 0;
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
  void SetSolutionElements (/*in*/uint32_t id, /*in*/::nprpc::flat::Span<const npkcalc::SolutionElement> name);
  void DeleteSolution (/*in*/uint32_t id);
  uint32_t AddFertilizer (/*in*/const std::string& name, /*in*/const std::string& formula);
  void SetFertilizerName (/*in*/uint32_t id, /*in*/const std::string& name);
  void SetFertilizerFormula (/*in*/uint32_t id, /*in*/const std::string& name);
  void DeleteFertilizer (/*in*/uint32_t id);
  void SaveData ();
  uint32_t UpdateCalculation (/*in*/const npkcalc::Calculation& calculation);
  void DeleteCalculation (/*in*/uint32_t id);
};

class IDataObserver_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.DataObserver"; }
  std::string_view get_class() const noexcept override { return IDataObserver_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual void DataChanged (uint32_t idx) = 0;
  virtual void OnAlarm (npkcalc::flat::Alarm_Direct alarm) = 0;
  virtual void OnFootstep (npkcalc::flat::Footstep_Direct footstep) = 0;
};

class DataObserver
  : public virtual nprpc::Object
{
  const uint8_t interface_idx_;
public:
  using servant_t = IDataObserver_Servant;

  DataObserver(uint8_t interface_idx) : interface_idx_(interface_idx) {}
  void DataChanged (/*in*/uint32_t idx);
  void OnAlarm (/*in*/const npkcalc::Alarm& alarm);
  void OnFootstep (/*in*/const npkcalc::Footstep& footstep);
};

class IChat_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.Chat"; }
  std::string_view get_class() const noexcept override { return IChat_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual void Connect (nprpc::Object* obj) = 0;
  virtual bool Send (npkcalc::flat::ChatMessage_Direct msg) = 0;
};

class Chat
  : public virtual nprpc::Object
{
  const uint8_t interface_idx_;
public:
  using servant_t = IChat_Servant;

  Chat(uint8_t interface_idx) : interface_idx_(interface_idx) {}
  void Connect (/*in*/const ObjectId& obj);
  bool Send (/*in*/const npkcalc::ChatMessage& msg);
};

class IChatParticipant_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.ChatParticipant"; }
  std::string_view get_class() const noexcept override { return IChatParticipant_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual void OnMessage (npkcalc::flat::ChatMessage_Direct msg) = 0;
};

class ChatParticipant
  : public virtual nprpc::Object
{
  const uint8_t interface_idx_;
public:
  using servant_t = IChatParticipant_Servant;

  ChatParticipant(uint8_t interface_idx) : interface_idx_(interface_idx) {}
  void OnMessage (/*in*/const npkcalc::ChatMessage& msg);
};

class ICalculator_Servant
  : public virtual nprpc::ObjectServant
{
public:
  static std::string_view _get_class() noexcept { return "npkcalc/npkcalc.Calculator"; }
  std::string_view get_class() const noexcept override { return ICalculator_Servant::_get_class(); }
  void dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) override;
  virtual void GetData (/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Solution, npkcalc::flat::Solution_Direct> solutions, /*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Fertilizer, npkcalc::flat::Fertilizer_Direct> fertilizers) = 0;
  virtual void GetImages (/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Media, npkcalc::flat::Media_Direct> images) = 0;
  virtual void Subscribe (nprpc::Object* obj) = 0;
  virtual void GetGuestCalculations (/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct> calculations) = 0;
  virtual void SendFootstep (npkcalc::flat::Footstep_Direct footstep) = 0;
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
  void Subscribe (/*in*/const ObjectId& obj);
  void GetGuestCalculations (/*out*/std::vector<npkcalc::Calculation>& calculations);
  void SendFootstep (/*in*/const npkcalc::Footstep& footstep);
};

} // namespace npkcalc

namespace npkcalc::helper {
template<::nprpc::IterableCollection T>
void assign_from_cpp_GetMyCalculations_calculations(/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct>& dest, const T & src) {
  dest.length(static_cast<uint32_t>(src.size()));
  {
    auto span = dest();
    auto it = src.begin();
    for (auto e : span) {
      auto __ptr = ::nprpc::make_wrapper1(*it);
        e.id() = __ptr->id;
        e.name(__ptr->name);
      memcpy(  e.elements().data(), __ptr->elements.data(), __ptr->elements.size() * 24);
        e.fertilizers_ids(static_cast<uint32_t>(__ptr->fertilizers_ids.size()));
      memcpy(  e.fertilizers_ids().data(), __ptr->fertilizers_ids.data(), __ptr->fertilizers_ids.size() * 4);
        e.volume() = __ptr->volume;
        e.mode() = __ptr->mode;
      ++it;
    }
  }
}
inline void assign_from_flat_UpdateCalculation_calculation(npkcalc::flat::Calculation_Direct& src, npkcalc::Calculation& dest) {
  dest.id = src.id();
  dest.name = (std::string_view)src.name();
  {
    auto span = src.elements();
    memcpy(dest.elements.data(), span.data(), 24 * span.size());
  }
  {
    auto span = src.fertilizers_ids();
    dest.fertilizers_ids.resize(span.size());
    memcpy(dest.fertilizers_ids.data(), span.data(), 4 * span.size());
  }
  dest.volume = src.volume();
  dest.mode = (bool)src.mode();
}
inline void assign_from_flat_OnAlarm_alarm(npkcalc::flat::Alarm_Direct& src, npkcalc::Alarm& dest) {
  dest.id = src.id();
  dest.type = src.type();
  dest.msg = (std::string_view)src.msg();
}
inline void assign_from_flat_OnFootstep_footstep(npkcalc::flat::Footstep_Direct& src, npkcalc::Footstep& dest) {
  memcpy(&dest, src.__data(), 28);
}
inline void assign_from_flat_Send_msg(npkcalc::flat::ChatMessage_Direct& src, npkcalc::ChatMessage& dest) {
  dest.timestamp = src.timestamp();
  dest.str = (std::string_view)src.str();
  {
    auto opt = src.attachment();
    if (opt.has_value()) {
      dest.attachment = std::decay<decltype(dest.attachment)>::type::value_type{};
      auto& value_to = dest.attachment.value();
      auto value_from = opt.value();
      value_to.type = value_from.type();
      value_to.name = (std::string_view)value_from.name();
      {
        auto span = value_from.data();
        value_to.data.resize(span.size());
        memcpy(value_to.data.data(), span.data(), 1 * span.size());
      }
    } else { 
      dest.attachment = std::nullopt;
    }
  }
}
template<::nprpc::IterableCollection T>
void assign_from_cpp_GetData_solutions(/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Solution, npkcalc::flat::Solution_Direct>& dest, const T & src) {
  dest.length(static_cast<uint32_t>(src.size()));
  {
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
}
template<::nprpc::IterableCollection T>
void assign_from_cpp_GetData_fertilizers(/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Fertilizer, npkcalc::flat::Fertilizer_Direct>& dest, const T & src) {
  dest.length(static_cast<uint32_t>(src.size()));
  {
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
}
template<::nprpc::IterableCollection T>
void assign_from_cpp_GetImages_images(/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Media, npkcalc::flat::Media_Direct>& dest, const T & src) {
  dest.length(static_cast<uint32_t>(src.size()));
  {
    auto span = dest();
    auto it = src.begin();
    for (auto e : span) {
      auto __ptr = ::nprpc::make_wrapper1(*it);
        e.name(__ptr->name);
        e.data(static_cast<uint32_t>(__ptr->data.size()));
      memcpy(  e.data().data(), __ptr->data.data(), __ptr->data.size() * 1);
      ++it;
    }
  }
}
} // namespace npkcalc::helper

#endif