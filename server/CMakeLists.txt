cmake_minimum_required(VERSION 3.25.1)

project(nscalc)

find_package(SQLite3 REQUIRED)

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

list(APPEND IDL_FILES_LIST
  idl/nscalc.npidl
)

foreach(file ${IDL_FILES_LIST})
  string(REPLACE "/" "_" tmp ${file})
  string(REPLACE "idl/" "" filename ${file})
  string(REPLACE ".npidl" ".cpp" filename_cpp ${filename})
  string(REPLACE ".npidl" ".hpp" filename_hpp ${filename})
  string(REPLACE ".npidl" ".ts" filename_ts ${filename})
  add_custom_command(
    OUTPUT 
      ${CMAKE_SOURCE_DIR}/src/idl/${filename_hpp}
      ${CMAKE_SOURCE_DIR}/src/idl/${filename_cpp}
      ${CMAKE_SOURCE_DIR}/../client/src/rpc/${filename_ts}
    COMMAND
      npidl
      --out-inc-dir ${CMAKE_SOURCE_DIR}/src/idl
      --out-src-dir ${CMAKE_SOURCE_DIR}/src/idl
      --out-ts-dir ${CMAKE_SOURCE_DIR}/../client/src/rpc
      ${CMAKE_SOURCE_DIR}/idl/${filename}
    DEPENDS
      npidl
      ${file}
  )
endforeach()


include_directories(
  src
)

add_executable(nscalc
  src/idl/nscalc.hpp
  src/idl/nscalc.cpp
  src/util/thread_pool.hpp
  src/services/db/Database.hpp
  src/services/db/SolutionService.hpp
  src/services/db/FertilizerService.hpp
  src/services/db/CalculationService.hpp
  src/services/objects/Authorizator.hpp
  src/services/objects/Authorizator.cpp
  src/services/objects/Calculator.hpp
  src/services/objects/RegisteredUser.hpp
  src/services/objects/Chat.hpp
  src/services/client/Observer.hpp
  src/services/client/DataObserver.hpp
  src/main.cpp
)

target_link_libraries(nscalc PRIVATE
  pthread
  crypto
  nprpc
  boost_program_options
  boost_serialization
  SQLite::SQLite3
)