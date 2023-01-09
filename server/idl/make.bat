@echo off
setlocal
cd /d %~dp0

npidl ^
	--out-ts-dir \\wsl$\Arch\home\nikita\projects\npk-calculator\client\src\rpc ^
	--gen-ts 1 ^
	--out-src-dir ..\src ^
	--out-inc-dir ..\src ^
	.\npkcalc.npidl

	pause