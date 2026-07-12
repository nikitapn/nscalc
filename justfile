# NScalc task runner — thin wrapper over the scripts/ directory, npm, and
# docker. Doesn't replace SwiftPM/Vite/Docker, just gives one discoverable
# entry point instead of remembering which .sh does what.
#
# Install: pacman -S just (Arch) / see https://github.com/casey/just
# List all recipes: just --list

set shell := ["bash", "-euo", "pipefail", "-c"]

default:
    @just --list

# --- First-time setup ---------------------------------------------------

# Build the nscalc-builder:latest Docker image (needed once, or after Dockerfile.dev changes)
build-dev-image:
    ./scripts/build-dev-image.sh

# Full fresh-clone bootstrap: dev image + stubs + server + compute-worker + client deps
setup: build-dev-image gen-stubs build-server build-compute-worker client-install
    @echo "Setup complete. Run 'just run-server' and 'just client-dev' in two terminals."

# --- Codegen --------------------------------------------------------------

# Regenerate NPRPC stubs (TS + Swift, for server AND compute-worker) from idl/*.npidl
gen-stubs:
    python3 scripts/gen_stubs.py

# ...TypeScript only -> client/src/rpc/
gen-stubs-ts:
    python3 scripts/gen_stubs.py --ts

# ...Swift only -> server/Sources/NScalc/ and compute-worker/Sources/NScalc/
gen-stubs-swift:
    python3 scripts/gen_stubs.py --swift

# --- Server (VPS-facing NPRPC/HTTP server) --------------------------------

# gen_stubs.py + swift build -c release, inside Docker
build-server:
    ./scripts/build-swift-server.sh

# ...debug build
build-server-debug:
    ./scripts/build-swift-server.sh --debug

# ...skip stub regen, just build
build-server-nogen:
    ./scripts/build-swift-server.sh --no-gen

# Run the built server in Docker (https://localhost:8443). Pass extra flags directly, e.g. `just run-server --ollama-model qwen3.5:latest`
run-server *args:
    ./scripts/run-swift-server.sh {{ args }}

# Run under gdb
run-server-debug *args:
    ./scripts/run-swift-server.sh --debug {{ args }}

# Run the server in dev mode (no SSL, no HTTP/3, port 8080) for local testing under vite dev server
run-server-dev-mode:
    ./scripts/run-swift-server.sh --disable-ssl --disable-http3 --port 8080 \
    --ollama-host http://host.docker.internal:11434 \
    --ollama-model gemma4 --ollama-num-ctx 16384 --ollama-timeout 90000 \
    --rag-host http://host.docker.internal:8100

# Launch Chromium with the dev self-signed cert pre-trusted
run-chrome:
    ./scripts/run-chrome.sh

# Reset local SQLite dev credentials (superuser@nscalc.com/1234, guest@nscalc.com/...)
reset-auth:
    ./scripts/reset-dev-auth.sh

# --- Compute worker (relays local Ollama/RAG to the server over NPRPC) ---

# Build compute-worker/ inside Docker
build-compute-worker:
    ./scripts/build-compute-worker.sh

# Run the compute-worker test harness (see scripts/run-compute-worker-test.sh for the hardcoded server/cert config)
run-compute-worker *args:
    ./scripts/run-compute-worker.sh {{ args }}

# --- RAG bridge (growing-guide search — see rag/README) ------------------

# Start the RAG HTTP bridge (embeds queries + searches pgvector); requires rag/.venv and the postgres container from rag/docker-compose.yml
rag-serve:
    cd rag && .venv/bin/python serve.py

# Start the RAG Postgres/pgvector container
rag-db-up:
    cd rag && docker compose up -d

# Stop the RAG Postgres/pgvector container
rag-db-down:
    cd rag && docker compose down

# --- Client (Svelte/TS frontend) ------------------------------------------

# Install client dependencies
client-install:
    cd client && npm install

# vite dev server (proxies /host.json and /mock to the Swift server)
client-dev:
    cd client && npm run dev

# vite build
client-build:
    cd client && npm run build

# svelte-check + tsc — closest thing to a typecheck/lint gate
client-check:
    cd client && npm run check

# --- Production packaging & deployment ------------------------------------

# Build a release bundle tarball
package-prod:
    ./scripts/package_prod.sh

# Smoke-test the prod Docker image locally
smoke-prod:
    ./scripts/smoke_prod.sh

# Deploy to the VPS. Pass flags directly, e.g. `just deploy --ssh debian@host --hostname calc.example.com --cert-dir /etc/letsencrypt/live/calc.example.com --dh-params /certs/ssl-dhparams.pem --port 443`
deploy *args:
    ./scripts/deploy.sh {{ args }}

# Restart the existing prod container on the VPS (no rebuild). e.g. `just restart-prod --ssh debian@host`
restart-prod *args:
    ./scripts/restart_prod.sh {{ args }}

# Gather logs/coredumps from the production server
diagnostics *args:
    ./scripts/collect_prod_diagnostics.sh {{ args }}

# Copy sample media into the client dist/ (used by run-swift-server.sh already; rarely needed standalone)
republish-journal-assets:
    ./scripts/republish-journal-assets.sh
