#!/bin/bash

# Fix Docker Permission Issues
# This script fixes files and directories created by Docker as root

set -e

PROJECT_ROOT="/home/nikita/projects/nscalc"
USER_NAME="nikita"

echo "🔧 Fixing Docker-created file permissions..."

# Directories that might have been created as root by Docker
DIRS_TO_FIX=(
    ".build"
    ".build_local" 
    "runtime"
    "client/node_modules"
    "client/build"
    "new_client/node_modules"
    "new_client/build"
)

for dir in "${DIRS_TO_FIX[@]}"; do
    if [[ -d "$PROJECT_ROOT/$dir" ]]; then
        echo "Fixing permissions for: $dir"
        sudo chown -R "$USER_NAME:$USER_NAME" "$PROJECT_ROOT/$dir"
    fi
done

# Fix any files in project root that might be owned by root
echo "Fixing any root-owned files in project root..."
sudo find "$PROJECT_ROOT" -user root -exec chown "$USER_NAME:$USER_NAME" {} \; 2>/dev/null || true

echo "✅ Permission fix complete!"
echo "All files should now be owned by user: $USER_NAME"
