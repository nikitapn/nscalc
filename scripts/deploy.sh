#!/bin/bash

set -euo pipefail

SCRIPTS_DIR=$(dirname "$(readlink -e "${BASH_SOURCE[0]}")") 
ROOT_DIR=$(dirname "$SCRIPTS_DIR")
APP_DIR="/home/debian/nscalc-new"
REMOTE_TMP_DIR="/tmp/nscalc-release"
IMAGE_NAME="nscalc-swift:latest"
CONTAINER_NAME="nscalc-swift"
PORT="8443"
HOSTNAME=""
SSH_TARGET=""
CERT_DIR="/etc/letsencrypt"
PUBLIC_KEY="/certs/live/nikitapn.com/fullchain.pem"
PRIVATE_KEY="/certs/live/nikitapn.com/privkey.pem"
DH_PARAMS=""
CERT_WATCH_INTERVAL=""
# npquicrouter's shared-memory directory (its unit bind-mounts it as its own
# /dev/shm; see nprpc/npquicrouter/README.md). The container gets the same one.
SHM_DIR="/dev/shm/npquicrouter"
# RAG Model configuration
OLLAMA_MODEL="gemma4"
OLLAMA_NUM_CTX="16384"
COMPUTE_WORKER_TOKEN="testsecret123"
# Base image with libnprpc (nprpc: `just build-runtime-image`). Resolved to
# its versioned tag below, so the server keeps one image per NPRPC version.
RUNTIME_IMAGE="nprpc-runtime:latest"

usage() {
  cat <<'EOF'
Usage: ./deploy.sh --ssh user@server --hostname calc.example.com --cert-dir /path/on/server [options]

  --ssh <user@server>         SSH target for deployment
  --hostname <value>          Public hostname written into host.json
  --cert-dir <path>           Remote certificate mount root, e.g. /etc/letsencrypt
  --app-dir <path>            Remote application state directory (default: /opt/nscalc)
  --remote-tmp <path>         Remote temporary upload directory (default: /tmp/nscalc-release)
  --image <name>              Docker image tag (default: nscalc-swift:latest)
  --container <name>          Docker container name (default: nscalc-swift)
  --port <value>              Public TCP/UDP port (default: 443)
  --public-key <path>         Certificate path inside the container (default: /certs/fullchain.pem)
  --private-key <path>        Private key path inside the container (default: /certs/privkey.pem)
  --dh-params <path>          DH params path inside the container
  --cert-watch-interval <secs>  Poll the mounted certificate every <secs> and reload it
                              in-process when it changes (default: unset = no polling).
                              Independent of the SIGHUP hook below, which always works.
  --shm-dir <path>            npquicrouter's shared-memory directory on the host, mounted
                              as the container's /dev/shm (default: /dev/shm/npquicrouter)
  --ollama-model <name>       Ollama model name (default: gemma4)
  --runtime-image <name>      NPRPC runtime base image (default: nprpc-runtime:latest,
                              resolved to its versioned tag). Build it in the nprpc
                              repo with `just build-runtime-image`, from the same
                              nprpc-dev image nscalc-builder is based on. It is
                              copied to the server only if the server lacks it.

The production container is started with CAP_NET_ADMIN and CAP_BPF so NPRPC can
install the eBPF SO_REUSEPORT selector required by multi-worker HTTP/3.

--cert-dir is mounted read-only at /certs, so certbot renewing on the host is
visible inside the container straight away.  Mount the whole /etc/letsencrypt
tree rather than just live/: certbot's live/*.pem are relative symlinks into
../../archive/, which dangle if only live/ is mounted.

To pick a renewal up without a restart, have certbot signal the container:

  certbot certonly --webroot -w /var/www/acme -d <hostname> \
    --deploy-hook 'docker kill -s HUP <container>'

The server reloads TLS certificates on SIGHUP without dropping connections.
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --ssh)
      SSH_TARGET="$2"
      shift
      ;;
    --hostname)
      HOSTNAME="$2"
      shift
      ;;
    --cert-dir)
      CERT_DIR="$2"
      shift
      ;;
    --app-dir)
      APP_DIR="$2"
      shift
      ;;
    --remote-tmp)
      REMOTE_TMP_DIR="$2"
      shift
      ;;
    --image)
      IMAGE_NAME="$2"
      shift
      ;;
    --container)
      CONTAINER_NAME="$2"
      shift
      ;;
    --port)
      PORT="$2"
      shift
      ;;
    --public-key)
      PUBLIC_KEY="$2"
      shift
      ;;
    --private-key)
      PRIVATE_KEY="$2"
      shift
      ;;
    --dh-params)
      DH_PARAMS="$2"
      shift
      ;;
    --cert-watch-interval)
      CERT_WATCH_INTERVAL="$2"
      shift
      ;;
    --shm-dir)
      SHM_DIR="$2"
      shift
      ;;
    --ollama-model)
      OLLAMA_MODEL="$2"
      shift
      ;;
    --ollama-num-ctx)
      OLLAMA_NUM_CTX="$2"
      shift
      ;;
    --runtime-image)
      RUNTIME_IMAGE="$2"
      shift
      ;;
    --compute-worker-token)
      COMPUTE_WORKER_TOKEN="$2"
      shift
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
  shift
done

if [ -z "$SSH_TARGET" ] || [ -z "$HOSTNAME" ] || [ -z "$CERT_DIR" ]; then
  usage >&2
  exit 1
fi

cd "$ROOT_DIR"

# Pin the runtime image to its versioned tag (e.g. nprpc-runtime:1.0.0-abc),
# so a later runtime built for another site doesn't change this one.
RUNTIME_ID=$(docker image inspect --format '{{.Id}}' "$RUNTIME_IMAGE") || {
  echo "Runtime image $RUNTIME_IMAGE not found; build it in nprpc with 'just build-runtime-image'" >&2
  exit 1
}
RUNTIME_TAG=$(docker image inspect --format '{{join .RepoTags "\n"}}' "$RUNTIME_IMAGE" | grep -v ':latest$' | head -n1)
RUNTIME_TAG=${RUNTIME_TAG:-$RUNTIME_IMAGE}

# The server is compiled in nscalc-builder with the Swift bridge linked in,
# so it must run against the same libnprpc. Refuse a mismatched runtime.
RUNTIME_LIB_SHA=$(docker image inspect --format '{{index .Config.Labels "io.nprpc.libnprpc.sha256"}}' "$RUNTIME_TAG")
BUILDER_LIB_SHA=$(docker run --rm --entrypoint sha256sum nscalc-builder:latest /opt/nprpc/lib/libnprpc.so.1.0.0 | cut -d' ' -f1)
if [ "$RUNTIME_LIB_SHA" != "$BUILDER_LIB_SHA" ]; then
  cat >&2 <<MSG
$RUNTIME_TAG does not carry the libnprpc that nscalc-builder compiles against
  runtime: ${RUNTIME_LIB_SHA:-<no label>}
  builder: $BUILDER_LIB_SHA
Rebuild nscalc-builder from the current nprpc-dev, or build a runtime image
from the dev image nscalc-builder is based on (in nprpc:
just build-runtime-image <that nprpc-dev image>).
MSG
  exit 1
fi

"$SCRIPTS_DIR/package_prod.sh"

# Ship the runtime image unless the server already has it. docker save/load
# keeps layer digests, so every site built FROM it shares its layers.
if ssh "$SSH_TARGET" "docker image inspect --format '{{.Id}}' '$RUNTIME_TAG' 2>/dev/null" | grep -qx "$RUNTIME_ID"; then
  echo "Server already has $RUNTIME_TAG"
else
  echo "Sending $RUNTIME_TAG to $SSH_TARGET ..."
  docker save "$RUNTIME_TAG" | gzip | ssh "$SSH_TARGET" 'gunzip | docker load'
fi

BUNDLE_TARBALL="$ROOT_DIR/runtime/nscalc-prod-bundle.tar.gz"
RELEASE_DIR="$APP_DIR/release"

ssh "$SSH_TARGET" "mkdir -p '$(dirname "$REMOTE_TMP_DIR")'"
scp "$BUNDLE_TARBALL" "$SSH_TARGET:$REMOTE_TMP_DIR.tar.gz"

ssh "$SSH_TARGET" \
  APP_DIR="$APP_DIR" \
  CERT_DIR="$CERT_DIR" \
  CONTAINER_NAME="$CONTAINER_NAME" \
  DH_PARAMS="$DH_PARAMS" \
  CERT_WATCH_INTERVAL="$CERT_WATCH_INTERVAL" \
  HOSTNAME="$HOSTNAME" \
  IMAGE_NAME="$IMAGE_NAME" \
  PORT="$PORT" \
  PRIVATE_KEY="$PRIVATE_KEY" \
  PUBLIC_KEY="$PUBLIC_KEY" \
  RELEASE_DIR="$RELEASE_DIR" \
  RUNTIME_TAG="$RUNTIME_TAG" \
  SHM_DIR="$SHM_DIR" \
  OLLAMA_MODEL="$OLLAMA_MODEL" \
  OLLAMA_NUM_CTX="$OLLAMA_NUM_CTX" \
  COMPUTE_WORKER_TOKEN="$COMPUTE_WORKER_TOKEN" \
  REMOTE_TMP_DIR="$REMOTE_TMP_DIR" \
  'bash -se' <<'EOF'
set -euo pipefail

# The rings themselves may come and go — the server attaches whenever the
# router creates them — but the directory is what gets mounted, and a missing
# one means the router's unit predates it.
if [ ! -d "$SHM_DIR" ]; then
  echo "npquicrouter's shared-memory directory $SHM_DIR does not exist." >&2
  echo "Its unit needs BindPaths=$SHM_DIR:/dev/shm (nprpc/npquicrouter/README.md)." >&2
  exit 1
fi

mkdir -p "$REMOTE_TMP_DIR" "$APP_DIR/data" "$RELEASE_DIR"
rm -rf "$REMOTE_TMP_DIR"/*
tar -xzf "$REMOTE_TMP_DIR.tar.gz" -C "$REMOTE_TMP_DIR"

OLD_IMAGE_ID=$(docker image inspect --format '{{.Id}}' "$IMAGE_NAME" 2>/dev/null || true)
docker build -t "$IMAGE_NAME" \
  --build-arg NPRPC_RUNTIME_IMAGE="$RUNTIME_TAG" \
  -f "$REMOTE_TMP_DIR/docker/Dockerfile.prod" "$REMOTE_TMP_DIR"

docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true

DOCKER_ARGS=(
  run -d
  --name "$CONTAINER_NAME"
  --restart no
  --user 0:0
  --cap-add=NET_ADMIN
  --cap-add=BPF
  -p "$PORT:443/tcp"
  -p "$PORT:443/udp"
  -v "$APP_DIR/data:/data"
  -v "$CERT_DIR:/certs:ro"
  # HTTP/3 goes through npquicrouter's shared-memory rings. The directory, not
  # the ring files: a file bind mount stays on the object it saw, the router
  # recreates its rings whenever it starts, and the server finds the new ones
  # by name (it rechecks every second). So the router and this container can
  # restart in either order.
  -v "$SHM_DIR:/dev/shm"
  -e "NSCALC_HOSTNAME=$HOSTNAME"
  -e "NSCALC_PORT=443"
  -e "NSCALC_DATA_DIR=/data"
  -e "NSCALC_ENABLE_HTTP3=1"
  -e "NSCALC_USE_HTTP3_SHM_CHANNELS=1"
  -e "NSCALC_USE_SSL=1"
  -e "NSCALC_PUBLIC_KEY=$PUBLIC_KEY"
  -e "NSCALC_PRIVATE_KEY=$PRIVATE_KEY"
  -e "NSCALC_OLLAMA_MODEL=$OLLAMA_MODEL"
  -e "NSCALC_OLLAMA_NUM_CTX=$OLLAMA_NUM_CTX"
  -e "NSCALC_COMPUTE_WORKER_TOKEN=$COMPUTE_WORKER_TOKEN"
)

if [ -n "$DH_PARAMS" ]; then
  DOCKER_ARGS+=( -e "NSCALC_DH_PARAMS=$DH_PARAMS" )
fi

if [ -n "$CERT_WATCH_INTERVAL" ]; then
  DOCKER_ARGS+=( -e "NSCALC_CERT_WATCH_INTERVAL=$CERT_WATCH_INTERVAL" )
fi

docker "${DOCKER_ARGS[@]}" "$IMAGE_NAME"

# Drop the previous image (over 2 GB, mostly seed data); the runtime layers it
# shared with other sites stay.
if [ -n "$OLD_IMAGE_ID" ] && [ "$OLD_IMAGE_ID" != "$(docker image inspect --format '{{.Id}}' "$IMAGE_NAME")" ]; then
  docker image rm "$OLD_IMAGE_ID" >/dev/null 2>&1 || true
fi

rm -rf "$REMOTE_TMP_DIR" "$REMOTE_TMP_DIR.tar.gz"
# Each build caches its >1 GB context, which the next deploy never reuses.
docker builder prune -f >/dev/null
EOF

echo "Deployment complete: https://$HOSTNAME:$PORT"
echo
echo "Certificate renewal: point certbot's deploy hook at this container so a"
echo "renewal is reloaded without a restart:"
echo
echo "  --deploy-hook 'docker kill -s HUP $CONTAINER_NAME'"
