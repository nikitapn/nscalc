#!/bin/bash

# NSCalc Proxy Client Packaging Script
# This script packages the Qt application with all required dependencies

set -e

PROJECT_ROOT="/home/nikita/projects/nscalc"
BUILD_DIR="$PROJECT_ROOT/.build_local"
PACKAGE_DIR="$BUILD_DIR/package"
APP_NAME="proxy_client"

echo "🏗️  Building Proxy Client..."
cd "$PROJECT_ROOT"
cmake --build .build_local --target=proxy_client

echo "📦 Creating package directory..."
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Determine platform and package accordingly
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Packaging for Linux..."
    
    # Copy the executable
    cp "$BUILD_DIR/debug/$APP_NAME" "$PACKAGE_DIR/"
    
    # Create AppImage structure
    mkdir -p "$PACKAGE_DIR/usr/bin"
    mkdir -p "$PACKAGE_DIR/usr/lib"
    mkdir -p "$PACKAGE_DIR/usr/share/applications"
    mkdir -p "$PACKAGE_DIR/usr/share/icons/hicolor/256x256/apps"
    
    # Copy executable to AppImage structure
    cp "$BUILD_DIR/debug/$APP_NAME" "$PACKAGE_DIR/usr/bin/"
    
    # Find and copy Qt libraries
    echo "🔍 Finding Qt dependencies..."
    QT_LIBS=$(ldd "$BUILD_DIR/debug/$APP_NAME" | grep Qt6 | awk '{print $3}')
    
    for lib in $QT_LIBS; do
        if [[ -f "$lib" ]]; then
            echo "  Copying: $(basename $lib)"
            cp "$lib" "$PACKAGE_DIR/usr/lib/"
        fi
    done
    
    # Copy other required libraries (excluding system libraries)
    echo "🔗 Copying additional dependencies..."
    OTHER_LIBS=$(ldd "$BUILD_DIR/debug/$APP_NAME" | grep -v "linux-vdso\|libc\|libdl\|libpthread\|libm\|librt\|ld-linux" | awk '{print $3}' | grep -v Qt6)
    
    for lib in $OTHER_LIBS; do
        if [[ -f "$lib" && ! -f "$PACKAGE_DIR/usr/lib/$(basename $lib)" ]]; then
            libname=$(basename "$lib")
            # Skip system libraries
            if [[ ! "$libname" =~ ^(libstdc\+\+|libgcc_s|libssl|libcrypto) ]]; then
                echo "  Copying: $libname"
                cp "$lib" "$PACKAGE_DIR/usr/lib/"
            fi
        fi
    done
    
    # Create launcher script
    cat > "$PACKAGE_DIR/proxy_client.sh" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export LD_LIBRARY_PATH="$SCRIPT_DIR/usr/lib:$LD_LIBRARY_PATH"
export QT_PLUGIN_PATH="$SCRIPT_DIR/usr/plugins"
exec "$SCRIPT_DIR/usr/bin/proxy_client" "$@"
EOF
    chmod +x "$PACKAGE_DIR/proxy_client.sh"
    
    # Create .desktop file
    cat > "$PACKAGE_DIR/usr/share/applications/proxy_client.desktop" << EOF
[Desktop Entry]
Name=NSCalc Proxy Client
Comment=SOCKS5 Proxy Client for NSCalc
Exec=proxy_client
Icon=proxy_client
Type=Application
Categories=Network;Security;
EOF
    
    # Create tar.gz package
    cd "$BUILD_DIR"
    tar -czf "nscalc-proxy-client-linux.tar.gz" -C package .
    echo "✅ Linux package created: $BUILD_DIR/nscalc-proxy-client-linux.tar.gz"

elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Packaging for macOS..."
    
    # Use macdeployqt if available
    if command -v macdeployqt &> /dev/null; then
        macdeployqt "$BUILD_DIR/debug/$APP_NAME.app" -verbose=2
        
        # Create DMG
        hdiutil create -srcfolder "$BUILD_DIR/debug/$APP_NAME.app" \
                       -volname "NSCalc Proxy Client" \
                       "$BUILD_DIR/nscalc-proxy-client-macos.dmg"
        echo "✅ macOS package created: $BUILD_DIR/nscalc-proxy-client-macos.dmg"
    else
        echo "⚠️  macdeployqt not found. Manual packaging..."
        cp -r "$BUILD_DIR/debug/$APP_NAME.app" "$PACKAGE_DIR/"
        tar -czf "$BUILD_DIR/nscalc-proxy-client-macos.tar.gz" -C package .
        echo "✅ macOS package created: $BUILD_DIR/nscalc-proxy-client-macos.tar.gz"
    fi

elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "🪟 Packaging for Windows..."
    
    # Copy executable
    cp "$BUILD_DIR/debug/$APP_NAME.exe" "$PACKAGE_DIR/"
    
    # Use windeployqt if available
    if command -v windeployqt &> /dev/null; then
        windeployqt --verbose 2 --no-compiler-runtime --no-opengl-sw "$PACKAGE_DIR/$APP_NAME.exe"
        echo "✅ Windows package created with windeployqt"
    else
        echo "⚠️  windeployqt not found. Manual Qt library copying required."
        echo "📝 You'll need to manually copy Qt6Core.dll, Qt6Gui.dll, Qt6Widgets.dll"
        echo "   and the platforms/ plugin directory from your Qt installation."
    fi
    
    # Create zip package
    cd "$BUILD_DIR"
    zip -r "nscalc-proxy-client-windows.zip" package/
    echo "✅ Windows package created: $BUILD_DIR/nscalc-proxy-client-windows.zip"
fi

echo ""
echo "📋 Package Contents:"
echo "📁 Package directory: $PACKAGE_DIR"
ls -la "$PACKAGE_DIR"

echo ""
echo "🎉 Packaging complete!"
echo "📦 Package location: $BUILD_DIR"

# Create README for distribution
cat > "$PACKAGE_DIR/README.txt" << EOF
NSCalc Proxy Client
==================

This is the SOCKS5 proxy client for the NSCalc hydroponics calculator.

Installation:
1. Extract this package to your desired location
2. Run the proxy_client executable (or proxy_client.sh on Linux)
3. Configure connection settings in the GUI
4. Click Connect to establish SOCKS5 proxy on port 1080

System Requirements:
- Qt6 runtime libraries (included in this package)
- Network access to NSCalc server
- For proxy usage: Configure applications to use SOCKS5 proxy at 127.0.0.1:1080

For more information, visit: https://github.com/your-repo/nscalc

Support: nikitapnn1@gmail.com
EOF

echo ""
echo "📄 README.txt created for distribution"
echo "🚀 Your application is ready for distribution!"
