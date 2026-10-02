#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
pnpm check
pnpm build
echo "Build ready in $PWD/dist. Upload dist to your hosting provider."
