#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
command -v node >/dev/null || { echo '[ERROR] Install Node.js 22 LTS or newer first.' >&2; exit 1; }
command -v pnpm >/dev/null || { echo '[ERROR] Install pnpm first: npm install -g pnpm@9.14.4' >&2; exit 1; }
pnpm install --frozen-lockfile --offline=false
