#!/bin/bash

set -e

cmake -B .build -S .
cmake --build .build

CMD=".build/bin/nscalc --hostname archvm --http-dir ../client/public --data-dir ../database"

if [ "$1" == "debug" ]; then
    CMD="gdb --args $CMD"
fi

$CMD
