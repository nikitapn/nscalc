#!/bin/bash

set -e

cmake -B .build_local -S . -DOPT_NPRPC_SKIP_TESTS=ON -DCMAKE_BUILD_TYPE=Debug
# cmake --build .build_local
cmake --build .build_local --target=nscalc
cmake --build .build_local --target=proxy_client

CMD=".build_local/debug/nscalc --hostname archvm --http-dir ./client/public --data-dir ./sample_data"

if [ "$1" == "debug" ]; then
    CMD="gdb --args $CMD"
fi

$CMD
