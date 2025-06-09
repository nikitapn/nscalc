
find_package(Qt6 COMPONENTS Core Gui Widgets REQUIRED)
qt_standard_project_setup()

if (WIN32)
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /Zc:__cplusplus")

  set(BOOST_DIR "$ENV{BOOST_DIR}")

  if ("${BOOST_DIR}" STREQUAL "")
    message(FATAL_ERROR "BOOST_DIR is not set")
  endif()

  set(OPT_OPENSSL_DIR "C:\\Program Files\\OpenSSL" CACHE STRING "Path to OpenSSL directory")

  include_directories(
    "${BOOST_DIR}"
    "${OPT_OPENSSL_DIR}/include"
  )

  link_directories(
    "${BOOST_DIR}/stage_x64/lib"
    "${OPT_OPENSSL_DIR}/lib"
  )
  add_definitions(
    -DBOOST_DISABLE_CURRENT_LOCATION
    -DBOOST_ASIO_DISABLE_CO_AWAIT
    -DBOOST_ASIO_DISABLE_STD_COROUTINE
    -D_WIN32_WINNT=0x0A00
    -D_SILENCE_CXX23_ALIGNED_STORAGE_DEPRECATION_WARNING
  )
  add_compile_options(/W3 /bigobj)
endif()

set(SOURCES
  ${proxy_stub_GENERATED_HEADERS}
  ${proxy_stub_GENERATED_SOURCES}
  src/main.cpp
  src/MainWindow.hpp
  src/MainWindow.cpp
  src/socks5.hpp
  src/socks5.cpp
)

qt_add_resources(SOURCES src/systray.qrc)
qt_add_executable(proxy_client ${SOURCES})

target_include_directories(proxy_client PRIVATE
  ${proxy_stub_INCLUDE_DIR}
)

set_target_properties(proxy_client PROPERTIES
  WIN32_EXECUTABLE TRUE
  MACOSX_BUNDLE TRUE
)

target_link_libraries(proxy_client PRIVATE 
  Qt6::Core
  Qt6::Gui
  Qt6::Widgets
  nprpc
)

add_dependencies(proxy_client proxy_stub_gen)

#install(TARGETS ${PROJECT_NAME} DESTINATION bin)

