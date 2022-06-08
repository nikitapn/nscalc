// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

#include <iostream>
#include <string>
#include <concepts>
#include <cassert>
#include <filesystem>
#include <set>
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

using thread_pool = nplib::thread_pool<3>;


class Observers {
	boost::asio::io_context ioc_;
	boost::asio::executor_work_guard<boost::asio::io_context::executor_type> work_guard_;

	uint32_t alarm_id_ = 0;
	std::vector<std::unique_ptr<npkcalc::DataObserver>> observers;
	std::vector<std::unique_ptr<npkcalc::ChatListener>> chat_listeners;

	npkcalc::Alarm make_alarm(npkcalc::AlarmType type, const std::string& msg) {
		return { alarm_id_++, type, msg };
	}

	void add_impl(npkcalc::DataObserver* user) {
		observers.emplace_back(user);
	}

	void add_chat_listener_impl(npkcalc::ChatListener* listener) {
		chat_listeners.emplace_back(listener);
	}

	template<typename T, typename... Args>
	void broadcast(T fn, const Args&... args) {
		for (auto it = std::begin(observers); it != observers.end(); ) {
			try {
				std::mem_fn(fn)(*it, args...);
				it = std::next(it);
			} catch (nprpc::Exception&) {
				it = observers.erase(it);
			}
		}
	}

	void alarm_impl(npkcalc::AlarmType type, std::string msg) {
		broadcast(&npkcalc::DataObserver::OnAlarm, make_alarm(type, msg));
	}
public:
	void add(npkcalc::DataObserver* user) {
		nplib::async<false>(ioc_, &Observers::add_impl, this, user);
	}

	void add(npkcalc::ChatListener* listener) {
		nplib::async<false>(ioc_, &Observers::add_chat_listener_impl, this, listener);
	}

	void alarm(npkcalc::AlarmType type, std::string&& msg) {
		nplib::async<false>(ioc_, &Observers::alarm_impl, this, type, msg);
	}

	void stop() { ioc_.stop(); }

	Observers() : work_guard_(boost::asio::make_work_guard(ioc_)) {
		std::thread([this]() { ioc_.run(); }).detach();
	}
} observers;


class Chat {
	boost::asio::io_context ioc_;
	boost::asio::executor_work_guard<boost::asio::io_context::executor_type> work_guard_;

	std::vector<std::unique_ptr<npkcalc::ChatListener>> chat_listeners;

	void add_impl(npkcalc::ChatListener* listener) {
		chat_listeners.emplace_back(listener);
	}
	
	void send_impl(npkcalc::ChatMessage msg) {
		broadcast(&npkcalc::ChatListener::OnMessage, std::ref(msg));
	}

	template<typename T, typename... Args>
	void broadcast(T fn, const Args&... args) {
		for (auto it = std::begin(chat_listeners); it != chat_listeners.end(); ) {
			try {
				std::mem_fn(fn)(*it, args...);
				it = std::next(it);
			} catch (nprpc::Exception&) {
				it = chat_listeners.erase(it);
			}
		}
	}
public:
	void add(npkcalc::ChatListener* listener) {
		nplib::async<false>(ioc_, &Chat::add_impl, this, listener);
	}

	void send(npkcalc::ChatMessage&& msg) {
		nplib::async<false>(ioc_, &Chat::send_impl, this, std::move(msg));
	}

	void stop() { ioc_.stop(); }

	Chat() : work_guard_(boost::asio::make_work_guard(ioc_)) {
		std::thread([this]() { ioc_.run(); }).detach();
	}
} chat_room;

enum class Tables {
	Solutions,
	Fertilizers
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

class ChatImpl 
	: public npkcalc::IChat_Servant {
public:
	virtual void Connect(nprpc::Object* obj) {
		auto listener = nprpc::narrow<npkcalc::ChatListener>(obj);
		if (listener) {
			listener->add_ref();
			listener->set_timeout(250);
			chat_room.add(listener);
		}
	}
	virtual bool Send(npkcalc::flat::ChatMessage_Direct msg) {
		chat_room.send(npkcalc::ChatMessage{ msg.date(), (std::string)msg.str() });
		return true;
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
public:
	const User& user_data() const noexcept {
		return user_data_;
	}

	virtual void GetMyCalculations(
		/*out*/::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct> calculations) {
		npkcalc::helper::assign_from_cpp_GetMyCalculations_calculations(calculations, this->calculations.data());
	}

	virtual uint32_t AddSolution(::flat::Span<char> name, ::flat::Span<double> elements) {
		solutions_changed = true;
		std::lock_guard<std::mutex> lk(data_manager->mut_solutions);
		auto s = data_manager->solutions.create();
		s->name = name;
		s->owner = user_data_.user_name;
		std::transform(elements.begin(), elements.end(), s->elements.begin(), [](auto x) { return x; });

		observers.alarm(npkcalc::AlarmType::Info, user_data().user_name + " added solution \"" + s->name + "\"");

		return s->id;
	}

	virtual void SetSolutionName(uint32_t id, ::flat::Span<char> name) {
		solutions_changed = true;
		std::lock_guard<std::mutex> lk(data_manager->mut_solutions);
		if (auto item = data_manager->solutions.get_by_id(id); item) {
			item->name = (std::string_view)name;
		}
	}

	virtual void SetSolutionElements(uint32_t id, ::flat::Span_ref<npkcalc::flat::SolutionElement, npkcalc::flat::SolutionElement_Direct> name) {
		solutions_changed = true;
		std::lock_guard<std::mutex> lk(data_manager->mut_solutions);
		if (auto s = data_manager->solutions.get_by_id(id); s) {
			for (auto e : name) {
				if (e.index() >= 14) continue;
				s->elements[e.index()] = e.value();
			}
		}
	}

	virtual void DeleteSolution(uint32_t id) {
		solutions_changed = true;
		std::string name;
		bool deleted = false;
		{
			std::lock_guard<std::mutex> lk(data_manager->mut_solutions);
			if (auto s = data_manager->solutions.get_by_id(id); s) {
				name = std::move(s->name);
				data_manager->solutions.remove_by_id(id);
				deleted = true;
			}
		}
		if (deleted)
			observers.alarm(npkcalc::AlarmType::Critical, user_data().user_name + " deleted solution \"" + name + "\"");
	}

	virtual uint32_t AddFertilizer(::flat::Span<char> name, ::flat::Span<char> formula) {
		fertilizers_changed = true;
		std::lock_guard<std::mutex> lk(data_manager->mut_fertilizers);
		auto f = data_manager->fertilizers.create();
		f->name = name;
		f->owner = user_data_.user_name;
		f->formula = formula;
		return f->id;
	}

	virtual void SetFertilizerName(uint32_t id, ::flat::Span<char> name) {
		fertilizers_changed = true;
		std::lock_guard<std::mutex> lk(data_manager->mut_fertilizers);
		if (auto item = data_manager->fertilizers.get_by_id(id); item) {
			item->name = (std::string_view)name;
		} else {
			std::cerr << "fertilizer with id = " << id << " was not found..\n";
		}
	}

	virtual void SetFertilizerFormula(uint32_t id, ::flat::Span<char> name) {
		fertilizers_changed = true;
		std::lock_guard<std::mutex> lk(data_manager->mut_fertilizers);
		if (auto item = data_manager->fertilizers.get_by_id(id); item) {
			item->formula = name;
		} else {
			std::cerr << "fertilizer with id = " << id << " was not found..\n";
		}
	}

	virtual void DeleteFertilizer(uint32_t id) {
		fertilizers_changed = true;
		std::lock_guard<std::mutex> lk(data_manager->mut_fertilizers);
		data_manager->fertilizers.remove_by_id(id);
	}

	virtual void SaveData() {
		// std::cerr << "SaveData() solutions_changed: " << solutions_changed << ", fertilizers_changed: " << fertilizers_changed << '\n';

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

	~RegisteredUser() {
		// std::cerr << "~RegisteredUser()\n";
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
		/*out*/::flat::Vector_Direct2<npkcalc::flat::Solution, npkcalc::flat::Solution_Direct> solutions,
		/*out*/::flat::Vector_Direct2<npkcalc::flat::Fertilizer, npkcalc::flat::Fertilizer_Direct> fertilizers)
	{
		const auto& sols = data_manager->solutions.data();
		npkcalc::helper::assign_from_cpp_GetData_solutions(solutions, sols);

		const auto& ferts = data_manager->fertilizers.data();
		npkcalc::helper::assign_from_cpp_GetData_fertilizers(fertilizers, ferts);
	}

	virtual void GetImages(
		/*out*/::flat::Vector_Direct2<npkcalc::flat::Media, npkcalc::flat::Media_Direct> images)
	{
		npkcalc::helper::assign_from_cpp_GetImages_images(images, data_manager->icons);
	}

	virtual void Subscribe(nprpc::Object* obj) {
		static int i = 0;
		observers.alarm(npkcalc::AlarmType::Info, "User #" + std::to_string(++i) + " connected");
		auto user = nprpc::narrow<npkcalc::DataObserver>(obj);
		if (user) {
			user->add_ref();
			user->set_timeout(250);
			observers.add(user);
		}
	}
	virtual void GetGuestCalculations(
		/*out*/::flat::Vector_Direct2<npkcalc::flat::Calculation, npkcalc::flat::Calculation_Direct> calculations) {
		npkcalc::helper::assign_from_cpp_GetMyCalculations_calculations(calculations, data_manager->get_calculations("Guest").data());
	}
};

class AuthorizatorImpl : public npkcalc::IAuthorizator_Servant {
	const std::string& data_root_dir_;

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

	nprpc::Poa* user_poa;
	std::vector<std::unique_ptr<User>> users_db_;
	std::set<Session> sessions_;

	std::string create_uuid() {
		boost::uuids::random_generator generator;
		auto uid = generator();
		std::stringstream ss;
		for (size_t i = 0; i < 16; ++i) {
			ss << std::hex << std::setw(1) << (int)uid.data[i];
		}
		return std::move(ss.str());
	}

	std::string sha256(std::string_view str) {
		unsigned char hash[SHA256_DIGEST_LENGTH];
		SHA256_CTX sha256;
		SHA256_Init(&sha256);
		SHA256_Update(&sha256, str.data(), str.size());
		SHA256_Final(hash, &sha256);
		return std::string((char*)hash, SHA256_DIGEST_LENGTH);
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
			auto oid = user_poa->activate_object(new_user);

			Session s;
			do { s.sid = create_uuid(); } while (sessions_.find(s) != sessions_.end());
			s.email = user_email;

			observers.alarm(npkcalc::AlarmType::Info, "User \"" + (*it)->user_name + "\" has logged in");

			return {(*it)->user_name, sessions_.emplace(std::move(s)).first->sid, oid};
		} else {
			throw npkcalc::AuthorizationFailed(npkcalc::AuthorizationFailed_Reason::email_does_not_exist);
		}
	}
public:
	virtual npkcalc::UserData LogIn(::flat::Span<char> login, ::flat::Span<char> password) {
		auto user_email = (std::string_view)login;
		auto user_password = (std::string_view)password;

		//std::cout << user_email << " " << user_password << std::endl;

		if (user_password.empty()) {
			observers.alarm(npkcalc::AlarmType::Warning, "User is trying to log in with an empty password");
			throw npkcalc::AuthorizationFailed(npkcalc::AuthorizationFailed_Reason::incorrect_password);
		}

		return try_login(user_email, user_password);
	}

	virtual npkcalc::UserData LogInWithSessionId(::flat::Span<char> session_id) {
		auto sid = (std::string_view)session_id;
		//std::cerr << "LogInWithSessionId(" << sid << ");\n";
		thread_local static Session s;
		s.sid.reserve(sid.size());
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

	virtual bool LogOut(::flat::Span<char> session_id) {
		auto sid = (std::string_view)session_id;
		//std::cerr << "LogOut(" << sid << ");\n";
		thread_local static Session s;
		s.sid.reserve(sid.size());
		s.sid.assign(sid.data(), sid.size());
		return static_cast<bool>(sessions_.erase(s));
	}

	void load_users() noexcept {
		//store_users();
		try {
			std::ifstream is(data_root_dir_ + "/users.txt");
			boost::archive::text_iarchive ar(is, boost::archive::no_header | boost::archive::no_tracking);
			ar >> users_db_;
		} catch (std::exception& ex) {
			std::cerr << ex.what() << '\n';
		}

		//		try {
		//			std::ifstream is(data_root_dir_ + "/sessions.txt");
		//			boost::archive::text_iarchive ar(is, boost::archive::no_header | boost::archive::no_tracking);
		//			ar >> sessions_;
		//		} catch (std::exception& ex) {
		//			std::cerr << ex.what() << '\n';
		//		}

		std::cout << "Users:\n";
		for (auto& user : users_db_) {
			std::cout << "{ email: " << user->email << ", user_name: " << user->user_name << " }\n";
		}
	}

	void store_users() noexcept {
		//users_db_.emplace_back(std::make_unique<User>("admin@npkcalc.com", sha256("1"), "Admin"));
		try {
			std::ofstream ofs(data_root_dir_ + "/users.txt");
			boost::archive::text_oarchive ar(ofs, boost::archive::no_header | boost::archive::no_tracking);
			ar << users_db_;
		} catch (std::exception& ex) {
			std::cerr << ex.what() << '\n';
		}
		//		try {
		//			std::ofstream ofs(data_root_dir_ + "/sessions.txt");
		//			boost::archive::text_oarchive ar(ofs, boost::archive::no_header | boost::archive::no_tracking);
		//			ar << sessions_;
		//		} catch (std::exception& ex) {
		//			std::cerr << ex.what() << '\n';
		//		}
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
			ar& NVP(calculator);
			ar& NVP(authorizator);
			ar& NVP(chat);
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

	host_json.secured = use_ssl;

	// Capture SIGINT and SIGTERM to perform a clean shutdown
	boost::asio::signal_set signals(thread_pool::get_instance().ctx(), SIGINT, SIGTERM);
	signals.async_wait([&](boost::beast::error_code const&, int) { 
		observers.stop();
		chat_room.stop();
		thread_pool::get_instance().stop(); 
	});
	
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
		std::thread([] {
			using namespace std::chrono_literals;
			while (1) {
				static int i = 0;
				chat_room.send(npkcalc::ChatMessage{ 32432, "msg:" + std::to_string(i++) });
				std::this_thread::sleep_for(1s);
			}
			}).detach();
		
		rpc->start();
		thread_pool::get_instance().ctx().run();
		rpc->destroy();
	} catch (std::exception& ex) {
		std::cerr << ex.what();
		return EXIT_FAILURE;
	}

	std::cout << "calculator is shutting down..." << std::endl;

	return EXIT_SUCCESS;
}