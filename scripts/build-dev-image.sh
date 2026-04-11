#!/bin/bash

SCRIPTS_DIR=$(dirname "$(readlink -e "${BASH_SOURCE[0]}")") 
ROOT_DIR=$(dirname "$SCRIPTS_DIR")

cd "$ROOT_DIR/docker"
docker build -t nscalc-builder:latest -f Dockerfile.dev .