#include "npkcalc.hpp"
#include <nprpc/impl/nprpc_impl.hpp>

void npkcalc_throw_exception(::nprpc::flat_buffer& buf);

namespace {
struct npkcalc_M1 {
  ::nprpc::flat::String _1;
  ::nprpc::flat::String _2;
};

class npkcalc_M1_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M1*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M1*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M1_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(const char* str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  void _1(const std::string& str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  auto _1() noexcept { return (::nprpc::flat::Span<char>)base()._1; }
  auto _1() const noexcept { return (::nprpc::flat::Span<const char>)base()._1; }
  auto _1_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M1, _1));  }
  void _2(const char* str) { new (&base()._2) ::nprpc::flat::String(buffer_, str); }
  void _2(const std::string& str) { new (&base()._2) ::nprpc::flat::String(buffer_, str); }
  auto _2() noexcept { return (::nprpc::flat::Span<char>)base()._2; }
  auto _2() const noexcept { return (::nprpc::flat::Span<const char>)base()._2; }
  auto _2_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M1, _2));  }
};

struct npkcalc_M2 {
  npkcalc::flat::UserData _1;
};

class npkcalc_M2_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M2*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M2*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M2_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return npkcalc::flat::UserData_Direct(buffer_, offset_ + offsetof(npkcalc_M2, _1)); }
};

struct npkcalc_M3 {
  ::nprpc::flat::String _1;
};

class npkcalc_M3_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M3*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M3*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M3_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(const char* str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  void _1(const std::string& str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  auto _1() noexcept { return (::nprpc::flat::Span<char>)base()._1; }
  auto _1() const noexcept { return (::nprpc::flat::Span<const char>)base()._1; }
  auto _1_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M3, _1));  }
};

struct npkcalc_M4 {
  ::nprpc::flat::Boolean _1;
};

class npkcalc_M4_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M4*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M4*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M4_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const ::nprpc::flat::Boolean& _1() const noexcept { return base()._1;}
  ::nprpc::flat::Boolean& _1() noexcept { return base()._1;}
};

struct npkcalc_M5 {
  ::nprpc::flat::String _1;
  ::nprpc::flat::String _2;
  ::nprpc::flat::String _3;
};

class npkcalc_M5_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M5*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M5*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M5_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(const char* str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  void _1(const std::string& str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  auto _1() noexcept { return (::nprpc::flat::Span<char>)base()._1; }
  auto _1() const noexcept { return (::nprpc::flat::Span<const char>)base()._1; }
  auto _1_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M5, _1));  }
  void _2(const char* str) { new (&base()._2) ::nprpc::flat::String(buffer_, str); }
  void _2(const std::string& str) { new (&base()._2) ::nprpc::flat::String(buffer_, str); }
  auto _2() noexcept { return (::nprpc::flat::Span<char>)base()._2; }
  auto _2() const noexcept { return (::nprpc::flat::Span<const char>)base()._2; }
  auto _2_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M5, _2));  }
  void _3(const char* str) { new (&base()._3) ::nprpc::flat::String(buffer_, str); }
  void _3(const std::string& str) { new (&base()._3) ::nprpc::flat::String(buffer_, str); }
  auto _3() noexcept { return (::nprpc::flat::Span<char>)base()._3; }
  auto _3() const noexcept { return (::nprpc::flat::Span<const char>)base()._3; }
  auto _3_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M5, _3));  }
};

struct npkcalc_M6 {
  ::nprpc::flat::String _1;
  uint32_t _2;
};

class npkcalc_M6_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M6*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M6*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M6_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(const char* str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  void _1(const std::string& str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  auto _1() noexcept { return (::nprpc::flat::Span<char>)base()._1; }
  auto _1() const noexcept { return (::nprpc::flat::Span<const char>)base()._1; }
  auto _1_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M6, _1));  }
  const uint32_t& _2() const noexcept { return base()._2;}
  uint32_t& _2() noexcept { return base()._2;}
};

struct npkcalc_M7 {
  ::nprpc::flat::Vector<npkcalc::flat::Calculation> _1;
};

class npkcalc_M7_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M7*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M7*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M7_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(std::uint32_t elements_size) { new (&base()._1) ::nprpc::flat::Vector<npkcalc::flat::Calculation>(buffer_, elements_size); }
  auto _1_d() noexcept { return ::nprpc::flat::Vector_Direct2<npkcalc::flat::Calculation,npkcalc::flat::Calculation_Direct>(buffer_, offset_ + offsetof(npkcalc_M7, _1)); }
  auto _1() noexcept { return ::nprpc::flat::Span_ref<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct>(buffer_, base()._1.range(buffer_.data().data())); }
};

struct npkcalc_M8 {
  ::nprpc::flat::String _1;
  ::nprpc::flat::Array<double,14> _2;
};

class npkcalc_M8_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M8*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M8*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M8_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(const char* str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  void _1(const std::string& str) { new (&base()._1) ::nprpc::flat::String(buffer_, str); }
  auto _1() noexcept { return (::nprpc::flat::Span<char>)base()._1; }
  auto _1() const noexcept { return (::nprpc::flat::Span<const char>)base()._1; }
  auto _1_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M8, _1));  }
  auto _2() noexcept { return (::nprpc::flat::Span<double>)base()._2; }
};

struct npkcalc_M9 {
  uint32_t _1;
};

class npkcalc_M9_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M9*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M9*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M9_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& _1() const noexcept { return base()._1;}
  uint32_t& _1() noexcept { return base()._1;}
};

struct npkcalc_M10 {
  uint32_t _1;
  ::nprpc::flat::String _2;
};

class npkcalc_M10_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M10*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M10*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M10_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& _1() const noexcept { return base()._1;}
  uint32_t& _1() noexcept { return base()._1;}
  void _2(const char* str) { new (&base()._2) ::nprpc::flat::String(buffer_, str); }
  void _2(const std::string& str) { new (&base()._2) ::nprpc::flat::String(buffer_, str); }
  auto _2() noexcept { return (::nprpc::flat::Span<char>)base()._2; }
  auto _2() const noexcept { return (::nprpc::flat::Span<const char>)base()._2; }
  auto _2_d() noexcept {     return ::nprpc::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M10, _2));  }
};

struct npkcalc_M11 {
  uint32_t _1;
  ::nprpc::flat::Vector<npkcalc::flat::SolutionElement> _2;
};

class npkcalc_M11_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M11*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M11*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M11_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& _1() const noexcept { return base()._1;}
  uint32_t& _1() noexcept { return base()._1;}
  void _2(std::uint32_t elements_size) { new (&base()._2) ::nprpc::flat::Vector<npkcalc::flat::SolutionElement>(buffer_, elements_size); }
  auto _2_d() noexcept { return ::nprpc::flat::Vector_Direct2<npkcalc::flat::SolutionElement,npkcalc::flat::SolutionElement_Direct>(buffer_, offset_ + offsetof(npkcalc_M11, _2)); }
  auto _2() noexcept { return ::nprpc::flat::Span_ref<npkcalc::flat::SolutionElement, npkcalc::flat::SolutionElement_Direct>(buffer_, base()._2.range(buffer_.data().data())); }
};

struct npkcalc_M12 {
  npkcalc::flat::Calculation _1;
};

class npkcalc_M12_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M12*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M12*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M12_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return npkcalc::flat::Calculation_Direct(buffer_, offset_ + offsetof(npkcalc_M12, _1)); }
};

struct npkcalc_M13 {
  npkcalc::flat::Alarm _1;
};

class npkcalc_M13_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M13*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M13*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M13_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return npkcalc::flat::Alarm_Direct(buffer_, offset_ + offsetof(npkcalc_M13, _1)); }
};

struct npkcalc_M14 {
  nprpc::detail::flat::ObjectId _1;
};

class npkcalc_M14_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M14*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M14*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M14_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return nprpc::detail::flat::ObjectId_Direct(buffer_, offset_ + offsetof(npkcalc_M14, _1)); }
};

struct npkcalc_M15 {
  npkcalc::flat::ChatMessage _1;
};

class npkcalc_M15_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M15*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M15*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M15_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return npkcalc::flat::ChatMessage_Direct(buffer_, offset_ + offsetof(npkcalc_M15, _1)); }
};

struct npkcalc_M16 {
  ::nprpc::flat::Vector<npkcalc::flat::Solution> _1;
  ::nprpc::flat::Vector<npkcalc::flat::Fertilizer> _2;
};

class npkcalc_M16_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M16*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M16*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M16_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(std::uint32_t elements_size) { new (&base()._1) ::nprpc::flat::Vector<npkcalc::flat::Solution>(buffer_, elements_size); }
  auto _1_d() noexcept { return ::nprpc::flat::Vector_Direct2<npkcalc::flat::Solution,npkcalc::flat::Solution_Direct>(buffer_, offset_ + offsetof(npkcalc_M16, _1)); }
  auto _1() noexcept { return ::nprpc::flat::Span_ref<npkcalc::flat::Solution, npkcalc::flat::Solution_Direct>(buffer_, base()._1.range(buffer_.data().data())); }
  void _2(std::uint32_t elements_size) { new (&base()._2) ::nprpc::flat::Vector<npkcalc::flat::Fertilizer>(buffer_, elements_size); }
  auto _2_d() noexcept { return ::nprpc::flat::Vector_Direct2<npkcalc::flat::Fertilizer,npkcalc::flat::Fertilizer_Direct>(buffer_, offset_ + offsetof(npkcalc_M16, _2)); }
  auto _2() noexcept { return ::nprpc::flat::Span_ref<npkcalc::flat::Fertilizer, npkcalc::flat::Fertilizer_Direct>(buffer_, base()._2.range(buffer_.data().data())); }
};

struct npkcalc_M17 {
  ::nprpc::flat::Vector<npkcalc::flat::Media> _1;
};

class npkcalc_M17_Direct {
  ::nprpc::flat_buffer& buffer_;
  const std::uint32_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M17*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M17*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  uint32_t offset() const noexcept { return offset_; }
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M17_Direct(::nprpc::flat_buffer& buffer, std::uint32_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(std::uint32_t elements_size) { new (&base()._1) ::nprpc::flat::Vector<npkcalc::flat::Media>(buffer_, elements_size); }
  auto _1_d() noexcept { return ::nprpc::flat::Vector_Direct2<npkcalc::flat::Media,npkcalc::flat::Media_Direct>(buffer_, offset_ + offsetof(npkcalc_M17, _1)); }
  auto _1() noexcept { return ::nprpc::flat::Span_ref<npkcalc::flat::Media, npkcalc::flat::Media_Direct>(buffer_, base()._1.range(buffer_.data().data())); }
};


bool check_1S2S(nprpc::flat_buffer& buf, npkcalc_M1_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 16) goto check_failed;
    {
      if(!ia._1_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
    {
      if(!ia._2_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1S(nprpc::flat_buffer& buf, npkcalc_M3_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 8) goto check_failed;
    {
      if(!ia._1_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1S2S3S(nprpc::flat_buffer& buf, npkcalc_M5_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 24) goto check_failed;
    {
      if(!ia._1_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
    {
      if(!ia._2_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
    {
      if(!ia._3_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1S2Fu32(nprpc::flat_buffer& buf, npkcalc_M6_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 12) goto check_failed;
    {
      if(!ia._1_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1S2AFf64(nprpc::flat_buffer& buf, npkcalc_M8_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 120) goto check_failed;
    {
      if(!ia._1_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1Fu322S(nprpc::flat_buffer& buf, npkcalc_M10_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 12) goto check_failed;
    {
      if(!ia._2_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1Fu322VSolutionElement(nprpc::flat_buffer& buf, npkcalc_M11_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 12) goto check_failed;
    {
      if(!ia._2_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
    }
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1Fu32(nprpc::flat_buffer& buf, npkcalc_M9_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 4) goto check_failed;
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1Calculation_1(nprpc::flat_buffer& buf, npkcalc_M12_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 376) goto check_failed;
    {
      {
        if(!ia._1().name_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
      }
    }
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1O(nprpc::flat_buffer& buf, npkcalc_M14_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 40) goto check_failed;
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
bool check_1ChatMessage_1(nprpc::flat_buffer& buf, npkcalc_M15_Direct& ia) {
  if (static_cast<std::uint32_t>(buf.size()) < ia.offset() + 16) goto check_failed;
    {
      {
        if(!ia._1().str_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
      }
      {
        if(!ia._1().attachment()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
        if ( ia._1().attachment().has_value() ) {
          auto value = ia._1().attachment().value();
  if (static_cast<std::uint32_t>(buf.size()) < value.offset() + 20) goto check_failed;
        {
          if(!value.name_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
        }
        {
          if(!value.data_d()._check_size_align(static_cast<std::uint32_t>(buf.size()))) goto check_failed;
        }
        }
      }
    }
  return true;
check_failed:
  nprpc::impl::make_simple_answer(buf, nprpc::impl::MessageId::Error_BadInput);
  return false;
}
} // 

namespace npkcalc { 
UserData npkcalc::Authorizator::LogIn(/*in*/const std::string& login, /*in*/const std::string& password) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M1_Direct _(buf,32);
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
  npkcalc_M2_Direct out(buf, sizeof(::nprpc::impl::Header));
    UserData __ret_value;
    __ret_value.name = (std::string_view)out._1().name();
    __ret_value.session_id = (std::string_view)out._1().session_id();
    __ret_value.db.assign_from_direct(out._1().db());
  return __ret_value;
}

UserData npkcalc::Authorizator::LogInWithSessionId(/*in*/const std::string& session_id) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M3_Direct _(buf,32);
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
  npkcalc_M2_Direct out(buf, sizeof(::nprpc::impl::Header));
    UserData __ret_value;
    __ret_value.name = (std::string_view)out._1().name();
    __ret_value.session_id = (std::string_view)out._1().session_id();
    __ret_value.db.assign_from_direct(out._1().db());
  return __ret_value;
}

bool npkcalc::Authorizator::LogOut(/*in*/const std::string& session_id) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M3_Direct _(buf,32);
  _._1(session_id);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  npkcalc_M4_Direct out(buf, sizeof(::nprpc::impl::Header));
    bool __ret_value;
    __ret_value = (bool)out._1();
  return __ret_value;
}

bool npkcalc::Authorizator::CheckUsername(/*in*/const std::string& username) {
  ::nprpc::flat_buffer buf;
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
  __ch.function_idx() = 3;
  npkcalc_M3_Direct _(buf,32);
  _._1(username);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  npkcalc_M4_Direct out(buf, sizeof(::nprpc::impl::Header));
    bool __ret_value;
    __ret_value = (bool)out._1();
  return __ret_value;
}

bool npkcalc::Authorizator::CheckEmail(/*in*/const std::string& email) {
  ::nprpc::flat_buffer buf;
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
  __ch.function_idx() = 4;
  npkcalc_M3_Direct _(buf,32);
  _._1(email);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  npkcalc_M4_Direct out(buf, sizeof(::nprpc::impl::Header));
    bool __ret_value;
    __ret_value = (bool)out._1();
  return __ret_value;
}

void npkcalc::Authorizator::RegisterStepOne(/*in*/const std::string& username, /*in*/const std::string& email, /*in*/const std::string& password) {
  ::nprpc::flat_buffer buf;
  {
    auto mb = buf.prepare(184);
    buf.commit(56);
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_id = ::nprpc::impl::MessageId::FunctionCall;
    static_cast<::nprpc::impl::Header*>(mb.data())->msg_type = ::nprpc::impl::MessageType::Request;
  }
  ::nprpc::impl::flat::CallHeader_Direct __ch(buf, sizeof(::nprpc::impl::Header));
  __ch.object_id() = this->_data().object_id;
  __ch.poa_idx() = this->_data().poa_idx;
  __ch.interface_idx() = interface_idx_;
  __ch.function_idx() = 5;
  npkcalc_M5_Direct _(buf,32);
  _._1(username);
  _._2(email);
  _._3(password);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::Authorizator::RegisterStepTwo(/*in*/const std::string& username, /*in*/uint32_t code) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M6_Direct _(buf,32);
  _._1(username);
  _._2() = code;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::IAuthorizator_Servant::dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) {
  nprpc::impl::flat::CallHeader_Direct __ch(bufs(), sizeof(::nprpc::impl::Header));
  switch(__ch.function_idx()) {
    case 0: {
      npkcalc_M1_Direct ia(bufs(), 32);
      if ( !check_1S2S(bufs(), ia) ) break;
      auto& obuf = bufs.flip();
      obuf.consume(obuf.size());
      obuf.prepare(200);
      obuf.commit(72);
      npkcalc_M2_Direct oa(obuf,16);
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
      npkcalc_M3_Direct ia(bufs(), 32);
      if ( !check_1S(bufs(), ia) ) break;
      auto& obuf = bufs.flip();
      obuf.consume(obuf.size());
      obuf.prepare(200);
      obuf.commit(72);
      npkcalc_M2_Direct oa(obuf,16);
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
      npkcalc_M3_Direct ia(bufs(), 32);
      if ( !check_1S(bufs(), ia) ) break;
      bool __ret_val;
      __ret_val = LogOut(ia._1());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(17);
      obuf.commit(17);
      npkcalc_M4_Direct oa(obuf,16);
      oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 3: {
      npkcalc_M3_Direct ia(bufs(), 32);
      if ( !check_1S(bufs(), ia) ) break;
      bool __ret_val;
      __ret_val = CheckUsername(ia._1());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(17);
      obuf.commit(17);
      npkcalc_M4_Direct oa(obuf,16);
      oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 4: {
      npkcalc_M3_Direct ia(bufs(), 32);
      if ( !check_1S(bufs(), ia) ) break;
      bool __ret_val;
      __ret_val = CheckEmail(ia._1());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(17);
      obuf.commit(17);
      npkcalc_M4_Direct oa(obuf,16);
      oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 5: {
      npkcalc_M5_Direct ia(bufs(), 32);
      if ( !check_1S2S3S(bufs(), ia) ) break;
      try {
        RegisterStepOne(ia._1(), ia._2(), ia._3());
      }
      catch(npkcalc::RegistrationFailed& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(24);
        obuf.commit(24);
        npkcalc::flat::RegistrationFailed_Direct oa(obuf,16);
        oa.__ex_id() = 1;
        oa.reason() = e.reason;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 6: {
      npkcalc_M6_Direct ia(bufs(), 32);
      if ( !check_1S2Fu32(bufs(), ia) ) break;
      try {
        RegisterStepTwo(ia._1(), ia._2());
      }
      catch(npkcalc::RegistrationFailed& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(24);
        obuf.commit(24);
        npkcalc::flat::RegistrationFailed_Direct oa(obuf,16);
        oa.__ex_id() = 1;
        oa.reason() = e.reason;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    default:
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Error_UnknownFunctionIdx);
  }
}

void npkcalc::RegisteredUser::GetMyCalculations(/*out*/std::vector<npkcalc::Calculation>& calculations) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M7_Direct out(buf, sizeof(::nprpc::impl::Header));
    {
      auto span = out._1();
      calculations.resize(span.size());
      auto it3 = std::begin(calculations);
      for (auto e : span) {
        (*it3).id = e.id();
        (*it3).name = (std::string_view)e.name();
        {
          auto span = e.elements();
          memcpy((*it3).elements.data(), span.data(), 24 * span.size());
        }
        {
          auto span = e.fertilizers_ids();
          (*it3).fertilizers_ids.resize(span.size());
          memcpy((*it3).fertilizers_ids.data(), span.data(), 4 * span.size());
        }
        (*it3).volume = e.volume();
        (*it3).mode = (bool)e.mode();
        ++it3;
      }
    }
}

uint32_t npkcalc::RegisteredUser::AddSolution(/*in*/const std::string& name, /*in*/const std::array<double,14>& elements) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M8_Direct _(buf,32);
  _._1(name);
  memcpy(_._2().data(), elements.data(), elements.size() * 8);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  npkcalc_M9_Direct out(buf, sizeof(::nprpc::impl::Header));
    uint32_t __ret_value;
    __ret_value = out._1();
  return __ret_value;
}

void npkcalc::RegisteredUser::SetSolutionName(/*in*/uint32_t id, /*in*/const std::string& name) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M10_Direct _(buf,32);
  _._1() = id;
  _._2(name);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::SetSolutionElements(/*in*/uint32_t id, /*in*/::nprpc::flat::Span<const npkcalc::SolutionElement> name) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M11_Direct _(buf,32);
  _._1() = id;
  _._2(static_cast<uint32_t>(name.size()));
  memcpy(_._2().data(), name.data(), name.size() * 16);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::DeleteSolution(/*in*/uint32_t id) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M9_Direct _(buf,32);
  _._1() = id;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

uint32_t npkcalc::RegisteredUser::AddFertilizer(/*in*/const std::string& name, /*in*/const std::string& formula) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M1_Direct _(buf,32);
  _._1(name);
  _._2(formula);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  npkcalc_M9_Direct out(buf, sizeof(::nprpc::impl::Header));
    uint32_t __ret_value;
    __ret_value = out._1();
  return __ret_value;
}

void npkcalc::RegisteredUser::SetFertilizerName(/*in*/uint32_t id, /*in*/const std::string& name) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M10_Direct _(buf,32);
  _._1() = id;
  _._2(name);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::SetFertilizerFormula(/*in*/uint32_t id, /*in*/const std::string& name) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M10_Direct _(buf,32);
  _._1() = id;
  _._2(name);
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::DeleteFertilizer(/*in*/uint32_t id) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M9_Direct _(buf,32);
  _._1() = id;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply == 1) {
    npkcalc_throw_exception(buf);
  }
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::RegisteredUser::SaveData() {
  ::nprpc::flat_buffer buf;
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
  ::nprpc::flat_buffer buf;
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
  npkcalc_M12_Direct _(buf,32);
  _._1().id() = calculation.id;
  _._1().name(calculation.name);
  memcpy(_._1().elements().data(), calculation.elements.data(), calculation.elements.size() * 24);
  _._1().fertilizers_ids(static_cast<uint32_t>(calculation.fertilizers_ids.size()));
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
  npkcalc_M9_Direct out(buf, sizeof(::nprpc::impl::Header));
    uint32_t __ret_value;
    __ret_value = out._1();
  return __ret_value;
}

void npkcalc::RegisteredUser::DeleteCalculation(/*in*/uint32_t id) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M9_Direct _(buf,32);
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
      npkcalc_M7_Direct oa(obuf,16);
      GetMyCalculations(oa._1_d());
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 1: {
      npkcalc_M8_Direct ia(bufs(), 32);
      if ( !check_1S2AFf64(bufs(), ia) ) break;
      uint32_t __ret_val;
      __ret_val = AddSolution(ia._1(), ia._2());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(20);
      obuf.commit(20);
      npkcalc_M9_Direct oa(obuf,16);
      oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 2: {
      npkcalc_M10_Direct ia(bufs(), 32);
      if ( !check_1Fu322S(bufs(), ia) ) break;
      try {
        SetSolutionName(ia._1(), ia._2());
      }
      catch(npkcalc::PermissionViolation& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(28);
        obuf.commit(28);
        npkcalc::flat::PermissionViolation_Direct oa(obuf,16);
        oa.__ex_id() = 2;
        oa.msg(e.msg);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 3: {
      npkcalc_M11_Direct ia(bufs(), 32);
      if ( !check_1Fu322VSolutionElement(bufs(), ia) ) break;
      try {
        SetSolutionElements(ia._1(), ia._2());
      }
      catch(npkcalc::PermissionViolation& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(28);
        obuf.commit(28);
        npkcalc::flat::PermissionViolation_Direct oa(obuf,16);
        oa.__ex_id() = 2;
        oa.msg(e.msg);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 4: {
      npkcalc_M9_Direct ia(bufs(), 32);
      if ( !check_1Fu32(bufs(), ia) ) break;
      try {
        DeleteSolution(ia._1());
      }
      catch(npkcalc::PermissionViolation& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(28);
        obuf.commit(28);
        npkcalc::flat::PermissionViolation_Direct oa(obuf,16);
        oa.__ex_id() = 2;
        oa.msg(e.msg);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 5: {
      npkcalc_M1_Direct ia(bufs(), 32);
      if ( !check_1S2S(bufs(), ia) ) break;
      uint32_t __ret_val;
      __ret_val = AddFertilizer(ia._1(), ia._2());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(20);
      obuf.commit(20);
      npkcalc_M9_Direct oa(obuf,16);
      oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 6: {
      npkcalc_M10_Direct ia(bufs(), 32);
      if ( !check_1Fu322S(bufs(), ia) ) break;
      try {
        SetFertilizerName(ia._1(), ia._2());
      }
      catch(npkcalc::PermissionViolation& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(28);
        obuf.commit(28);
        npkcalc::flat::PermissionViolation_Direct oa(obuf,16);
        oa.__ex_id() = 2;
        oa.msg(e.msg);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 7: {
      npkcalc_M10_Direct ia(bufs(), 32);
      if ( !check_1Fu322S(bufs(), ia) ) break;
      try {
        SetFertilizerFormula(ia._1(), ia._2());
      }
      catch(npkcalc::PermissionViolation& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(28);
        obuf.commit(28);
        npkcalc::flat::PermissionViolation_Direct oa(obuf,16);
        oa.__ex_id() = 2;
        oa.msg(e.msg);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 8: {
      npkcalc_M9_Direct ia(bufs(), 32);
      if ( !check_1Fu32(bufs(), ia) ) break;
      try {
        DeleteFertilizer(ia._1());
      }
      catch(npkcalc::PermissionViolation& e) {
        auto& obuf = bufs();
        obuf.consume(obuf.size());
        obuf.prepare(28);
        obuf.commit(28);
        npkcalc::flat::PermissionViolation_Direct oa(obuf,16);
        oa.__ex_id() = 2;
        oa.msg(e.msg);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::Exception;
        static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
        return;
      }
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 9: {
      SaveData();
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 10: {
      npkcalc_M12_Direct ia(bufs(), 32);
      if ( !check_1Calculation_1(bufs(), ia) ) break;
      uint32_t __ret_val;
      __ret_val = UpdateCalculation(ia._1());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(20);
      obuf.commit(20);
      npkcalc_M9_Direct oa(obuf,16);
      oa._1() = __ret_val;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 11: {
      npkcalc_M9_Direct ia(bufs(), 32);
      if ( !check_1Fu32(bufs(), ia) ) break;
      DeleteCalculation(ia._1());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    default:
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Error_UnknownFunctionIdx);
  }
}

void npkcalc::DataObserver::DataChanged(/*in*/uint32_t idx) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M9_Direct _(buf,32);
  _._1() = idx;
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::DataObserver::OnAlarm(/*in*/const npkcalc::Alarm& alarm) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M13_Direct _(buf,32);
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
      npkcalc_M9_Direct ia(bufs(), 32);
      DataChanged(ia._1());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 1: {
      npkcalc_M13_Direct ia(bufs(), 32);
      OnAlarm(ia._1());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    default:
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Error_UnknownFunctionIdx);
  }
}

void npkcalc::Chat::Connect(/*in*/const ObjectId& obj) {
  ::nprpc::flat_buffer buf;
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
  __ch.function_idx() = 0;
  npkcalc_M14_Direct _(buf,32);
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

bool npkcalc::Chat::Send(/*in*/const npkcalc::ChatMessage& msg) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M15_Direct _(buf,32);
  _._1().timestamp() = msg.timestamp;
  _._1().str(msg.str);
  if (msg.attachment) {
    _._1().attachment().alloc();
    auto value = _._1().attachment().value();
    value.type() = msg.attachment.value().type;
    value.name(msg.attachment.value().name);
    value.data(static_cast<uint32_t>(msg.attachment.value().data.size()));
    memcpy(value.data().data(), msg.attachment.value().data.data(), msg.attachment.value().data.size() * 1);
  } else { 
    _._1().attachment().set_nullopt();
  }
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != -1) {
    std::cerr << "received an unusual reply for function with output arguments\n";
    throw nprpc::Exception("Unknown Error");
  }
  npkcalc_M4_Direct out(buf, sizeof(::nprpc::impl::Header));
    bool __ret_value;
    __ret_value = (bool)out._1();
  return __ret_value;
}

void npkcalc::IChat_Servant::dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) {
  nprpc::impl::flat::CallHeader_Direct __ch(bufs(), sizeof(::nprpc::impl::Header));
  switch(__ch.function_idx()) {
    case 0: {
      npkcalc_M14_Direct ia(bufs(), 32);
      if ( !check_1O(bufs(), ia) ) break;
      Connect(nprpc::impl::create_object_from_flat(ia._1(), remote_endpoint));
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 1: {
      npkcalc_M15_Direct ia(bufs(), 32);
      if ( !check_1ChatMessage_1(bufs(), ia) ) break;
      bool __ret_val;
      __ret_val = Send(ia._1());
      auto& obuf = bufs();
      obuf.consume(obuf.size());
      obuf.prepare(17);
      obuf.commit(17);
      npkcalc_M4_Direct oa(obuf,16);
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

void npkcalc::ChatParticipant::OnMessage(/*in*/const npkcalc::ChatMessage& msg) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M15_Direct _(buf,32);
  _._1().timestamp() = msg.timestamp;
  _._1().str(msg.str);
  if (msg.attachment) {
    _._1().attachment().alloc();
    auto value = _._1().attachment().value();
    value.type() = msg.attachment.value().type;
    value.name(msg.attachment.value().name);
    value.data(static_cast<uint32_t>(msg.attachment.value().data.size()));
    memcpy(value.data().data(), msg.attachment.value().data.data(), msg.attachment.value().data.size() * 1);
  } else { 
    _._1().attachment().set_nullopt();
  }
  static_cast<::nprpc::impl::Header*>(buf.data().data())->size = static_cast<uint32_t>(buf.size() - 4);
  ::nprpc::impl::g_orb->call(this->get_endpoint(), buf, this->get_timeout());
  auto std_reply = nprpc::impl::handle_standart_reply(buf);
  if (std_reply != 0) {
    std::cerr << "received an unusual reply for function with no output arguments\n";
  }
}

void npkcalc::IChatParticipant_Servant::dispatch(nprpc::Buffers& bufs, nprpc::EndPoint remote_endpoint, bool from_parent, nprpc::ReferenceList& ref_list) {
  nprpc::impl::flat::CallHeader_Direct __ch(bufs(), sizeof(::nprpc::impl::Header));
  switch(__ch.function_idx()) {
    case 0: {
      npkcalc_M15_Direct ia(bufs(), 32);
      OnMessage(ia._1());
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    default:
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Error_UnknownFunctionIdx);
  }
}

void npkcalc::Calculator::GetData(/*out*/std::vector<npkcalc::Solution>& solutions, /*out*/std::vector<npkcalc::Fertilizer>& fertilizers) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M16_Direct out(buf, sizeof(::nprpc::impl::Header));
    {
      auto span = out._1();
      solutions.resize(span.size());
      auto it3 = std::begin(solutions);
      for (auto e : span) {
        (*it3).id = e.id();
        (*it3).name = (std::string_view)e.name();
        (*it3).owner = (std::string_view)e.owner();
        {
          auto span = e.elements();
          memcpy((*it3).elements.data(), span.data(), 8 * span.size());
        }
        ++it3;
      }
    }
    {
      auto span = out._2();
      fertilizers.resize(span.size());
      auto it3 = std::begin(fertilizers);
      for (auto e : span) {
        (*it3).id = e.id();
        (*it3).name = (std::string_view)e.name();
        (*it3).owner = (std::string_view)e.owner();
        (*it3).formula = (std::string_view)e.formula();
        ++it3;
      }
    }
}

void npkcalc::Calculator::GetImages(/*out*/std::vector<npkcalc::Media>& images) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M17_Direct out(buf, sizeof(::nprpc::impl::Header));
    {
      auto span = out._1();
      images.resize(span.size());
      auto it3 = std::begin(images);
      for (auto e : span) {
        (*it3).name = (std::string_view)e.name();
        {
          auto span = e.data();
          (*it3).data.resize(span.size());
          memcpy((*it3).data.data(), span.data(), 1 * span.size());
        }
        ++it3;
      }
    }
}

void npkcalc::Calculator::Subscribe(/*in*/const ObjectId& obj) {
  ::nprpc::flat_buffer buf;
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
  npkcalc_M14_Direct _(buf,32);
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
  ::nprpc::flat_buffer buf;
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
  npkcalc_M7_Direct out(buf, sizeof(::nprpc::impl::Header));
    {
      auto span = out._1();
      calculations.resize(span.size());
      auto it3 = std::begin(calculations);
      for (auto e : span) {
        (*it3).id = e.id();
        (*it3).name = (std::string_view)e.name();
        {
          auto span = e.elements();
          memcpy((*it3).elements.data(), span.data(), 24 * span.size());
        }
        {
          auto span = e.fertilizers_ids();
          (*it3).fertilizers_ids.resize(span.size());
          memcpy((*it3).fertilizers_ids.data(), span.data(), 4 * span.size());
        }
        (*it3).volume = e.volume();
        (*it3).mode = (bool)e.mode();
        ++it3;
      }
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
      npkcalc_M16_Direct oa(obuf,16);
      GetData(oa._1_d(), oa._2_d());
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
      npkcalc_M17_Direct oa(obuf,16);
      GetImages(oa._1_d());
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->size = static_cast<uint32_t>(obuf.size() - 4);
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_id = ::nprpc::impl::MessageId::BlockResponse;
      static_cast<::nprpc::impl::Header*>(obuf.data().data())->msg_type = ::nprpc::impl::MessageType::Answer;
      break;
    }
    case 2: {
      npkcalc_M14_Direct ia(bufs(), 32);
      if ( !check_1O(bufs(), ia) ) break;
      Subscribe(nprpc::impl::create_object_from_flat(ia._1(), remote_endpoint));
      nprpc::impl::make_simple_answer(bufs(), nprpc::impl::MessageId::Success);
      break;
    }
    case 3: {
      auto& obuf = bufs.flip();
      obuf.consume(obuf.size());
      obuf.prepare(152);
      obuf.commit(24);
      npkcalc_M7_Direct oa(obuf,16);
      GetGuestCalculations(oa._1_d());
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


void npkcalc_throw_exception(::nprpc::flat_buffer& buf) { 
  switch(*(uint32_t*)( (char*)buf.data().data() + sizeof(::nprpc::impl::Header)) ) {
  case 0:
  {
    npkcalc::flat::AuthorizationFailed_Direct ex_flat(buf, sizeof(::nprpc::impl::Header));
    npkcalc::AuthorizationFailed ex;
    ex.reason = ex_flat.reason();
    throw ex;
  }
  case 1:
  {
    npkcalc::flat::RegistrationFailed_Direct ex_flat(buf, sizeof(::nprpc::impl::Header));
    npkcalc::RegistrationFailed ex;
    ex.reason = ex_flat.reason();
    throw ex;
  }
  case 2:
  {
    npkcalc::flat::PermissionViolation_Direct ex_flat(buf, sizeof(::nprpc::impl::Header));
    npkcalc::PermissionViolation ex;
    ex.msg = (std::string_view)ex_flat.msg();
    throw ex;
  }
  default:
    throw std::runtime_error("unknown rpc exception");
  }
}
