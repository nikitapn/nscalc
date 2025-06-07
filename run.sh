#!/bin/bash

set -e

cmake -B .build_local -S . -DOPT_NPRPC_SKIP_TESTS=ON
cmake --build .build_local

CMD=".build_local/bin/nscalc --hostname archvm --http-dir ./client/public --data-dir ./sample_data"

if [ "$1" == "debug" ]; then
    CMD="gdb --args $CMD"
fi

$CMD
