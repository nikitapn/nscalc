@echo off

set BOOST_DIR=C:\opt\boost_1_88_0
set OPENSSL_DIR=C:\Program Files\OpenSSL

cmake -S . -B .build_local\win -G "Visual Studio 17 2022"
