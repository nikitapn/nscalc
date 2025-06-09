@echo off


set BOOST_DIR=C:\opt\boost_1_88_0

cmake -S . -B .build_local\win ^
  -G "Visual Studio 17 2022" ^
  -DCMAKE_BUILD_TYPE=Debug ^
  -DOPT_BOOST_INCLUDE_DIR="C:\opt\boost_1_88_0" ^
  -DOPT_BOOST_LIB_DIR="C:\opt\boost_1_88_0\stage_x64\lib"


