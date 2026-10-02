@echo off
setlocal
cd /d "%~dp0.." || exit /b 1
node script\dev.mjs %*
exit /b %errorlevel%
