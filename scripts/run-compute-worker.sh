#!/bin/bash

SERVER_URL="${NSCALC_SERVER_URL:-https://calculator.lan:443}"

while [ $# -gt 0 ]; do
    case "$1" in
        --server-url)
            SERVER_URL="$2"
            shift
            ;;
        --help)
            cat <<'EOF'
Usage: ./run-compute-worker.sh [options]

  --server-url <url>   URL of the NSCalc server (default: https://calculator.lan:443)
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

docker run --rm -i --add-host=host.docker.internal:host-gateway \
  -v /home/nikita/projects/nscalc/compute-worker:/app \
  -v /home/nikita/projects/nscalc/certs/out:/app/certs \
  -w /app \
  -e NSCALC_SERVER_URL="$SERVER_URL" \
  -e NSCALC_COMPUTE_WORKER_TOKEN=testsecret123 \
  -e NSCALC_WORKER_OLLAMA_HOST=http://host.docker.internal:11434 \
  -e NSCALC_WORKER_RAG_HOST=http://host.docker.internal:8100 \
  -e NSCALC_WORKER_INSECURE_TLS=1 \
  --user root \
  nscalc-builder:latest \
  bash -se <<'EOF'
set -euo pipefail
echo '172.17.0.1 calculator.lan' >> /etc/hosts && cat /etc/hosts
cp /app/certs/localhost.crt /usr/local/share/ca-certificates
update-ca-certificates
.build/debug/ComputeWorker
EOF