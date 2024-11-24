#!/bin/env bash

BUILD_DIR=.build

docker run --rm \
  -v $(pwd):/app \
  -v $(readlink -f server/external/npsystem):/app/server/external/npsystem \
  -w /app cpp-dev-env:latest \
  cmake -B $BUILD_DIR -S server/ -DBOOST_LIB_PREFIX=/usr/local/lib

docker run --rm \
  -v $(pwd):/app \
  -v $(readlink -f server/external/npsystem):/app/server/external/npsystem \
  -w /app cpp-dev-env:latest \
  cmake --build $BUILD_DIR
