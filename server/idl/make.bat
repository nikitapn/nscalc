@echo off
setlocal
cd /d %~dp0

npidl ^
	--out-ts-dir \\wsl$\Debian\home\png\projects\npk-calculator\client\src ^
	--out-src-dir ..\src ^
	--out-inc-dir ..\src ^
	.\npkcalc.npidl