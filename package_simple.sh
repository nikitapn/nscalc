#!/bin/bash

# NSCalc Proxy Client Simple Packaging Script
# This script creates a distributable package with Qt dependencies

set -e

PROJECT_ROOT="/home/nikita/projects/nscalc"
BUILD_DIR="$PROJECT_ROOT/.build_local"
PACKAGE_DIR="$BUILD_DIR/package"
APP_NAME="proxy_client"

echo "🏗️  NSCalc Proxy Client Packaging"
echo "================================="

# Build first
echo "Building proxy client..."
cd "$PROJECT_ROOT"
cmake --build .build_local --target=proxy_client

# Create package directory
echo "Creating package directory..."
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Copy executable
echo "Copying executable..."
cp "$BUILD_DIR/debug/$APP_NAME" "$PACKAGE_DIR/"

echo "Checking dependencies..."
ldd "$PACKAGE_DIR/$APP_NAME" | grep -E "(Qt6|nprpc)" || true

# Create simple launcher script
echo "Creating launcher script..."
cat > "$PACKAGE_DIR/launch_proxy_client.sh" << 'EOF'
#!/bin/bash
# NSCalc Proxy Client Launcher

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Add local lib directory to library path if it exists
if [ -d "$SCRIPT_DIR/lib" ]; then
    export LD_LIBRARY_PATH="$SCRIPT_DIR/lib:$LD_LIBRARY_PATH"
fi

# Launch the application
exec "$SCRIPT_DIR/proxy_client" "$@"
EOF
chmod +x "$PACKAGE_DIR/launch_proxy_client.sh"

# Create README
cat > "$PACKAGE_DIR/README.md" << EOF
# NSCalc Proxy Client

## Quick Start

1. **Install Qt6 (if not already installed):**
   \`\`\`bash
   # Ubuntu/Debian:
   sudo apt install qt6-base-dev qt6-tools-dev

   # Arch Linux:
   sudo pacman -S qt6-base qt6-tools

   # Fedora:
   sudo dnf install qt6-qtbase-devel qt6-qttools-devel
   \`\`\`

2. **Run the application:**
   \`\`\`bash
   ./launch_proxy_client.sh
   \`\`\`

## What this does

- Provides a GUI for connecting to NSCalc proxy server
- Creates a SOCKS5 proxy on localhost:1080 when connected
- System tray integration for background operation

## Configuration

- **Default server**: example.com:443
- **Default credentials**: user1 / (configure in GUI)
- **SOCKS5 proxy**: 127.0.0.1:1080 (when connected)

## System Requirements

- Linux with Qt6 libraries
- Network access to NSCalc server
- X11 or Wayland display server

## Usage

1. Start the application: \`./launch_proxy_client.sh\`
2. Enable "Edit Config" to modify connection settings
3. Enter your server details and credentials
4. Click "Connect/Disconnect" to establish proxy
5. Configure applications to use SOCKS5 proxy at 127.0.0.1:1080

## Support

- Email: nikitapnn1@gmail.com
- GitHub: https://github.com/your-repo/nscalc

---
Build: $(date +'%Y-%m-%d %H:%M:%S')
Version: 1.0.0
EOF

# Create desktop entry
mkdir -p "$PACKAGE_DIR/share/applications"
cat > "$PACKAGE_DIR/share/applications/nscalc-proxy-client.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=NSCalc Proxy Client
Comment=SOCKS5 Proxy Client for NSCalc
Exec=$PACKAGE_DIR/launch_proxy_client.sh
Icon=network-server
Terminal=false
Categories=Network;Security;Internet;
StartupNotify=true
EOF

# Create tarball
echo "Creating distribution package..."
cd "$BUILD_DIR"
tar -czf "nscalc-proxy-client-linux-$(date +%Y%m%d).tar.gz" -C package .

echo ""
echo "✅ Packaging complete!"
echo "📦 Package: $BUILD_DIR/nscalc-proxy-client-linux-$(date +%Y%m%d).tar.gz"
echo "📁 Directory: $PACKAGE_DIR"
echo ""
echo "📋 Package contents:"
ls -la "$PACKAGE_DIR"
echo ""
echo "🚀 To test: cd $PACKAGE_DIR && ./launch_proxy_client.sh"
