cmake_minimum_required(VERSION 4.0.1)
project(nscalc)

set(BOOST_LIB_PREFIX "/usr/lib" CACHE STRING "Location of the boost libs")

#set(OUTPUT_LIB_DIR ${CMAKE_BINARY_DIR}/lib)
#link_directories(${OUTPUT_DIR_LIB})

if("${CMAKE_BUILD_TYPE}" STREQUAL "")
  set(CMAKE_BUILD_TYPE "Release")
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/release)
elseif("${CMAKE_BUILD_TYPE}" STREQUAL "Debug")
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/debug)
else()
  set(CMAKE_BUILD_TYPE "Release")
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/release)
  message(WARNING "CMAKE_BUILD_TYPE is not set to Debug or Release, defaulting to Release")
endif()

message("Building: ${CMAKE_BUILD_TYPE}")

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

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
    -DBOOST_DISABLE_CURRENT_LOCATION
    -DBOOST_ASIO_DISABLE_CO_AWAIT
    -DBOOST_ASIO_DISABLE_STD_COROUTINE
    -D_SILENCE_CXX23_ALIGNED_STORAGE_DEPRECATION_WARNING
  )

  # Debugging flags
  set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} /Zi /Od")
  set(CMAKE_EXE_LINKER_FLAGS_DEBUG "${CMAKE_EXE_LINKER_FLAGS_DEBUG} /DEBUG")
  set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} /DEBUG")
  set(CMAKE_PDB_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/pdb)

  # Release flags
  set(CMAKE_CXX_FLAGS_RELEASE "/O2")

  add_compile_options(/W3 /bigobj /EHsc)
else()
  set(CMAKE_CXX_FLAGS_DEBUG  "-O0 -g")
  set(CMAKE_CXX_FLAGS_RELEASE "-O2 -g")
  set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
  add_compile_options(-Wall -Wno-deprecated-declarations)
endif()

include_directories(
  "${CMAKE_SOURCE_DIR}/external/npsystem/nprpc/include"
)

add_subdirectory(external/npsystem/nplib)
add_subdirectory(external/npsystem/nprpc)

include(external/npsystem/nprpc/cmake/npidl.cmake)

if (UNIX)
  npidl_generate_idl_files("${CMAKE_SOURCE_DIR}/idl/nscalc.npidl" nscalc_stub)
endif()
npidl_generate_idl_files("${CMAKE_SOURCE_DIR}/idl/proxy.npidl" proxy_stub)

if (UNIX)
  add_subdirectory(server)
  add_subdirectory(client)
endif()

add_subdirectory(proxy_client)
