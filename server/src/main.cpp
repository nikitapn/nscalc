// Copyright (c) 2022 nikitapnn1@gmail.com
// This file is a part of Nikita's NPK calculator and covered by LICENSING file in the topmost directory

#include <exception>
#include <iostream>
#include <cassert>
#include <string>
#include <fstream>
#include <filesystem>
#include <boost/asio/signal_set.hpp>
#include <boost/beast/core/error.hpp>
#include <boost/program_options.hpp>
#include <nprpc/serialization/oarchive.h>
#include "services/db/UserService.hpp"
#include "util/thread_pool.hpp"
#include "services/boost/di.hpp"
#include "services/db/Database.hpp"
#include "services/db/SolutionService.hpp"
#include "services/db/FertilizerService.hpp"
#include "services/db/CalculationService.hpp"
#include "services/objects/Calculator.hpp"
#include "services/objects/Authorizator.hpp"
#include "services/objects/Chat.hpp"

struct HostJson {
  bool secured;

  struct {
    nprpc::ObjectId calculator;
    nprpc::ObjectId authorizator;
    nprpc::ObjectId chat;

    template <typename Archive>
    void serialize(Archive& ar) {
      ar & NVP(calculator);
      ar & NVP(authorizator);
      ar & NVP(chat);
    }
  } objects;

  template <typename Archive>
  void serialize(Archive& ar) {
    ar & NVP(secured);
    ar & NVP(objects);
  }
};

int main(int argc, char *argv[]) {
  auto toHex = [](std::string_view str) {
    std::string result;
    for (auto c : str) {
      auto b = (unsigned char)c;
      result += "0123456789ABCDEF"[b >> 4];
      result += "0123456789ABCDEF"[b & 0x0F];
    }
    return result;
  };

  std::cout << toHex(UserService::sha256("1234")) << std::endl;
  namespace di = boost::di;
  namespace po = boost::program_options;
  namespace fs = std::filesystem;

  HostJson host_json;
  std::string hostname, http_dir, data_dir, public_key, private_key, dh_params;
  unsigned short port;
  bool use_ssl;

  po::options_description desc("Allowed options");
  desc.add_options()
    ("help", "produce help message")
    ("http-dir", po::value<std::string>(&http_dir)->required(), "HTTP root directory")
    ("data-dir", po::value<std::string>(&data_dir)->required(), "Data root directory")
    ("hostname", po::value<std::string>(&hostname)->default_value(""), "Hostname")
    ("port", po::value<unsigned short>(&port)->default_value(8080), "Port to listen")
    ("use-ssl", po::value<bool>(&use_ssl)->default_value(false), "Enable SSL")
    ("public-key", po::value<std::string>(&public_key)->default_value(""), "Path to public key")
    ("private-key", po::value<std::string>(&private_key)->default_value(""), "Path to private key")
    ("dh-params", po::value<std::string>(&dh_params)->default_value(""), "Path to Diffie-Hellman parameters");

  try {
    po::variables_map vm;
    po::store(po::command_line_parser(argc, argv).options(desc).run(), vm);
    if (vm.count("help")) {
      std::cout << desc << "\n";
      return 0;
    }
    po::notify(vm);
  } catch (std::exception& e) {
    std::cerr << e.what() << '\n';
    return -1;
  }

  try {
    nprpc::Config rpc_cfg;
    rpc_cfg.debug_level = nprpc::DebugLevel::DebugLevel_Critical;
    rpc_cfg.port = 0;
    rpc_cfg.websocket_port = port;
    rpc_cfg.http_root_dir = http_dir;
    rpc_cfg.use_ssl = use_ssl;
    rpc_cfg.ssl_public_key = public_key;
    rpc_cfg.ssl_secret_key = private_key;
    rpc_cfg.ssl_dh_params = dh_params;
    rpc_cfg.hostname = hostname;
    rpc_cfg.spa_links = { "/calculator", "/solutions", "/fertilizers", "/links", "/chat", "/about" };

    auto rpc = nprpc::init(thread_pool::get_instance().ctx(), std::move(rpc_cfg));

    auto firstInjector = [&] () { return di::make_injector(
      di::bind<>().to(*rpc),
      di::bind<Database>().in(di::singleton).to<Database>(
        (fs::canonical(fs::path(data_dir)) / "nscalc.db").generic_string()
      ),
      di::bind<DataObservers>().in(di::singleton).to<DataObservers>()
    );};

    auto injector = firstInjector();

    auto solutionService = injector.create<std::shared_ptr<SolutionService>>();
    auto fertilizerService = injector.create<std::shared_ptr<FertilizerService>>();
    auto calculationService = injector.create<std::shared_ptr<CalculationService>>();
    auto userService = injector.create<std::shared_ptr<UserService>>();

    auto injector2 = di::make_injector(
      firstInjector(),
      di::bind<>().to(solutionService),
      di::bind<>().to(fertilizerService),
      di::bind<>().to(calculationService),
      di::bind<>().to(userService)
    );

    // static poa
    auto policy = std::make_unique<nprpc::Policy_Lifespan>(nprpc::Policy_Lifespan::Persistent);
    auto poa = rpc->create_poa(3, {policy.get()});

    auto calc = injector2.create<std::shared_ptr<CalculatorImpl>>();
    auto authorizator = injector2.create<std::shared_ptr<AuthorizatorImpl>>();
    auto chat = injector2.create<std::shared_ptr<ChatImpl>>();

    // Capture SIGINT and SIGTERM to perform a clean shutdown
    boost::asio::signal_set signals(thread_pool::get_instance().ctx(), SIGINT, SIGTERM);
    signals.async_wait([&](boost::beast::error_code const&, int) {
      thread_pool::get_instance().ctx().stop();
    });

    host_json.secured = use_ssl;
    host_json.objects.calculator = poa->activate_object(calc.get());
    host_json.objects.authorizator = poa->activate_object(authorizator.get());
    host_json.objects.chat = poa->activate_object(chat.get());

    std::cout << "calculator  - poa: " << calc->poa_index() << ", oid: " << calc->oid() << "\n";
    std::cout << "authorizator - poa: " << authorizator->poa_index() << ", oid: " << authorizator->oid() << "\n";
    std::cout << "chat - poa: " << chat->poa_index() << ", oid: " << chat->oid() << "\n";
    std::cout.flush();

    {
      std::ofstream os(fs::path(http_dir) / "host.json");
      nprpc::serialization::json_oarchive oa(os);
      oa << host_json;
    }

    thread_pool::get_instance().ctx().run();
    thread_pool::get_instance().stop();
    rpc->destroy();

  } catch (std::exception& ex) {
    std::cerr << ex.what() << '\n';
    return EXIT_FAILURE;
  }

  std::cout << "calculator is shutting down..." << std::endl;

  return EXIT_SUCCESS;
}