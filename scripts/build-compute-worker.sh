#!/bin/bash


docker run --rm --user "$(id -u):$(id -g)" \
  -v /home/nikita/projects/nscalc/compute-worker:/app \
  -w /app \
  nscalc-builder:latest \
  swift build