
find_package(SQLite3 REQUIRED)

include_directories(
  ${nscalc_stub_INCLUDE_DIR}
  src
)

add_executable(nscalc
  ${nscalc_stub_GENERATED_SOURCES}
  src/util/util.hpp
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
