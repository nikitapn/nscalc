
// Copyright (C) 2016 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR BSD-3-Clause

#pragma once

#include "socks5.hpp"

#include <memory>

#include <QSystemTrayIcon>

#ifndef QT_NO_SYSTEMTRAYICON

#include <QDialog>

QT_BEGIN_NAMESPACE
class QAction;
class QCheckBox;
class QComboBox;
class QGroupBox;
class QLabel;
class QLineEdit;
class QMenu;
class QPushButton;
class QSpinBox;
class QTextEdit;
class QGridLayout;
class QFrame;
QT_END_NAMESPACE

//! [0]
class Window : public QDialog
{
  Q_OBJECT

public:
  Window();

  void setVisible(bool visible) override;
  void dispose();

protected:
  void closeEvent(QCloseEvent* event) override;

private slots:
  void iconActivated(QSystemTrayIcon::ActivationReason reason);
  void onButtonConnectClicked();

private:
  void createMainGroupBox();
  void createActions();
  void createTrayIcon();
  void updateStatusIndicator(ProxyStatus status);
  void updatePasswordField();
  void onEditConfigToggled(bool enabled);

  void onProxyStatusChanged(ProxyStatus status);

  QGroupBox* configGroupBox;
  QCheckBox* editConfigCheckBox;
  
  // Configuration fields
  QLineEdit* hostnameEdit;
  QLineEdit* portEdit;
  QLineEdit* loginEdit;
  QLineEdit* passwordEdit;
  
  // Status indicator
  QFrame* statusIndicator;
  QLabel* statusLabel;
  
  QPushButton* connectButton;

  QAction* minimizeAction;
  QAction* maximizeAction;
  QAction* restoreAction;
  QAction* quitAction;

  QSystemTrayIcon* trayIcon;
  QMenu* trayIconMenu;

  std::unique_ptr<Proxy> proxy_;
  ProxyStatus currentStatus_;
  QString actualPassword_;
};
//! [0]

#endif // QT_NO_SYSTEMTRAYICON
