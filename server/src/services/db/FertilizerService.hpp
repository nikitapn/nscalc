#pragma once

#include <memory>
#include <sqlite3.h>
#include "Database.hpp"
#include "idl/nscalc.hpp"

class FertilizerService {
  std::shared_ptr<Database> db_;
  sqlite3_stmt* insert_stmt_;
  sqlite3_stmt* select_all_stmt_;
public:
  explicit FertilizerService(const std::shared_ptr<Database>& database)
    : db_(database) {
      insert_stmt_ = db_->prepareStatement("INSERT INTO Fertilizer (userId, name, formula) VALUES (?, ?, ?);");
      select_all_stmt_ = db_->prepareStatement("SELECT Fertilizer.*, User.name AS userName FROM Fertilizer JOIN User ON Fertilizer.userId = User.id ORDER BY Fertilizer.name ASC;");
    }

  std::vector<nscalc::Fertilizer> getAll() {
    std::vector<nscalc::Fertilizer> fertilizers;
    while (sqlite3_step(select_all_stmt_) == SQLITE_ROW) {
      fertilizers.emplace_back();
      auto &cur = fertilizers.back();
      cur.id = sqlite3_column_int(select_all_stmt_, 0);
      cur.userId = sqlite3_column_int(select_all_stmt_, 1);
      cur.name = reinterpret_cast<const char *>(sqlite3_column_text(select_all_stmt_, 2));
      cur.formula = reinterpret_cast<const char *>(sqlite3_column_text(select_all_stmt_, 3));
      cur.userName = reinterpret_cast<const char *>(sqlite3_column_text(select_all_stmt_, 4));
    }
    sqlite3_reset(select_all_stmt_);
    return fertilizers;
  }

  sqlite3_int64 addFertilizer(uint32_t userId, const std::string& name, const std::string& formula) {
    sqlite3_bind_int(insert_stmt_, 1, userId);
    sqlite3_bind_text(insert_stmt_, 2, name.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(insert_stmt_, 3, formula.c_str(), -1, SQLITE_STATIC);
    if (sqlite3_step(insert_stmt_) != SQLITE_DONE) {
      std::cerr << "Failed to execute INSERT: " << sqlite3_errmsg(db_->getConnection()) << std::endl;
    }
    auto insertedId = sqlite3_last_insert_rowid(db_->getConnection());
    sqlite3_reset(insert_stmt_);
    return insertedId;
  }
};
