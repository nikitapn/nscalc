#include "Authorizator.hpp"
#include "RegisteredUser.hpp"
#include "services/db/UserService.hpp"

nscalc::UserData AuthorizatorImpl::tryLogIn(std::string_view user_email, std::string_view user_password) {
  std::lock_guard lk(*userService_);
  if (auto user = userService_->getUserByEmail(user_email); user) {
    if (!user_password.empty() && userService_->checkPassword(*user, user_password) == false) {
      dataObservers_->alarm(nscalc::AlarmType::Warning, "User \"" + user->user_name + "\" forgot his password");
      throw nscalc::AuthorizationFailed(nscalc::AuthorizationFailed_Reason::incorrect_password);
    }

    auto new_user = new RegisteredUser(*user, solutionService_, fertilizerService_, calculationService_, dataObservers_);
    auto oid = user_poa->activate_object(new_user, 
      nprpc::ObjectActivationFlags::SESSION_SPECIFIC,
      &nprpc::get_context()
    );

    Session s;
    do {
      s.sid = UserService::create_uuid();
    } while (sessions_.find(s) != sessions_.end());
    s.email = user_email;

    dataObservers_->alarm(nscalc::AlarmType::Info, "User \"" + user->user_name + "\" has logged in");

    return {user->user_name, sessions_.emplace(std::move(s)).first->sid, oid};
  } else {
    throw nscalc::AuthorizationFailed(nscalc::AuthorizationFailed_Reason::email_does_not_exist);
  }
}

// Implementation of the IAuthorizator_Servant interface 
nscalc::UserData AuthorizatorImpl::LogIn(::nprpc::flat::Span<char> login, ::nprpc::flat::Span<char> password) {
  auto user_email = (std::string_view)login;
  auto user_password = (std::string_view)password;

  if (user_password.empty()) {
    dataObservers_->alarm(nscalc::AlarmType::Warning, "User is trying to log in with an empty password");
    throw nscalc::AuthorizationFailed(nscalc::AuthorizationFailed_Reason::incorrect_password);
  }

  return tryLogIn(user_email, user_password);
}

// Implementation of the IAuthorizator_Servant interface 
nscalc::UserData AuthorizatorImpl::LogInWithSessionId(::nprpc::flat::Span<char> session_id) {
  auto sid = (std::string_view)session_id;
  Session s;
  s.sid.assign(sid.data(), sid.size());

  std::string email;
  {
    std::lock_guard lk(sessionsMutex_);
    if (auto it = sessions_.find(s); it != sessions_.end()) {
      email = it->email;
    }
  }

  if (email.empty())
    throw nscalc::AuthorizationFailed(nscalc::AuthorizationFailed_Reason::session_does_not_exist);

  return tryLogIn(email, {});
}

// Implementation of the IAuthorizator_Servant interface 
bool AuthorizatorImpl::LogOut(::nprpc::flat::Span<char> session_id) {
  auto sid = (std::string_view)session_id;
  Session s;
  s.sid.assign(sid.data(), sid.size());

  std::lock_guard<std::mutex> lk(sessionsMutex_);
  return static_cast<bool>(sessions_.erase(s));
}

// Implementation of the IAuthorizator_Servant interface 
bool AuthorizatorImpl::CheckUsername(::nprpc::flat::Span<char> username) {
  std::lock_guard lk(*userService_);
  return userService_->checkUsername(username);
}

// Implementation of the IAuthorizator_Servant interface 
bool AuthorizatorImpl::CheckEmail(::nprpc::flat::Span<char> email) {
  std::lock_guard lk(*userService_);
  return userService_->checkEmail(email);
}

// Implementation of the IAuthorizator_Servant interface 
void AuthorizatorImpl::AuthorizatorImpl::RegisterStepOne(::nprpc::flat::Span<char> username, ::nprpc::flat::Span<char> email, ::nprpc::flat::Span<char> password) {
  {
    std::lock_guard lk(*userService_);
    if (userService_->checkUsername(username) == false)
      throw nscalc::RegistrationFailed(nscalc::RegistrationFailed_Reason::username_already_exist);
    if (userService_->checkEmail(email) == false)
      throw nscalc::RegistrationFailed(nscalc::RegistrationFailed_Reason::email_already_registered);
  }

  NewUser user;
  user.user = std::make_unique<UserService::User>();

  user.user->password_sha256 = UserService::sha256(password);
  user.user->user_name = username;
  user.user->email = email;

  std::uniform_int_distribution<std::uint32_t> dist(10000, 99999);
  user.code = dist(rd_);

  // std::cerr << "Code: " << user.code << '\n';

  dataObservers_->alarm(nscalc::AlarmType::Info, "Dear " + user.user->user_name + ", here is your confirmation code: " + std::to_string(user.code));

  {
    std::lock_guard<std::mutex> lk(new_users_mut_);
    new_users_db_.emplace(user.user->user_name, std::move(user));
  }
}

// Implementation of the IAuthorizator_Servant interface 
void AuthorizatorImpl::RegisterStepTwo(::nprpc::flat::Span<char> username, uint32_t code) {
  std::lock_guard<std::mutex> lk(new_users_mut_);
  if (auto it = new_users_db_.find((std::string)username); it != new_users_db_.end()) {
    if (it->second.code != code) {
      throw nscalc::RegistrationFailed(nscalc::RegistrationFailed_Reason::incorrect_code);
    }
    dataObservers_->alarm(nscalc::AlarmType::Info, "New user '" + it->first + "' has been registered");
    auto user = std::move(it->second.user);
    new_users_db_.erase(it);
    {
      std::lock_guard lk(*userService_);
      userService_->addUser(std::move(user));
    }
  } else {
    throw nscalc::RegistrationFailed(nscalc::RegistrationFailed_Reason::invalid_username);
  }
}

AuthorizatorImpl::AuthorizatorImpl(
  nprpc::Rpc& rpc,
  std::shared_ptr<UserService> userService,
  std::shared_ptr<SolutionService> solutionService,
  std::shared_ptr<FertilizerService> fertilizerService,
  std::shared_ptr<CalculationService> calculationService,
  std::shared_ptr<DataObservers> dataObservers)
  : userService_{userService}
  , solutionService_{solutionService}
  , fertilizerService_{fertilizerService}
  , calculationService_{calculationService}
  , dataObservers_{dataObservers}
{	
  user_poa = nprpc::PoaBuilder(&rpc)
		.with_max_objects(1024)
		.with_lifespan(nprpc::PoaPolicy::Lifespan::Transient)
		.build();

  userService_->load();
}
