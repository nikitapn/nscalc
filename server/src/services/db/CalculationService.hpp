#pragma once

#include <memory>
#include <sqlite3.h>
#include "Database.hpp"
#include "idl/nscalc.hpp"

class CalculationService {
  std::shared_ptr<Database> db_;
  sqlite3_stmt* insert_stmt_;
  sqlite3_stmt* select_all_for_user_;
public:
  explicit CalculationService(const std::shared_ptr<Database>& database)
    : db_(database) {
      insert_stmt_ = db_->prepareStatement("INSERT INTO Calculation (userId, name, elements, fertilizersIds, volume, mode) VALUES (?, ?, ?, ?, ?, ?);");
      select_all_for_user_ = db_->prepareStatement("SELECT id, name, elements, fertilizersIds, volume, mode FROM Calculation WHERE userId == ?;");
    }

  std::vector<nscalc::Calculation> getAll(sqlite3_int64 userId) {
    sqlite3_bind_int(select_all_for_user_, 1, userId);
    std::vector<nscalc::Calculation> calculations;
    while (sqlite3_step(select_all_for_user_) == SQLITE_ROW) {
      calculations.emplace_back();
      auto &cur = calculations.back();
      cur.id = sqlite3_column_int(select_all_for_user_, 0);
      cur.name = reinterpret_cast<const char *>(sqlite3_column_text(select_all_for_user_, 1));
      cur.elements = reinterpret_cast<const char *>(sqlite3_column_text(select_all_for_user_, 2));
      cur.fertilizersIds = reinterpret_cast<const char *>(sqlite3_column_text(select_all_for_user_, 3));
      cur.volume = sqlite3_column_double(select_all_for_user_, 4);
      cur.mode = sqlite3_column_int(select_all_for_user_, 5);
    }
    sqlite3_reset(select_all_for_user_);
    return calculations;
  }

};
