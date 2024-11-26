#!/bin/env bash

set -e
cd $(dirname $(readlink -e ${BASH_SOURCE[0]}))

[ ! -L "server/external/npsystem" ] && ln -s $(readlink -f ../npsystem) server/external/npsystem

cd docker
docker build -t cpp-dev-env:boost-1-83 -f Dockerfile.boost_1_83 .
docker build -t cpp-dev-env:latest -f Dockerfile.dev .
