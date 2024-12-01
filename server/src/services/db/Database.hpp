#pragma once

#include <sqlite3.h>
#include <stdexcept>
#include <string>
#include <iostream>

class Database {
  sqlite3 *db_;
  std::string dbPath_;
public:
  explicit Database(const std::string &path) 
    : db_(nullptr)
    , dbPath_(path) 
  {
    if (sqlite3_threadsafe() != 1) {
      // https://www.sqlite.org/c3ref/c_config_covering_index_scan.html#sqliteconfigserialized
      throw std::runtime_error("Threading mode isn't set to 'SQLITE_CONFIG_SERIALIZED'");
    }
    if (sqlite3_open(dbPath_.c_str(), &db_) != SQLITE_OK) {
      std::cerr << "Failed to open database: " << sqlite3_errmsg(db_) << std::endl;
      throw std::runtime_error("Database connection failed");
    }
    std::cout << "Database is open: " << path << std::endl;
    execute("PRAGMA foreign_keys = ON;");
  }

  ~Database() {
    if (db_) {
      sqlite3_close(db_);
    }
  }

  sqlite3 *getConnection() {
    return db_;
  }

  // Generic method for executing a query without a result
  void execute(const std::string &query) {
    char *errMsg = nullptr;
    if (sqlite3_exec(db_, query.c_str(), nullptr, nullptr, &errMsg) != SQLITE_OK) {
      std::cerr << "Error executing query: " << errMsg << std::endl;
      sqlite3_free(errMsg);
    }
  }

  sqlite3_stmt* prepareStatement(const std::string& sql) {
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db_, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Failed to prepare statement: " << sqlite3_errmsg(db_) << std::endl;
        throw std::runtime_error("Failed to prepare statement");
    }
    return stmt;
  }

};
