#/bin/env bash

docker build -t cpp-runtime-env -f docker/Dockerfile.runtime runtime/out
docker run -d \
  --name nscalc \
  -v /home/nikita/projects/nscalc:/data \
  -w /data \
  -p 8080:8080 \
  cpp-runtime-env \
  /app/nscalc \
    --hostname archvm \
    --data-dir sample_data \
    --root-dir client/public
    --root-dir client/public
