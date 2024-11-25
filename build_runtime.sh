#!/bin/env bash

BUILD_DIR=.build
ROOT_DIR=$(dirname $(readlink -e ${BASH_SOURCE[0]}))

cd $ROOT_DIR
mkdir -p runtime/out

docker run --rm \
  -v $ROOT_DIR/${BUILD_DIR}/bin:/app \
  -v $ROOT_DIR/docker/scripts:/cmd \
  -v $ROOT_DIR/runtime/out:/runtime \
  -w /cmd \
  cpp-dev-env:latest \
  ./collect_boost.sh

set -ex

cp $ROOT_DIR/${BUILD_DIR}/bin/nscalc runtime/out
cp $ROOT_DIR/${BUILD_DIR}/external/npsystem/nplib/libnplib.so runtime/out
cp $ROOT_DIR/${BUILD_DIR}/external/npsystem/nprpc/libnprpc.so runtime/out

cd runtime
tar -czf nscalc-runtime.tar.gz out/