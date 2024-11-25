#!/bin/env bash

ldd /app/nscalc | grep boost | awk '{ print $3 }' | xargs tar --absolute-names -czf /runtime/boost_runtime_libs.tar.gz
chown 1000:1000 /runtime/boost_runtime_libs.tar.gz