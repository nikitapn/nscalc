#!/bin/env bash

set -ex

cd docker
docker build -t cpp-dev-env:boost-1-83 -f ../docker/Dockerfile.boost_1_83 .
docker build -t cpp-dev-env:latest -f ../docker/Dockerfile.dev .
