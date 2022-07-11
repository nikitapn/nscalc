@echo off
setlocal
cd /d %~dp0

npidl ^
	--out-ts-dir \\wsl$\Debian\home\png\projects\npk-calculator\client\src\rpc ^
	--gen-ts 1 ^
	--out-src-dir ..\src ^
	--out-inc-dir ..\src ^
	.\npkcalc.npidl