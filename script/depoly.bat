@echo off
setlocal
cd /d "%~dp0.." || exit /b 1
call pnpm check
if errorlevel 1 exit /b %errorlevel%
call pnpm build
if errorlevel 1 exit /b %errorlevel%
echo Build ready in %cd%\dist. Upload dist to your hosting provider.
exit /b 0
