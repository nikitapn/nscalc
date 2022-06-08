#ifndef NPKCALC_M_
#define NPKCALC_M_

struct npkcalc_M1 {
  std::string _1;
  std::string _2;
};

namespace flat {
struct npkcalc_M1 {
  ::flat::String _1;
  ::flat::String _2;
};

class npkcalc_M1_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M1*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M1*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M1_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(const char* str) { new (&base()._1) ::flat::String(buffer_, str); }
  void _1(const std::string& str) { new (&base()._1) ::flat::String(buffer_, str); }
  auto _1() noexcept { return (::flat::Span<char>)base()._1; }
  auto _1() const noexcept { return (::flat::Span<const char>)base()._1; }
  auto _1_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M1, _1));  }
  void _2(const char* str) { new (&base()._2) ::flat::String(buffer_, str); }
  void _2(const std::string& str) { new (&base()._2) ::flat::String(buffer_, str); }
  auto _2() noexcept { return (::flat::Span<char>)base()._2; }
  auto _2() const noexcept { return (::flat::Span<const char>)base()._2; }
  auto _2_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M1, _2));  }
};
} // namespace flat

struct npkcalc_M2 {
  npkcalc::UserData _1;
};

namespace flat {
struct npkcalc_M2 {
  npkcalc::flat::UserData _1;
};

class npkcalc_M2_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M2*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M2*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M2_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return npkcalc::flat::UserData_Direct(buffer_, offset_ + offsetof(npkcalc_M2, _1)); }
};
} // namespace flat

struct npkcalc_M3 {
  std::string _1;
};

namespace flat {
struct npkcalc_M3 {
  ::flat::String _1;
};

class npkcalc_M3_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M3*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M3*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M3_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(const char* str) { new (&base()._1) ::flat::String(buffer_, str); }
  void _1(const std::string& str) { new (&base()._1) ::flat::String(buffer_, str); }
  auto _1() noexcept { return (::flat::Span<char>)base()._1; }
  auto _1() const noexcept { return (::flat::Span<const char>)base()._1; }
  auto _1_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M3, _1));  }
};
} // namespace flat

struct npkcalc_M4 {
  bool _1;
};

namespace flat {
struct npkcalc_M4 {
  bool _1;
};

class npkcalc_M4_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M4*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M4*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M4_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const bool& _1() const noexcept { return base()._1;}
  bool& _1() noexcept { return base()._1;}
};
} // namespace flat

struct npkcalc_M5 {
  std::vector<npkcalc::Calculation> _1;
};

namespace flat {
struct npkcalc_M5 {
  ::flat::Vector<npkcalc::flat::Calculation> _1;
};

class npkcalc_M5_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M5*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M5*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M5_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(size_t elements_size) { new (&base()._1) ::flat::Vector<npkcalc::flat::Calculation>(buffer_, elements_size); }
  auto _1_vd() noexcept { return ::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct>(buffer_, offset_ + offsetof(npkcalc_M5, _1)); }
  auto _1() noexcept { return ::flat::Span_ref<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct>(buffer_, base()._1.range(buffer_.data().data())); }
};
} // namespace flat

struct npkcalc_M6 {
  std::string _1;
  std::array<double,14> _2;
};

namespace flat {
struct npkcalc_M6 {
  ::flat::String _1;
  ::flat::Array<double,14> _2;
};

class npkcalc_M6_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M6*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M6*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M6_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(const char* str) { new (&base()._1) ::flat::String(buffer_, str); }
  void _1(const std::string& str) { new (&base()._1) ::flat::String(buffer_, str); }
  auto _1() noexcept { return (::flat::Span<char>)base()._1; }
  auto _1() const noexcept { return (::flat::Span<const char>)base()._1; }
  auto _1_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M6, _1));  }
  auto _2() noexcept { return (::flat::Span<double>)base()._2; }
};
} // namespace flat

struct npkcalc_M7 {
  uint32_t _1;
};

namespace flat {
struct npkcalc_M7 {
  uint32_t _1;
};

class npkcalc_M7_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M7*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M7*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M7_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& _1() const noexcept { return base()._1;}
  uint32_t& _1() noexcept { return base()._1;}
};
} // namespace flat

struct npkcalc_M8 {
  uint32_t _1;
  std::string _2;
};

namespace flat {
struct npkcalc_M8 {
  uint32_t _1;
  ::flat::String _2;
};

class npkcalc_M8_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M8*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M8*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M8_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& _1() const noexcept { return base()._1;}
  uint32_t& _1() noexcept { return base()._1;}
  void _2(const char* str) { new (&base()._2) ::flat::String(buffer_, str); }
  void _2(const std::string& str) { new (&base()._2) ::flat::String(buffer_, str); }
  auto _2() noexcept { return (::flat::Span<char>)base()._2; }
  auto _2() const noexcept { return (::flat::Span<const char>)base()._2; }
  auto _2_vd() noexcept {     return ::flat::String_Direct1(buffer_, offset_ + offsetof(npkcalc_M8, _2));  }
};
} // namespace flat

struct npkcalc_M9 {
  uint32_t _1;
  std::vector<npkcalc::SolutionElement> _2;
};

namespace flat {
struct npkcalc_M9 {
  uint32_t _1;
  ::flat::Vector<npkcalc::flat::SolutionElement> _2;
};

class npkcalc_M9_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M9*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M9*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M9_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  const uint32_t& _1() const noexcept { return base()._1;}
  uint32_t& _1() noexcept { return base()._1;}
  void _2(size_t elements_size) { new (&base()._2) ::flat::Vector<npkcalc::flat::SolutionElement>(buffer_, elements_size); }
  auto _2_vd() noexcept { return ::flat::Vector_Direct2<npkcalc::flat::SolutionElement, npkcalc::flat::SolutionElement_Direct>(buffer_, offset_ + offsetof(npkcalc_M9, _2)); }
  auto _2() noexcept { return ::flat::Span_ref<npkcalc::flat::SolutionElement, npkcalc::flat::SolutionElement_Direct>(buffer_, base()._2.range(buffer_.data().data())); }
};
} // namespace flat

struct npkcalc_M10 {
  npkcalc::Calculation _1;
};

namespace flat {
struct npkcalc_M10 {
  npkcalc::flat::Calculation _1;
};

class npkcalc_M10_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M10*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M10*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M10_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return npkcalc::flat::Calculation_Direct(buffer_, offset_ + offsetof(npkcalc_M10, _1)); }
};
} // namespace flat

struct npkcalc_M11 {
  npkcalc::Alarm _1;
};

namespace flat {
struct npkcalc_M11 {
  npkcalc::flat::Alarm _1;
};

class npkcalc_M11_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M11*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M11*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M11_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return npkcalc::flat::Alarm_Direct(buffer_, offset_ + offsetof(npkcalc_M11, _1)); }
};
} // namespace flat

struct npkcalc_M12 {
  nprpc::ObjectId _1;
};

namespace flat {
struct npkcalc_M12 {
  nprpc::detail::flat::ObjectId _1;
};

class npkcalc_M12_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M12*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M12*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M12_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return nprpc::detail::flat::ObjectId_Direct(buffer_, offset_ + offsetof(npkcalc_M12, _1)); }
};
} // namespace flat

struct npkcalc_M13 {
  npkcalc::ChatMessage _1;
};

namespace flat {
struct npkcalc_M13 {
  npkcalc::flat::ChatMessage _1;
};

class npkcalc_M13_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M13*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M13*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M13_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  auto _1() noexcept { return npkcalc::flat::ChatMessage_Direct(buffer_, offset_ + offsetof(npkcalc_M13, _1)); }
};
} // namespace flat

struct npkcalc_M14 {
  std::vector<npkcalc::Solution> _1;
  std::vector<npkcalc::Fertilizer> _2;
};

namespace flat {
struct npkcalc_M14 {
  ::flat::Vector<npkcalc::flat::Solution> _1;
  ::flat::Vector<npkcalc::flat::Fertilizer> _2;
};

class npkcalc_M14_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M14*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M14*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M14_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(size_t elements_size) { new (&base()._1) ::flat::Vector<npkcalc::flat::Solution>(buffer_, elements_size); }
  auto _1_vd() noexcept { return ::flat::Vector_Direct2<npkcalc::flat::Solution, npkcalc::flat::Solution_Direct>(buffer_, offset_ + offsetof(npkcalc_M14, _1)); }
  auto _1() noexcept { return ::flat::Span_ref<npkcalc::flat::Solution, npkcalc::flat::Solution_Direct>(buffer_, base()._1.range(buffer_.data().data())); }
  void _2(size_t elements_size) { new (&base()._2) ::flat::Vector<npkcalc::flat::Fertilizer>(buffer_, elements_size); }
  auto _2_vd() noexcept { return ::flat::Vector_Direct2<npkcalc::flat::Fertilizer, npkcalc::flat::Fertilizer_Direct>(buffer_, offset_ + offsetof(npkcalc_M14, _2)); }
  auto _2() noexcept { return ::flat::Span_ref<npkcalc::flat::Fertilizer, npkcalc::flat::Fertilizer_Direct>(buffer_, base()._2.range(buffer_.data().data())); }
};
} // namespace flat

struct npkcalc_M15 {
  std::vector<npkcalc::Media> _1;
};

namespace flat {
struct npkcalc_M15 {
  ::flat::Vector<npkcalc::flat::Media> _1;
};

class npkcalc_M15_Direct {
  boost::beast::flat_buffer& buffer_;
  const size_t offset_;

  auto& base() noexcept { return *reinterpret_cast<npkcalc_M15*>(reinterpret_cast<std::byte*>(buffer_.data().data()) + offset_); }
  auto const& base() const noexcept { return *reinterpret_cast<const npkcalc_M15*>(reinterpret_cast<const std::byte*>(buffer_.data().data()) + offset_); }
public:
  void* __data() noexcept { return (void*)&base(); }
  npkcalc_M15_Direct(boost::beast::flat_buffer& buffer, size_t offset)
    : buffer_(buffer)
    , offset_(offset)
  {
  }
  void _1(size_t elements_size) { new (&base()._1) ::flat::Vector<npkcalc::flat::Media>(buffer_, elements_size); }
  auto _1_vd() noexcept { return ::flat::Vector_Direct2<npkcalc::flat::Media, npkcalc::flat::Media_Direct>(buffer_, offset_ + offsetof(npkcalc_M15, _1)); }
  auto _1() noexcept { return ::flat::Span_ref<npkcalc::flat::Media, npkcalc::flat::Media_Direct>(buffer_, base()._1.range(buffer_.data().data())); }
};
} // namespace flat


#endif