#!/bin/bash

set -e

cmake -B .build_local -S . -DOPT_NPRPC_SKIP_TESTS=ON -DCMAKE_BUILD_TYPE=Release
# cmake --build .build_local
cmake --build .build_local --target=nscalc
cmake --build .build_local --target=proxy_client

CMD=".build_local/release/nscalc \
    --hostname archvm.lan \
    --port 8443 \
    --http-dir ./client/public \
    --data-dir ./sample_data \
    --use-ssl 1 \
    --public-key certs/archvm.lan.crt \
    --private-key certs/archvm.lan.key \
    --dh-params certs/dhparam.pem \
    --trace"

if [ "$1" == "debug" ]; then
    CMD="gdb --args $CMD"
fi

$CMD &
PID=$!
echo "NSCalc is running with PID $PID"

# ./.build_local/debug/proxy_client &
# PROXY_PID=$!
# echo "Proxy client is running with PID $PROXY_PID"

trap ctrl_c INT
ctrl_c() {
    echo "Stopping NSCalc with PID $PID..."
    kill $PID
    # echo "Stopping Proxy client with PID $PROXY_PID..."
    # kill $PROXY_PID
    # echo "Exiting..."
    exit 0
}

wait $PID
# wait $PROXY_PID
echo "NSCalc and Proxy client have stopped."
