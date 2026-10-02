@echo off
setlocal
cd /d "%~dp0.." || exit /b 1
where node >nul 2>&1 || (echo [ERROR] Install Node.js 22 LTS or newer first. & exit /b 1)
where pnpm >nul 2>&1 || (echo [ERROR] Install pnpm first: npm install -g pnpm@9.14.4 & exit /b 1)
call pnpm install --frozen-lockfile --offline=false
exit /b %errorlevel%
