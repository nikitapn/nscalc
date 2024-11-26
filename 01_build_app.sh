#!/bin/env bash

set -e

BUILD_DIR=.build
ROOT_DIR=$(dirname $(readlink -e ${BASH_SOURCE[0]}))

cd $ROOT_DIR

docker run --rm \
  -v $ROOT_DIR:/app \
  -v $(readlink -f server/external/npsystem):/app/server/external/npsystem \
  -w /app cpp-dev-env:latest \
  cmake -B $BUILD_DIR -S server/ -DBOOST_LIB_PREFIX=/usr/local/lib

docker run --rm \
  -v $ROOT_DIR:/app \
  -v $(readlink -f server/external/npsystem):/app/server/external/npsystem \
  -w /app cpp-dev-env:latest \
  cmake --build $BUILD_DIR
