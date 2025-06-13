// Copyright (C) 2016 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR BSD-3-Clause

#include <QApplication>
#include <QMessageBox>

#include "MainWindow.hpp"
#include "socks5.hpp"
#include "util.hpp"

nprpc::Rpc* rpc_instance = nullptr;

std::unique_ptr<Proxy> Proxy::create()
{
  assert(rpc_instance);
  return std::make_unique<Proxy>(*rpc_instance);
}

void init_rpc() {
  // Initialize NPRPC
  rpc_instance = nprpc::RpcBuilder()
    .set_debug_level(nprpc::DebugLevel::DebugLevel_Critical)
    .build(thpool::get_instance().ctx());
}

int main(int argc, char* argv[])
{
  init_rpc();

  QApplication app(argc, argv);

  if (!QSystemTrayIcon::isSystemTrayAvailable()) {
    auto choice = QMessageBox::critical(nullptr, QObject::tr("Systray"),
      QObject::tr("I couldn't detect any system tray on this system."),
      QMessageBox::Close | QMessageBox::Ignore);
    if (choice == QMessageBox::Close)
      return 1;
  }
  QApplication::setQuitOnLastWindowClosed(false);

  Window window;
  window.show();
  auto qt_exit_code = app.exec();
  
  // Delete proxy object
  window.dispose();
  // Stop the thread pool
  thpool::get_instance().stop();
  if (rpc_instance) {
    rpc_instance->destroy();
  }
  return qt_exit_code;
}
