# NScalc Compute Worker — runs on a machine with local Ollama (and optionally
# rag/serve.py), dials out to the nscalc server, and relays LLM/RAG HTTP
# calls. Built as a single self-contained image (unlike the main server's dev
# workflow, which mounts source into nscalc-builder and builds on each run) —
# this is meant to be built once and run persistently, e.g. on a laptop.
#
# Based on nprpc-dev:latest rather than a slim runtime image: it already has
# the Swift toolchain and all nprpc/boost runtime libraries installed, and
# the worker has no GRDB/SQLite/ffmpeg dependencies to justify a separate
# slim-runtime packaging step the way the production server does.
FROM nprpc-dev:latest AS builder

USER root
WORKDIR /app
COPY --chown=ubuntu:ubuntu . /app
USER ubuntu

RUN swift build -c release

FROM nprpc-dev:latest

USER root
COPY --from=builder /app/.build/release/ComputeWorker /usr/local/bin/nscalc-compute-worker
RUN chmod +x /usr/local/bin/nscalc-compute-worker
USER ubuntu

ENTRYPOINT ["/usr/local/bin/nscalc-compute-worker"]
