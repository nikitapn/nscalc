// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

#include <iostream>
#include <string>
#include <concepts>
#include <cassert>
#include <filesystem>
#include <set>
#include <algorithm>
#include <boost/asio/signal_set.hpp>
#include <boost/beast/core/error.hpp>
#include <boost/uuid/random_generator.hpp>
#include <boost/serialization/set.hpp>
#include <boost/archive/text_iarchive.hpp>
#include <boost/archive/text_oarchive.hpp>
#include <boost/program_options.hpp>
#include <openssl/sha.h>
#include "npkcalc.hpp"
#include "data.hpp"
#include "thread_pool.hpp"
#include <nprpc/serialization/oarchive.h>
#include <boost/asio/strand.hpp>
#include <nprpc/session_context.h>
#include <random>

using thread_pool = nplib::thread_pool_4;

template<typename T>
class ObserversT {
	boost::asio::io_context::strand strand_;
protected:
	std::vector<std::unique_ptr<T>> observers;

	auto& executor() { return strand_; }

	struct no_condition_t {
		bool operator()(std::unique_ptr<T>&) { 
			return false; 
		}
	};

	struct not_equal_t {
		T* target;
		bool operator()(std::unique_ptr<T>& obj) const noexcept {
			return target == obj.get();
		}
	};

	struct not_equal_to_endpoint_t {
		nprpc::EndPoint& endpoint;
		bool operator()(std::unique_ptr<T>& obj) const noexcept { 
			return obj->_data().ip4 == endpoint.ip4 &&
				obj->_data().port == endpoint.port; 
		}
	};

	static constexpr auto no_condition = no_condition_t{};

	template<typename F, typename Condition, typename... Args>
	void broadcast(F fn, Condition cond, const Args&... args) {
		for (auto it = std::begin(observers); it != observers.end(); ) {
			if (cond(*it)) {
				it = std::next(it);
				continue;
			}
			try {
				std::mem_fn(fn)(*it, args...);
				it = std::next(it);
			} catch (nprpc::Exception&) {
				it = observers.erase(it);
			}
		}
	}

	void add_impl(T* observer) { observers.emplace_back(observer); }
public:
	void add(T* observer) { nplib::async<false>(executor(), &ObserversT::add_impl, this, observer); }

	ObserversT() : strand_{ thread_pool::get_instance().make_strand() } {}
};

class DataObservers : public ObserversT<npkcalc::DataObserver> {
	uint32_t alarm_id_ = 0;

	npkcalc::Alarm make_alarm(npkcalc::AlarmType type, const std::string& msg) {
		return { alarm_id_++, type, msg };
	}

	void alarm_impl(npkcalc::AlarmType type, std::string msg) {
		broadcast(&npkcalc::DataObserver::OnAlarm, no_condition, make_alarm(type, msg));
	}
public:
	void alarm(npkcalc::AlarmType type, std::string&& msg) {
		nplib::async<false>(executor(), &DataObservers::alarm_impl, this, type, msg);
	}
} observers;

class ChatImpl
	: public npkcalc::IChat_Servant
	, public ObserversT<npkcalc::ChatParticipant>
{
	void send_to_all_impl(npkcalc::ChatMessage msg, nprpc::EndPoint endpoint) {
		broadcast(&npkcalc::ChatParticipant::OnMessage, not_equal_to_endpoint_t{ endpoint }, std::ref(msg));
	}
	void send_to_all(npkcalc::ChatMessage&& msg, nprpc::EndPoint endpoint) {
		nplib::async<false>(executor(), &ChatImpl::send_to_all_impl, this, std::move(msg), std::move(endpoint));
	}
public:
	virtual void Connect(nprpc::Object* obj) {
		if (auto participant = nprpc::narrow<npkcalc::ChatParticipant>(obj); participant) {
			participant->add_ref();
			participant->set_timeout(250);
			add(participant);
		}
	}

	virtual bool Send(npkcalc::flat::ChatMessage_Direct msg) {
		auto timestamp = static_cast<uint32_t>(std::chrono::duration_cast<std::chrono::minutes>(
			std::chrono::system_clock::now().time_since_epoch()).count());
		send_to_all(npkcalc::ChatMessage{ timestamp, (std::string)msg.str() }, nprpc::get_context().remote_endpoint);
		return true;
	}
};

class DataManager {
	const std::string& data_root_dir_;
public:
	std::mutex mut_solutions;
	Solutions solutions;

	std::mutex mut_fertilizers;
	Fertilizers fertilizers;

	std::vector<npkcalc::Media> icons;

	Calculations get_calculations(std::string owner) const noexcept {
		Calculations calcs{data_root_dir_ + "/calculations/" + owner + ".bin"};
		calcs.load();
		return calcs;
	}

	void save_calculations(const Calculations& calculations, const std::string& owner) const noexcept {
		calculations.store(data_root_dir_ + "/calculations/" + owner + ".bin");
	}

	DataManager(const std::string& data_root_dir)
		: data_root_dir_{data_root_dir}
		, solutions{data_root_dir + "/sols.bin"}
		, fertilizers{data_root_dir + "/ferts.bin"}
	{
		solutions.load();
		solutions.sort();

		fertilizers.load();
		fertilizers.sort();

		constexpr std::string_view icon_list[] = {"add", "save", "redo", "undo", "gear", "bell"};
		const auto root = std::string(data_root_dir + "/icons/");
		const auto svg = std::string(".svg");

		for (auto ic : icon_list) {
			const auto s = std::string(ic);
			std::ifstream is(root + s + svg, std::ios_base::binary);
			if (!is) throw s + " not found...";
			icons.emplace_back();
			icons.back().name = s;
			icons.back().data = {std::istreambuf_iterator<char>(is), std::istreambuf_iterator<char>()};
		}
	}
};

struct User {
	std::string email;
	std::string password_sha256;
	std::string user_name;

	template<class Archive>
	void serialize(Archive& ar, const int file_version) {
		ar& email;
		ar& password_sha256;
		ar& user_name;
	}
};

class RegisteredUser : public npkcalc::IRegisteredUser_Servant {
	friend class CalculatorImpl;
	inline static DataManager* data_manager;

	const User& user_data_;

	bool calculations_changed = false;
	bool solutions_changed = false;
	bool fertilizers_changed = false;

	Calculations calculations;

	npkcalc::Solution* get_solution(std::uint32_t id) {
		auto item = data_manager->solutions.get_by_id(id);
		if (item && item->owner != user_data_.user_name) {
			observers.alarm(npkcalc::AlarmType::Critical, user_data_.user_name + " is fiddeling with \"" + item->name + 
				"\": please report this incident to the authority");
			throw npkcalc::PermissionViolation{ "You don't have rights to fiddle with this solution." };
		}
		return item;
	}

	npkcalc::Fertilizer* get_fertilizer(std::uint32_t id) {
		auto item = data_manager->fertilizers.get_by_id(id);
		if (item && item->owner != user_data_.user_name) {
			observers.alarm(npkcalc::AlarmType::Critical, user_data_.user_name + " is fiddeling with \"" + item->name +
				"\": please report this incident to the authority");
			throw npkcalc::PermissionViolation{ "You don't have rights to fiddle with this fertilizer." };
		}
		return item;
	}
public:
	const User& user_data() const noexcept {
		return user_data_;
	}

	virtual void GetMyCalculations(
		/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct> calculations) {
		npkcalc::helper::assign_from_cpp_GetMyCalculations_calculations(calculations, this->calculations.data());
	}

	virtual uint32_t AddSolution(::nprpc::flat::Span<char> name, ::nprpc::flat::Span<double> elements) {
		std::lock_guard<std::mutex> lk(data_manager->mut_solutions);
		auto s = data_manager->solutions.create();
		s->name = name;
		s->owner = user_data_.user_name;
		std::transform(elements.begin(), elements.end(), s->elements.begin(), [](auto x) { return x; });

		observers.alarm(npkcalc::AlarmType::Info, user_data().user_name + " added solution \"" + s->name + "\"");
		solutions_changed = true;

		return s->id;
	}

	virtual void SetSolutionName(uint32_t id, ::nprpc::flat::Span<char> name) {
		std::lock_guard<std::mutex> lk(data_manager->mut_solutions);
		if (auto item = get_solution(id); item) {
			item->name = (std::string_view)name;
			solutions_changed = true;
		}
	}

	virtual void SetSolutionElements(uint32_t id, ::nprpc::flat::Span_ref<npkcalc::flat::SolutionElement, npkcalc::flat::SolutionElement_Direct> name) {
		std::lock_guard<std::mutex> lk(data_manager->mut_solutions);
		if (auto s = get_solution(id); s) {
			for (auto e : name) {
				if (e.index() >= 14) continue;
				s->elements[e.index()] = e.value();
			}
			solutions_changed = true;
		}
	}

	virtual void DeleteSolution(uint32_t id) {
		std::string name;
		bool deleted = false;
		{
			std::lock_guard<std::mutex> lk(data_manager->mut_solutions);
			if (auto s = get_solution(id); s) {
				name = std::move(s->name);
				data_manager->solutions.remove_by_id(id);
				deleted = true;
			}
		}
		if (deleted) {
			solutions_changed = true;
			observers.alarm(npkcalc::AlarmType::Info, user_data().user_name + " has deleted solution \"" + name + "\"");
		}
	}

	virtual uint32_t AddFertilizer(::nprpc::flat::Span<char> name, ::nprpc::flat::Span<char> formula) {
		fertilizers_changed = true;
		std::lock_guard<std::mutex> lk(data_manager->mut_fertilizers);
		auto f = data_manager->fertilizers.create();
		f->name = name;
		f->owner = user_data_.user_name;
		f->formula = formula;
		return f->id;
	}

	virtual void SetFertilizerName(uint32_t id, ::nprpc::flat::Span<char> name) {
		std::lock_guard<std::mutex> lk(data_manager->mut_fertilizers);
		if (auto item = get_fertilizer(id); item) {
			item->name = (std::string_view)name;
			fertilizers_changed = true;
		} else {
			std::cerr << "fertilizer with id = " << id << " was not found..\n";
		}
	}

	virtual void SetFertilizerFormula(uint32_t id, ::nprpc::flat::Span<char> name) {
		std::lock_guard<std::mutex> lk(data_manager->mut_fertilizers);
		if (auto item = get_fertilizer(id); item) {
			item->formula = name;
			fertilizers_changed = true;
		} else {
			std::cerr << "fertilizer with id = " << id << " was not found..\n";
		}
	}

	virtual void DeleteFertilizer(uint32_t id) {
		std::string name;
		bool deleted = false;
		{
			std::lock_guard<std::mutex> lk(data_manager->mut_fertilizers);
			if (auto item = get_fertilizer(id); item) {
				deleted = true;
				data_manager->fertilizers.remove_by_id(id);
			}
		}
		if (deleted) {
			fertilizers_changed = true;
			observers.alarm(npkcalc::AlarmType::Info, user_data().user_name + " has deleted fertilizer \"" + name + "\"");
		}
	}

	virtual void SaveData() {
		if (solutions_changed) {
			std::lock_guard<std::mutex> lk(data_manager->mut_solutions);
			data_manager->solutions.store();
			solutions_changed = false;
		}

		if (fertilizers_changed) {
			std::lock_guard<std::mutex> lk(data_manager->mut_fertilizers);
			data_manager->fertilizers.store();
			fertilizers_changed = false;
		}
	}

	virtual uint32_t UpdateCalculation(npkcalc::flat::Calculation_Direct calculation) {
		uint32_t id = calculation.id();
		npkcalc::Calculation* calc = calculations.get_by_id(id);

		if (!calc) {
			calc = calculations.create();
			id = calculation.id() = calc->id;
		}

		npkcalc::helper::assign_from_flat_UpdateCalculation_calculation(calculation, *calc);
		data_manager->save_calculations(calculations, user_data().user_name);
		
		return id;
	}

	virtual void DeleteCalculation(uint32_t id) {
		calculations.remove_by_id(id);
		data_manager->save_calculations(calculations, user_data().user_name);
	}

	RegisteredUser(const User& _user_data)
		: user_data_(_user_data)
		, calculations(data_manager->get_calculations(_user_data.user_name))
	{
	}
};

class CalculatorImpl : public npkcalc::ICalculator_Servant {
	std::unique_ptr<DataManager> data_manager;
public:
	CalculatorImpl(const std::string& data_root_dir)
		: data_manager{std::make_unique<DataManager>(data_root_dir)}
	{
		RegisteredUser::data_manager = data_manager.get();
	}

	virtual void GetData(
		/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Solution, npkcalc::flat::Solution_Direct> solutions,
		/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Fertilizer, npkcalc::flat::Fertilizer_Direct> fertilizers)
	{
		const auto& sols = data_manager->solutions.data();
		npkcalc::helper::assign_from_cpp_GetData_solutions(solutions, sols);

		const auto& ferts = data_manager->fertilizers.data();
		npkcalc::helper::assign_from_cpp_GetData_fertilizers(fertilizers, ferts);
	}

	virtual void GetImages(
		/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Media, npkcalc::flat::Media_Direct> images)
	{
		npkcalc::helper::assign_from_cpp_GetImages_images(images, data_manager->icons);
	}

	virtual void Subscribe(nprpc::Object* obj) {
		static int i = 0;
		observers.alarm(npkcalc::AlarmType::Info, "User #" + std::to_string(++i) + " connected");
		if (auto user = nprpc::narrow<npkcalc::DataObserver>(obj); user) {
			user->add_ref();
			user->set_timeout(250);
			observers.add(user);
		}
	}

	virtual void GetGuestCalculations(
		/*out*/::nprpc::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct> calculations) {
		npkcalc::helper::assign_from_cpp_GetMyCalculations_calculations(calculations, data_manager->get_calculations("Guest").data());
	}
};

class AuthorizatorImpl : public npkcalc::IAuthorizator_Servant {
	const std::string& data_root_dir_;
	nprpc::Poa* user_poa;

	std::mutex mut_;
	std::vector<std::unique_ptr<User>> users_db_;
	
	struct Session {
		std::string sid;
		std::string email;

		template<class Archive>
		void serialize(Archive& ar, const int file_version) {
			ar& sid;
			ar& email;
		}

		bool operator<(const Session& other) const noexcept {
			return sid < other.sid;
		}
	};
	
	std::set<Session> sessions_;

	struct NewUser {
		User user;
		std::uint32_t code;
	};

	std::mutex new_users_mut_;
	std::map<std::string, NewUser> new_users_db_;

	std::random_device rd_;

	static std::string create_uuid() {
		boost::uuids::random_generator generator;
		auto uid = generator();
		std::stringstream ss;
		for (size_t i = 0; i < 16; ++i) {
			ss << std::hex << std::setw(1) << (int)uid.data[i];
		}
		return std::move(ss.str());
	}

	static std::string sha256(std::string_view str) {
		unsigned char hash[SHA256_DIGEST_LENGTH];
		SHA256_CTX sha256;
		SHA256_Init(&sha256);
		SHA256_Update(&sha256, str.data(), str.size());
		SHA256_Final(hash, &sha256);
		return std::string((char*)hash, SHA256_DIGEST_LENGTH);
	}

	static std::string str_tolower(std::string str) {
		std::transform(std::begin(str), std::end(str), std::begin(str), [](unsigned char c) {
			return std::tolower(c);
			});
		return str;
	}

	npkcalc::UserData try_login(std::string_view user_email, std::string_view user_password) {
		if (auto it = std::find_if(users_db_.begin(), users_db_.end(),
			[user_email](const std::unique_ptr<User>& u) { return u->email == user_email; });
			it != users_db_.end())
		{
			if (!user_password.empty() && (*it)->password_sha256 != sha256(user_password)) {
				observers.alarm(npkcalc::AlarmType::Warning, "User \"" + (*it)->user_name + "\" forgot his password");
				throw npkcalc::AuthorizationFailed(npkcalc::AuthorizationFailed_Reason::incorrect_password);
			}

			auto new_user = new RegisteredUser(*(*it).get());
			auto oid = user_poa->activate_object(new_user, &nprpc::get_context());

			Session s;
			do { s.sid = create_uuid(); } while (sessions_.find(s) != sessions_.end());
			s.email = user_email;

			observers.alarm(npkcalc::AlarmType::Info, "User \"" + (*it)->user_name + "\" has logged in");

			return {(*it)->user_name, sessions_.emplace(std::move(s)).first->sid, oid};
		} else {
			throw npkcalc::AuthorizationFailed(npkcalc::AuthorizationFailed_Reason::email_does_not_exist);
		}
	}

	void load_users() noexcept {
		try {
			std::ifstream is(data_root_dir_ + "/users.txt");
			boost::archive::text_iarchive ar(is, boost::archive::no_header | boost::archive::no_tracking);
			ar >> users_db_;
		} catch (std::exception& ex) {
			std::cerr << ex.what() << '\n';
		}

		std::cout << "Users:\n";
		for (auto& user : users_db_) {
			std::cout << "{ email: " << user->email << ", user_name: " << user->user_name << " }\n";
		}
	}

	void store_users() noexcept {
		try {
			std::ofstream ofs(data_root_dir_ + "/users.txt");
			boost::archive::text_oarchive ar(ofs, boost::archive::no_header | boost::archive::no_tracking);
			ar << users_db_;
		} catch (std::exception& ex) {
			std::cerr << ex.what() << '\n';
		}
	}

	bool check_username(::nprpc::flat::Span<char> username) {
		const auto lowercase = str_tolower(username);
		return std::find_if(std::begin(users_db_), std::end(users_db_), [&lowercase](const std::unique_ptr<User>& user) {
			return lowercase == str_tolower(user->user_name);
			}) == users_db_.end();
	}

	bool check_email(::nprpc::flat::Span<char> email) {
		const auto lowercase = str_tolower(email);
		return std::find_if(std::begin(users_db_), std::end(users_db_), [&lowercase](const std::unique_ptr<User>& user) {
			return lowercase == str_tolower(user->email);
			}) == users_db_.end();
	}
public:
	virtual npkcalc::UserData LogIn(::nprpc::flat::Span<char> login, ::nprpc::flat::Span<char> password) {
		std::lock_guard<std::mutex> lk(mut_);

		auto user_email = (std::string_view)login;
		auto user_password = (std::string_view)password;

		if (user_password.empty()) {
			observers.alarm(npkcalc::AlarmType::Warning, "User is trying to log in with an empty password");
			throw npkcalc::AuthorizationFailed(npkcalc::AuthorizationFailed_Reason::incorrect_password);
		}

		return try_login(user_email, user_password);
	}

	virtual npkcalc::UserData LogInWithSessionId(::nprpc::flat::Span<char> session_id) {
		std::lock_guard<std::mutex> lk(mut_);

		auto sid = (std::string_view)session_id;
		Session s;
		s.sid.assign(sid.data(), sid.size());
		
		if (auto it = sessions_.find(s); it != sessions_.end()) {
			auto const& user_email = it->email;
			if (auto it = std::find_if(users_db_.begin(), users_db_.end(),
				[user_email](const std::unique_ptr<User>& u) { return u->email == user_email; });
				it != users_db_.end())
			{
				return try_login(user_email, {});
			}
			throw npkcalc::AuthorizationFailed(npkcalc::AuthorizationFailed_Reason::email_does_not_exist);
		}
		throw npkcalc::AuthorizationFailed(npkcalc::AuthorizationFailed_Reason::session_does_not_exist);
	}

	virtual bool LogOut(::nprpc::flat::Span<char> session_id) {
		std::lock_guard<std::mutex> lk(mut_);

		auto sid = (std::string_view)session_id;
		Session s;
		s.sid.assign(sid.data(), sid.size());
		return static_cast<bool>(sessions_.erase(s));
	}


	virtual bool CheckUsername(::nprpc::flat::Span<char> username) {
		std::lock_guard<std::mutex> lk(mut_);
		return check_username(username);
	}

	virtual bool CheckEmail(::nprpc::flat::Span<char> email) {
		std::lock_guard<std::mutex> lk(mut_);
		return check_email(email);
	}

	virtual void RegisterStepOne(::nprpc::flat::Span<char> username, ::nprpc::flat::Span<char> email, ::nprpc::flat::Span<char> password) {
		{
			std::lock_guard<std::mutex> lk(mut_);
			if (check_username(username) == false)
				throw npkcalc::RegistrationFailed(npkcalc::RegistrationFailed_Reason::username_already_exist);
			if (check_email(email) == false)
				throw npkcalc::RegistrationFailed(npkcalc::RegistrationFailed_Reason::email_already_registered);
		}
		
		NewUser user;
		
		user.user.email = email;
		user.user.password_sha256 = sha256(password);
		user.user.user_name = username;
		std::uniform_int_distribution<std::uint32_t> dist(10000, 99999);
		user.code = dist(rd_);

		//std::cerr << "Code: " << user.code << '\n';

		observers.alarm(npkcalc::AlarmType::Info, "Dear " + user.user.user_name + ", here is your confirmation code: " + std::to_string(user.code));

		{
			std::lock_guard<std::mutex> lk(new_users_mut_);
			new_users_db_.emplace(user.user.user_name, std::move(user));
		}
	}

	virtual void RegisterStepTwo(::nprpc::flat::Span<char> username, uint32_t code) {
		std::lock_guard<std::mutex> lk(new_users_mut_);
		if (auto it = new_users_db_.find((std::string)username); it != new_users_db_.end()) {
			if (it->second.code != code)
				throw npkcalc::RegistrationFailed(npkcalc::RegistrationFailed_Reason::incorrect_code);

			observers.alarm(npkcalc::AlarmType::Info, "New user '" + it->first + "' has been registered");

			{
				std::lock_guard<std::mutex> lk(mut_);
				users_db_.push_back(std::make_unique<User>(std::move(it->second.user)));
				store_users();
			}
			new_users_db_.erase(it);
		} else {
			throw npkcalc::RegistrationFailed(npkcalc::RegistrationFailed_Reason::invalid_username);
		}
	}

	AuthorizatorImpl(nprpc::Rpc& rpc, const std::string& data_root_dir)
		: data_root_dir_(data_root_dir)
	{
		load_users();
		auto policy = std::make_unique<nprpc::Policy_Lifespan>(nprpc::Policy_Lifespan::Transient);
		user_poa = rpc.create_poa(1024, {policy.get()});
	}
};

struct HostJson {
	bool secured;

	struct {
		nprpc::ObjectId calculator;
		nprpc::ObjectId authorizator;
		nprpc::ObjectId chat;

		template<typename Archive>
		void serialize(Archive& ar) {
			ar & NVP(calculator);
			ar & NVP(authorizator);
			ar & NVP(chat);
		}
	} objects;

	template<typename Archive>
	void serialize(Archive& ar) {
		ar & NVP(secured);
		ar & NVP(objects);
	}
};


int main(int argc, char* argv[]) {
	namespace po = boost::program_options;
	namespace fs = std::filesystem;

	HostJson host_json;

	std::string hostname, http_root, data_root, public_key, private_key, dh_params;
	unsigned short port;
	bool use_ssl;

	po::options_description desc("Allowed options");
	desc.add_options()
		("help", "produce help message")
		("hostname", po::value<std::string>(&hostname)->default_value(""), "Hostname")
		("root_dir", po::value<std::string>(&http_root)->
			default_value("\\\\wsl$\\Debian\\home\\png\\projects\\npk-calculator\\client\\public"), "HTTP root directory")
		("data_dir", po::value<std::string>(&data_root)->default_value("./data"), "Data root directory")
		("port", po::value<unsigned short>(&port)->default_value(8080), "Port to listen")
		("use_ssl", po::value<bool>(&use_ssl)->default_value(false), "Use SSL")
		("public_key", po::value<std::string>(&public_key)->default_value(""), "Path to public key")
		("private_key", po::value<std::string>(&private_key)->default_value(""), "Path to private key")
		("dh_params", po::value<std::string>(&dh_params)->default_value(""), "Path to Diffie-Hellman parameters")
		;

	try {
		po::variables_map vm;
		po::store(po::command_line_parser(argc, argv).options(desc).run(), vm);
		po::notify(vm);
		if (vm.count("help")) {
			std::cout << desc << "\n";
			return 0;
		}
	} catch (po::unknown_option& e) {
		std::cerr << e.what();
		return -1;
	}

	try {
		nprpc::Config rpc_cfg;
		rpc_cfg.debug_level = nprpc::DebugLevel::DebugLevel_Critical;
		rpc_cfg.port = 52244;
		rpc_cfg.websocket_port = port;
		rpc_cfg.http_root_dir = http_root;
		rpc_cfg.use_ssl = use_ssl;
		rpc_cfg.ssl_public_key = public_key;
		rpc_cfg.ssl_secret_key = private_key;
		rpc_cfg.ssl_dh_params = dh_params;
		rpc_cfg.hostname = hostname;

		auto rpc = nprpc::init(thread_pool::get_instance().ctx(), std::move(rpc_cfg));

		// static poa
		auto policy = std::make_unique<nprpc::Policy_Lifespan>(nprpc::Policy_Lifespan::Persistent);
		auto poa = rpc->create_poa(3, {policy.get()});

		CalculatorImpl calc{data_root};
		AuthorizatorImpl autorizator(*rpc, data_root);
		ChatImpl chat;

		// Capture SIGINT and SIGTERM to perform a clean shutdown
		boost::asio::signal_set signals(thread_pool::get_instance().ctx(), SIGINT, SIGTERM);
		signals.async_wait([&](boost::beast::error_code const&, int) {
			thread_pool::get_instance().stop();
		});

		host_json.secured = use_ssl;
		host_json.objects.calculator = poa->activate_object(&calc);
		host_json.objects.authorizator = poa->activate_object(&autorizator);
		host_json.objects.chat = poa->activate_object(&chat);

		std::cout << "calculator  - poa: " << calc.poa_index() << ", oid: " << calc.oid() << "\n";
		std::cout << "autorizator - poa: " << autorizator.poa_index() << ", oid: " << autorizator.oid() << "\n";
		std::cout << "chat - poa: " << chat.poa_index() << ", oid: " << chat.oid() << "\n";
		std::cout.flush();

		{
			std::ofstream os(std::filesystem::path(http_root) / "host.json");
			nprpc::serialization::json_oarchive oa(os);
			oa << host_json;
		}
	
		thread_pool::get_instance().ctx().run();
		rpc->destroy();

	} catch (std::exception& ex) {
		std::cerr << ex.what();
		return EXIT_FAILURE;
	}

	std::cout << "calculator is shutting down..." << std::endl;

	return EXIT_SUCCESS;
}