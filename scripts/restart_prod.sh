#!/bin/bash

set -euo pipefail

CONTAINER_NAME="nscalc-swift"
SSH_TARGET=""

usage() {
  cat <<'EOF'
Usage: ./restart_prod.sh --ssh user@server [options]

Restart the existing nscalc production container on the VPS without
rebuilding or redeploying the image.

  --ssh <user@server>        SSH target
  --container <name>         Docker container name (default: nscalc-swift)
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --ssh)
      SSH_TARGET="$2"
      shift
      ;;
    --container)
      CONTAINER_NAME="$2"
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

if [ -z "$SSH_TARGET" ]; then
  usage >&2
  exit 1
fi

echo "Restarting container '$CONTAINER_NAME' on $SSH_TARGET ..."

ssh "$SSH_TARGET" \
  CONTAINER_NAME="$CONTAINER_NAME" \
  'bash -se' <<'EOF'
set -euo pipefail

if ! docker inspect "$CONTAINER_NAME" >/dev/null 2>&1; then
  echo "Container not found: $CONTAINER_NAME" >&2
  echo "Use deploy.sh to create it first." >&2
  exit 1
fi

docker restart "$CONTAINER_NAME"
docker ps --filter "name=^${CONTAINER_NAME}$" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
EOF

echo "Restart complete."
