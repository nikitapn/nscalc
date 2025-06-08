// Copyright (C) 2016 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR BSD-3-Clause

#include <QApplication>

#include "socks5.hpp"

#define QT_NO_SYSTEMTRAYICON

#ifndef QT_NO_SYSTEMTRAYICON

#include <QMessageBox>
#include "MainWindow.hpp"

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);

  if (!QSystemTrayIcon::isSystemTrayAvailable()) {
    auto choice = QMessageBox::critical(nullptr, QObject::tr("Systray"),
      QObject::tr("I couldn't detect any system tray on this system."),
      QMessageBox::Close | QMessageBox::Ignore);
    if (choice == QMessageBox::Close)
      return 1;
    // Otherwise "lurk": if a system tray is started later, the icon will appear.
  }
  QApplication::setQuitOnLastWindowClosed(false);

  Window window;
  window.show();
  return app.exec();
}

#else

#include <QLabel>
#include <QDebug>

int main(int argc, char* argv[])
{
  QApplication app(argc, argv);
  QString text("QSystemTrayIcon is not supported on this platform");

  QLabel* label = new QLabel(text);
  label->setWordWrap(true);

  label->show();
  label->resize(400, 100);
  qDebug() << text;

  auto proxy = std::make_unique<Proxy>("127.0.0.1", "8080", "password");

  app.exec();
}

#endif