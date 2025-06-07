cmake_minimum_required(VERSION 3.25.1)
project(nscalc)

set(BOOST_LIB_PREFIX "/usr/lib" CACHE STRING "Location of the boost libs")

#set(OUTPUT_LIB_DIR ${CMAKE_BINARY_DIR}/lib)
#link_directories(${OUTPUT_DIR_LIB})

if("${CMAKE_BUILD_TYPE}" STREQUAL "")
  set(CMAKE_BUILD_TYPE "Release")
endif()

message("Building: ${CMAKE_BUILD_TYPE}")

set(CMAKE_CXX_STANDARD 20)
SET(CMAKE_CXX_FLAGS_DEBUG  "-O0 -g")
set(CMAKE_CXX_FLAGS_RELEASE "-O2 -g")

if(WIN32)
  if ("${OPT_BOOST_INCLUDE_DIR}" STREQUAL "")
    message(FATAL_ERROR "-DOPT_BOOST_INCLUDE_DIR is not set")
  endif()
  if ("${OPT_BOOST_LIB_DIR}" STREQUAL "")
    message(FATAL_ERROR "-DOPT_BOOST_LIB_DIR is not set")
  endif()

  set(OPT_OPENSSL_DIR "C:\\Program Files\\OpenSSL" CACHE STRING "Path to OpenSSL directory")
 
  include_directories(
    "${OPT_BOOST_INCLUDE_DIR}"
    "${OPT_OPENSSL_DIR}/include"
  )

  link_directories(
    "${OPT_BOOST_LIB_DIR}"
    "${OPT_OPENSSL_DIR}/lib"
  )

  add_definitions(
    -D_WIN32_WINNT=0x0A00
  )

  add_compile_options(/W3 /bigobj)
else()
  add_compile_options(-Wall -Wno-deprecated-declarations)
  set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

  include_directories(
    "${CMAKE_SOURCE_DIR}/external/npsystem/nprpc/include"
  )

  #link_directories(
  #  "${CMAKE_SOURCE_DIR}/../../npsystem/build/linux/nprpc"
  #)
endif()

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

add_subdirectory(external/npsystem/nplib)
add_subdirectory(external/npsystem/nprpc)

include(external/npsystem/nprpc/cmake/npidl.cmake)
set(IDL_FILES ${CMAKE_SOURCE_DIR}/idl/nscalc.npidl)
npidl_generate_idl_files("${IDL_FILES}" nscalc_stub)

add_subdirectory(server)
add_subdirectory(client)
