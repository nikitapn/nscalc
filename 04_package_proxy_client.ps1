# Windows Packaging Script for NSCalc Proxy Client
# Run this in PowerShell from the project root directory

param(
    [string]$BuildDir = ".build_local\win",
    [string]$QtDir = $env:QT_DIR,
    [string]$OpenSSLDir = $env:OPENSSL_DIR,
    [string]$BoostDir = $env:BOOST_DIR,
    [string]$BuildType = "Release" # Default build type
)

# Check if Qt directory is set
if (-not $QtDir) {
    Write-Host "❌ QT_DIR environment variable not set!" -ForegroundColor Red
    Write-Host "Please set QT_DIR to your Qt6 installation directory" -ForegroundColor Yellow
    Write-Host "Example: setx QT_DIR 'C:\Qt\6.5.0\msvc2022_64'" -ForegroundColor Yellow
    exit 1
}
# Check if OpenSSL directory is set
if (-not $OpenSSLDir) {
    Write-Host "❌ OPENSSL_DIR environment variable not set!" -ForegroundColor Red
    Write-Host "Please set OPENSSL_DIR to your OpenSSL installation directory" -ForegroundColor Yellow
    exit 1
}
# Check if Boost directory is set
if (-not $BoostDir) {
    Write-Host "❌ BOOST_DIR environment variable not set!" -ForegroundColor Red
    Write-Host "Please set BOOST_DIR to your Boost installation directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "🏗️  NSCalc Proxy Client Windows Packaging Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan


$ProjectRoot = Get-Location
# $PackageDir = Join-Path $BuildDir "package"
$PackageDir = "C:\Standalone\NSCalcProxyClient"
$AppName = "proxy_client.exe"

# Build the application
Write-Host "🔨 Building proxy client..." -ForegroundColor Green
cmake --build $BuildDir --target proxy_client --config $BuildType --parallel
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Create package directory
Write-Host "📁 Creating package directory..." -ForegroundColor Green
if (Test-Path $PackageDir) {
    Remove-Item $PackageDir -Recurse -Force
}
New-Item -ItemType Directory -Path $PackageDir -Force | Out-Null

# Copy executable
$ExeSource = Join-Path $BuildDir $BuildType $AppName
$ExeDest = Join-Path $PackageDir $AppName
Copy-Item $ExeSource $ExeDest

Write-Host "📦 Deploying Qt libraries..." -ForegroundColor Green

# Find windeployqt
$WinDeployQt = Join-Path $QtDir "bin\windeployqt.exe"

if (Test-Path $WinDeployQt) {
    # Use windeployqt for automatic deployment
    & $WinDeployQt --verbose 2 --release --no-compiler-runtime --no-opengl-sw $ExeDest
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Qt libraries deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  windeployqt completed with warnings" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ windeployqt not found at: $WinDeployQt" -ForegroundColor Red
    Write-Host "📝 Manual deployment required:" -ForegroundColor Yellow
    Write-Host "   1. Copy Qt6Core.dll, Qt6Gui.dll, Qt6Widgets.dll to package directory" -ForegroundColor Yellow
    Write-Host "   2. Copy platforms/ folder from Qt plugins directory" -ForegroundColor Yellow
    Write-Host "   3. Copy any other required DLLs" -ForegroundColor Yellow
}

# Copy additional dependencies (OpenSSL, Boost, etc.)
Write-Host "🔗 Copying additional dependencies..." -ForegroundColor Green

# Check for OpenSSL DLLs
if ($OpenSSLDir) {
    $OpenSSLBin = Join-Path $OpenSSLDir "bin"
    if (Test-Path $OpenSSLBin) {
        Get-ChildItem "$OpenSSLBin\*.dll" | ForEach-Object {
            Copy-Item $_.FullName $PackageDir
            Write-Host "  Copied: $($_.Name)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "❌ OpenSSL directory not found! Please set OPT_OPENSSL_DIR environment variable." -ForegroundColor Red
}

# Copy NPRPC DLL
$NPRPCPath = Join-Path $BuildDir $BuildType "nprpc.dll"
Copy-Item $NPRPCPath $PackageDir
Write-Host "  Copied: nprpc.dll" -ForegroundColor Gray
# Copy NPLIB DLL
$NPLIBPath = Join-Path $BuildDir $BuildType "nplib.dll"
Copy-Item $NPLIBPath $PackageDir
Write-Host "  Copied: nplib.dll" -ForegroundColor Gray
# We do not depend on Boost DLLs in this project

# Create launcher batch file
$LauncherContent = @"
@echo off
REM NSCalc Proxy Client Launcher
REM This script sets up the environment and launches the proxy client

REM Add current directory to PATH for DLL loading
set PATH=%~dp0;%PATH%

REM Launch the application
"%~dp0proxy_client.exe" %*
"@

$LauncherPath = Join-Path $PackageDir "start_proxy_client.bat"
Set-Content -Path $LauncherPath -Value $LauncherContent

# Create uninstaller
$UninstallerContent = @"
@echo off
echo Uninstalling NSCalc Proxy Client...
echo.
echo This will remove the proxy client from your system.
echo Press any key to continue or close this window to cancel.
pause > nul

REM Remove desktop shortcut if it exists
if exist "%USERPROFILE%\Desktop\NSCalc Proxy Client.lnk" (
    del "%USERPROFILE%\Desktop\NSCalc Proxy Client.lnk"
    echo Desktop shortcut removed.
)

REM Remove start menu shortcut if it exists
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\NSCalc Proxy Client.lnk" (
    del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\NSCalc Proxy Client.lnk"
    echo Start menu shortcut removed.
)

echo.
echo NSCalc Proxy Client has been removed.
echo You can safely delete this folder now.
echo.
pause
"@

$UninstallerPath = Join-Path $PackageDir "uninstall.bat"
Set-Content -Path $UninstallerPath -Value $UninstallerContent

# Create README
$ReadmeContent = @"
NSCalc Proxy Client for Windows
===============================

Installation:
1. Extract this package to your desired location (e.g., C:\Program Files\NSCalc Proxy Client\)
2. Run 'start_proxy_client.bat' to launch the application
3. Configure your connection settings in the GUI
4. Click Connect to establish SOCKS5 proxy on port 1080

System Requirements:
- Windows 10 or later
- Visual C++ Redistributable 2022 (usually already installed)
- Network access to NSCalc server

Using the SOCKS5 Proxy:
Once connected, configure your applications to use:
- Proxy Type: SOCKS5
- Host: 127.0.0.1
- Port: 1080

Uninstallation:
Run 'uninstall.bat' to remove shortcuts, then delete this folder.

Support:
- Email: nikitapnn1@gmail.com
- Project: https://github.com/your-repo/nscalc

Version: 1.0.0
Build Date: $(Get-Date -Format 'yyyy-MM-dd')
"@

$ReadmePath = Join-Path $PackageDir "README.txt"
Set-Content -Path $ReadmePath -Value $ReadmeContent

# Create ZIP package
Write-Host "📦 Creating ZIP package..." -ForegroundColor Green
$ZipPath = Join-Path $BuildDir "nscalc-proxy-client-windows.zip"
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}

# Use PowerShell's Compress-Archive
Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipPath

Write-Host ""
Write-Host "🎉 Windows packaging complete!" -ForegroundColor Green
Write-Host "📦 Package location: $ZipPath" -ForegroundColor Cyan
Write-Host "📁 Package directory: $PackageDir" -ForegroundColor Cyan

# Display package contents
Write-Host ""
Write-Host "📋 Package Contents:" -ForegroundColor Yellow
Get-ChildItem $PackageDir | ForEach-Object {
    Write-Host "   $($_.Name)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Your Windows application is ready for distribution!" -ForegroundColor Green
