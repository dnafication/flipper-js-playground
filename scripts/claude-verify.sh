#!/bin/sh
# Claude Code Stop hook: don't let a turn end while checks or the build fail.
# Exit 2 sends the output back to Claude so it fixes the problem.
cd "$(dirname "$0")/.." || exit 0

# stop_hook_active is true when we already blocked once this turn; don't loop
if grep -q '"stop_hook_active": *true'; then
    exit 0
fi

if ! out=$(pnpm run --silent verify 2>&1); then
    echo "verify failed (pnpm run verify):" >&2
    echo "$out" | tail -40 >&2
    exit 2
fi
