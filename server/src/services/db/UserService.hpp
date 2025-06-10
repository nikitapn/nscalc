#pragma once

#include <memory>
#include <mutex>
#include <string_view>
#include <map>
#include <sqlite3.h>
#include <vector>
#include "Database.hpp"
#include <openssl/sha.h>
#include <boost/uuid/random_generator.hpp>

class UserService {
public:
  struct User {
    std::uint32_t id;
    std::string email;
    std::string password_sha256; // SHA256 stores 32 bytes
    std::string user_name;
    std::uint32_t permissions;
  };

  static std::string create_uuid() {
    boost::uuids::random_generator generator;
    auto uid = generator();
    std::stringstream ss;
    for (size_t i = 0; i < 16; ++i) {
      ss << std::hex << std::setw(1) << (int)uid.data[i];
    }
    return ss.str();
  }

  static std::string sha256(std::string_view str) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256;
    SHA256_Init(&sha256);
    SHA256_Update(&sha256, str.data(), str.size());
    SHA256_Final(hash, &sha256);
    return std::string((char*)hash, SHA256_DIGEST_LENGTH);
  }
private:
  std::mutex mut_;
  std::vector<std::unique_ptr<User>> users_;
  std::map<std::string, User*, std::less<>> users_by_email_;
  std::map<std::string, User*, std::less<>> users_by_name_;

  std::shared_ptr<Database> db_;
  sqlite3_stmt* insert_stmt_;
  sqlite3_stmt* select_all_stmt_;

  static std::string strToLower(std::string_view str) {
    std::string result(str.size(), '\0');
    std::transform(std::begin(str), std::end(str), std::begin(result), [](unsigned char c) {
      return std::tolower(c);
    });
    return result;
  }

  static User* getByKey(std::string_view key, const std::map<std::string, User*, std::less<>>& map) {
    auto it = map.find(key);
    return  it != map.end() ? it->second : nullptr;
  }
public:
  void load() {
    while (sqlite3_step(select_all_stmt_) == SQLITE_ROW) {
      auto user = std::make_unique<User>();
      user->id = sqlite3_column_int(select_all_stmt_, 0);
      user->user_name = reinterpret_cast<const char *>(sqlite3_column_text(select_all_stmt_, 1));
      auto pwd = sqlite3_column_blob(select_all_stmt_, 2);
      user->password_sha256 = std::string(reinterpret_cast<const char *>(pwd), sqlite3_column_bytes(select_all_stmt_, 2));
      user->email = reinterpret_cast<const char *>(sqlite3_column_text(select_all_stmt_, 3));
      user->permissions = sqlite3_column_int(select_all_stmt_, 4);

      users_by_email_[user->email] = user.get();
      users_by_name_[user->user_name] = user.get();
      users_.emplace_back(std::move(user));
    }
    sqlite3_reset(select_all_stmt_);
  }

  bool checkUsername(std::string_view username) const noexcept {
    const auto lowercase = strToLower(username);
    return getByKey(lowercase, users_by_name_) == nullptr;
  }

  bool checkEmail(std::string_view email) const noexcept {
    const auto lowercase = strToLower(email);
    return getByKey(lowercase, users_by_email_) == nullptr;
  }

  uint32_t addUser(std::unique_ptr<User> user) {
    sqlite3_bind_text(insert_stmt_, 1, user->user_name.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_blob(insert_stmt_, 2, user->password_sha256.c_str(), user->password_sha256.length(), SQLITE_STATIC);
    sqlite3_bind_text(insert_stmt_, 3, user->email.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(insert_stmt_,  4, user->permissions);
    if (sqlite3_step(insert_stmt_) != SQLITE_DONE) {
      std::cerr << "Failed to execute INSERT: " << sqlite3_errmsg(db_->getConnection()) << std::endl;
    }
    sqlite3_reset(insert_stmt_);

    auto id = sqlite3_last_insert_rowid(db_->getConnection());
    user->id = static_cast<uint32_t>(id);

    users_by_email_[user->email] = user.get();
    users_by_name_[user->user_name] = user.get();
    users_.emplace_back(std::move(user));

    return id;
  }

  const User* getUserByName(std::string_view name) const noexcept {
    return getByKey(name, users_by_name_);
  }

  const User* getUserByEmail(std::string_view email) const noexcept {
    return getByKey(email, users_by_email_);
  }

  void lock() {
    mut_.lock();
  }

  void unlock() {
    mut_.unlock();
  }

  static bool isUserAdmin(const User& user) {
    return (user.permissions & 0x01) != 0;
  }
  
  static bool isUserAllowedToUseProxy(const User& user) {
    return (user.permissions & 0x02) != 0;
  }

  static bool checkPassword(const User& user, std::string_view password) {
    return user.password_sha256 == sha256(password);
  }

  explicit UserService(const std::shared_ptr<Database>& database)
    : db_(database) {
      insert_stmt_ = db_->prepareStatement("INSERT INTO User (name, pwd, email, permissions) VALUES (?, ?, ?, ?);");
      select_all_stmt_ = db_->prepareStatement("SELECT * FROM User;");
    }
};