#/bin/env bash

set -e

docker build -t cpp-runtime-env -f docker/Dockerfile.runtime runtime/out
docker rm -f nscalc &> /dev/null
docker run -d \
  --name nscalc \
  -v /home/nikita/projects/nscalc:/data \
  -w /data \
  -p 8080:8080 \
  cpp-runtime-env \
  nscalc \
    --hostname archvm \
    --http-dir client/public \
    --data-dir sample_data

