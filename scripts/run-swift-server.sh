#!/bin/bash
# Run the NScalc Swift server inside the nprpc-dev Docker container.
#
# Usage:
#   ./run_swift_server.sh              # release build
#   ./run_swift_server.sh --debug      # debug build
#   ./run_swift_server.sh debug        # gdb session (same as --debug)

set -e

SCRIPTS_DIR=$(dirname "$(readlink -e "${BASH_SOURCE[0]}")") 
ROOT_DIR=$(dirname "$SCRIPTS_DIR")
DOCKER_IMAGE="nscalc-builder:latest"
BUILD_CONFIG="release"
HOSTNAME_ARG="calculator.lan"
PORT_ARG="443"
ENABLE_HTTP3=1
USE_SSL=1
PUBLIC_KEY_ARG="/app/certs/out/localhost.crt"
PRIVATE_KEY_ARG="/app/certs/out/localhost.key"
DH_PARAMS_ARG=""
OLLAMA_HOST_ARG="${NSCALC_OLLAMA_HOST:-}"
OLLAMA_MODEL_ARG="${NSCALC_OLLAMA_MODEL:-}"
OLLAMA_TIMEOUT_ARG="${NSCALC_OLLAMA_TIMEOUT:-}"
OLLAMA_NUM_CTX_ARG="${NSCALC_OLLAMA_NUM_CTX:-}"
RAG_HOST_ARG="${NSCALC_RAG_HOST:-}"
RAG_TIMEOUT_ARG="${NSCALC_RAG_TIMEOUT:-}"
COMPUTE_WORKER_TOKEN_ARG="${NSCALC_COMPUTE_WORKER_TOKEN:-}"

while [ $# -gt 0 ]; do
    case "$1" in
        --debug|debug)
            BUILD_CONFIG="debug"
            ;;
        --hostname)
            HOSTNAME_ARG="$2"
            shift
            ;;
        --port)
            PORT_ARG="$2"
            shift
            ;;
        --public-key)
            PUBLIC_KEY_ARG="$2"
            shift
            ;;
        --private-key)
            PRIVATE_KEY_ARG="$2"
            shift
            ;;
        --dh-params)
            DH_PARAMS_ARG="$2"
            shift
            ;;
        --ollama-host)
            OLLAMA_HOST_ARG="$2"
            shift
            ;;
        --ollama-model)
            OLLAMA_MODEL_ARG="$2"
            shift
            ;;
        --ollama-timeout)
            OLLAMA_TIMEOUT_ARG="$2"
            shift
            ;;
        --ollama-num-ctx)
            OLLAMA_NUM_CTX_ARG="$2"
            shift
            ;;
        --rag-host)
            RAG_HOST_ARG="$2"
            shift
            ;;
        --rag-timeout)
            RAG_TIMEOUT_ARG="$2"
            shift
            ;;
        --compute-worker-token)
            COMPUTE_WORKER_TOKEN_ARG="$2"
            shift
            ;;
        --disable-http3)
            ENABLE_HTTP3=0
            ;;
        --disable-ssl)
            USE_SSL=0
            ;;
        --help)
            cat <<'EOF'
Usage: ./run-swift-server.sh [options]

  --debug              Run the server under gdb inside Docker
  --hostname <value>   Public hostname for host.json
  --port <value>       HTTP/WS port to expose
  --public-key <path>  Certificate path inside the container
  --private-key <path> Private key path inside the container
  --dh-params <path>   Optional DH params path inside the container
  --ollama-host <url>  Ollama server base URL for the AI assistant (default: NSCALC_OLLAMA_HOST env, else http://localhost:11434)
  --ollama-model <name> Ollama model to use for the AI assistant (default: NSCALC_OLLAMA_MODEL env; assistant disabled if unset)
  --ollama-timeout <s>  Per-request timeout in seconds for Ollama calls (default: NSCALC_OLLAMA_TIMEOUT env, else 120)
  --ollama-num-ctx <n>  Context window size (tokens) requested from Ollama (default: NSCALC_OLLAMA_NUM_CTX env; Ollama's own default if unset, often much smaller than the model max — raises KV-cache memory use)
  --rag-host <url>      Base URL of the rag/serve.py bridge for growing-guide search (default: NSCALC_RAG_HOST env; tool disabled if unset)
  --rag-timeout <s>     Per-request timeout in seconds for RAG search calls (default: NSCALC_RAG_TIMEOUT env, else 20)
  --compute-worker-token <token>  Shared secret a compute-worker/ instance must present to relay Ollama/RAG calls (default: NSCALC_COMPUTE_WORKER_TOKEN env; ComputeChannel refuses all connections if unset)
  --disable-http3      Disable HTTP/3
  --disable-ssl        Disable TLS
EOF
            exit 0
            ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 1
            ;;
    esac
    shift
done

BINARY="/app/server/.build/$BUILD_CONFIG/NScalcServer"

if [ ! -f "$ROOT_DIR/server/.build/$BUILD_CONFIG/NScalcServer" ]; then
    echo "Binary not found: server/.build/$BUILD_CONFIG/NScalcServer"
    echo "Run ./build_swift_server.sh first."
    exit 1
fi

echo "Republishing journal assets into the HTTP root..."
"$SCRIPTS_DIR/republish-journal-assets.sh" "$ROOT_DIR/client/dist"

echo "Starting NScalc Swift server ($BUILD_CONFIG) inside Docker..."
echo "  Image   : $DOCKER_IMAGE"
echo "  Hostname: $HOSTNAME_ARG  Port: $PORT_ARG"
echo ""

DOCKER_CMD=(
    docker run --rm -it
    --user "$(id -u):$(id -g)"
    --name nscalc-swift
    --cap-add=NET_ADMIN
    --cap-add=BPF
    --ipc=host

    # Lets --ollama-host http://host.docker.internal:<port> reach an Ollama
    # instance running on this same machine (outside the container). Linux
    # Docker doesn't map this hostname by default the way Docker Desktop
    # does, so it must be added explicitly; harmless/no-op if you point
    # --ollama-host at a real remote machine instead.
    --add-host=host.docker.internal:host-gateway

    # Mount project sub-trees the server needs at runtime
    -v "$ROOT_DIR/server":/app/server:ro
    -v "$ROOT_DIR/certs":/app/certs:ro
    -v "$ROOT_DIR/client/dist":/app/runtime/www  # rw — host.json lives here
    -v "$ROOT_DIR/sample_data":/app/sample_data      # rw — SQLite DB lives here

    # Expose the RPC/HTTP port
    -p "${PORT_ARG}:443/tcp"
    -p "${PORT_ARG}:443/udp"

    -w /app
    "$DOCKER_IMAGE"
)

if [ "$BUILD_CONFIG" = "debug" ]; then
    DOCKER_CMD+=(gdb --args)
fi

DOCKER_CMD+=(
    "$BINARY"
    --hostname "$HOSTNAME_ARG"
    --port     443
    --http-dir /app/runtime/www
    --data-dir /app/sample_data
    --use-ssl  "$USE_SSL"
)

if [ "$USE_SSL" = "1" ]; then
    DOCKER_CMD+=(
        --public-key "$PUBLIC_KEY_ARG"
        --private-key "$PRIVATE_KEY_ARG"
    )
    if [ -n "$DH_PARAMS_ARG" ]; then
        DOCKER_CMD+=(--dh-params "$DH_PARAMS_ARG")
    fi
fi

if [ "$ENABLE_HTTP3" = "1" ]; then
    DOCKER_CMD+=(--enable-http3)
fi

if [ -n "$OLLAMA_HOST_ARG" ]; then
    DOCKER_CMD+=(--ollama-host "$OLLAMA_HOST_ARG")
fi
if [ -n "$OLLAMA_MODEL_ARG" ]; then
    DOCKER_CMD+=(--ollama-model "$OLLAMA_MODEL_ARG")
fi
if [ -n "$OLLAMA_TIMEOUT_ARG" ]; then
    DOCKER_CMD+=(--ollama-timeout "$OLLAMA_TIMEOUT_ARG")
fi
if [ -n "$OLLAMA_NUM_CTX_ARG" ]; then
    DOCKER_CMD+=(--ollama-num-ctx "$OLLAMA_NUM_CTX_ARG")
fi
if [ -n "$RAG_HOST_ARG" ]; then
    DOCKER_CMD+=(--rag-host "$RAG_HOST_ARG")
fi
if [ -n "$RAG_TIMEOUT_ARG" ]; then
    DOCKER_CMD+=(--rag-timeout "$RAG_TIMEOUT_ARG")
fi
if [ -n "$COMPUTE_WORKER_TOKEN_ARG" ]; then
    DOCKER_CMD+=(--compute-worker-token "$COMPUTE_WORKER_TOKEN_ARG")
fi

exec "${DOCKER_CMD[@]}"
