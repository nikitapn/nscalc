
find_package(Qt6 COMPONENTS Core Gui Widgets REQUIRED)
qt_standard_project_setup()

set(SOURCES
  ${proxy_stub_GENERATED_HEADERS}
  ${proxy_stub_GENERATED_SOURCES}
  src/main.cpp
  src/MainWindow.hpp
  src/MainWindow.cpp
  src/socks5.hpp
  src/socks5.cpp
)

qt_add_resources(SOURCES src/systray.qrc)
qt_add_executable(proxy_client ${SOURCES})

target_include_directories(proxy_client PRIVATE
  ${proxy_stub_INCLUDE_DIR}
)

set_target_properties(proxy_client PROPERTIES
  WIN32_EXECUTABLE TRUE
  MACOSX_BUNDLE TRUE
)

target_link_libraries(proxy_client PRIVATE 
  Qt6::Core
  Qt6::Gui
  Qt6::Widgets
  nprpc
)

add_dependencies(proxy_client proxy_stub_gen)

# Installation and packaging setup
set(INSTALL_PREFIX "${CMAKE_BINARY_DIR}/install")

# Install the executable
install(TARGETS proxy_client
  RUNTIME DESTINATION bin
  BUNDLE DESTINATION .
  LIBRARY DESTINATION lib
)

# Platform-specific deployment
if(WIN32)
  # Find Qt6 deployment tool
  find_program(QT_DEPLOY_EXECUTABLE windeployqt HINTS ${QT6_INSTALL_PREFIX}/bin)
  
  if(QT_DEPLOY_EXECUTABLE)
    # Add custom target for Windows deployment
    add_custom_target(deploy_proxy_client
      COMMAND ${CMAKE_COMMAND} --install ${CMAKE_BINARY_DIR} --prefix ${INSTALL_PREFIX}
      COMMAND ${QT_DEPLOY_EXECUTABLE} --verbose 2 --no-compiler-runtime --no-opengl-sw 
              "${INSTALL_PREFIX}/bin/proxy_client.exe"
      DEPENDS proxy_client
      COMMENT "Deploying Qt libraries and creating distributable package"
    )
  endif()
  
elseif(APPLE)
  # Find Qt6 deployment tool for macOS
  find_program(QT_DEPLOY_EXECUTABLE macdeployqt HINTS ${QT6_INSTALL_PREFIX}/bin)
  
  if(QT_DEPLOY_EXECUTABLE)
    add_custom_target(deploy_proxy_client
      COMMAND ${CMAKE_COMMAND} --install ${CMAKE_BINARY_DIR} --prefix ${INSTALL_PREFIX}
      COMMAND ${QT_DEPLOY_EXECUTABLE} "${INSTALL_PREFIX}/proxy_client.app" -verbose=2
      DEPENDS proxy_client
      COMMENT "Creating macOS app bundle with Qt libraries"
    )
  endif()
  
elseif(UNIX)
  # For Linux, we'll create a simple packaging script
  add_custom_target(deploy_proxy_client
    COMMAND ${CMAKE_COMMAND} --install ${CMAKE_BINARY_DIR} --prefix ${INSTALL_PREFIX}
    COMMAND ${CMAKE_COMMAND} -E copy_directory ${CMAKE_CURRENT_SOURCE_DIR}/deploy/linux ${INSTALL_PREFIX}
    DEPENDS proxy_client
    COMMENT "Installing proxy_client for Linux distribution"
  )
endif()

# CPack configuration for creating installers
set(CPACK_PACKAGE_NAME "NSCalc Proxy Client")
set(CPACK_PACKAGE_VERSION "1.0.0")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "SOCKS5 Proxy Client for NSCalc")
set(CPACK_PACKAGE_VENDOR "NSCalc Project")

if(WIN32)
  set(CPACK_GENERATOR "NSIS;ZIP")
  set(CPACK_NSIS_DISPLAY_NAME "NSCalc Proxy Client")
  set(CPACK_NSIS_PACKAGE_NAME "NSCalc Proxy Client")
  set(CPACK_NSIS_CONTACT "nikitapnn1@gmail.com")
elseif(APPLE)
  set(CPACK_GENERATOR "DragNDrop")
elseif(UNIX)
  set(CPACK_GENERATOR "TGZ;DEB")
  set(CPACK_DEBIAN_PACKAGE_MAINTAINER "nikitapnn1@gmail.com")
  set(CPACK_DEBIAN_PACKAGE_DEPENDS "libc6, libqt6core6, libqt6gui6, libqt6widgets6")
endif()

include(CPack)

