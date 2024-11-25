#!/bin/env bash

set -e

cd docker
docker build -t cpp-dev-env:boost-1-83 -f Dockerfile.boost_1_83 .
docker build -t cpp-dev-env:latest -f Dockerfile.dev .
