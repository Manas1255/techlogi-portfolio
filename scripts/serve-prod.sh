#!/usr/bin/env bash
# Serve a production build on a known port, reliably.
#
# `pkill -f "next start"` does NOT work: once running, the process is named
# `next-server`, so the old one survives, the new one dies with EADDRINUSE, and
# you spend the next hour testing a stale build. Kill by PORT, wait for the
# socket to be released, then confirm the new server is actually ready.
set -euo pipefail
PORT="${1:-3200}"
LOG="${2:-/tmp/ga-studio-prod-$PORT.log}"

lsof -ti:"$PORT" 2>/dev/null | xargs -r kill -9 2>/dev/null || true
for _ in $(seq 1 20); do
  [ -z "$(lsof -ti:"$PORT" 2>/dev/null)" ] && break
  sleep 0.5
done
if [ -n "$(lsof -ti:"$PORT" 2>/dev/null)" ]; then
  echo "port $PORT is still held; refusing to start a second server" >&2
  exit 1
fi

rm -f "$LOG"
(npm run start -- -p "$PORT" > "$LOG" 2>&1 &)
for _ in $(seq 1 60); do
  grep -q "Ready in" "$LOG" 2>/dev/null && { echo "serving on http://localhost:$PORT"; exit 0; }
  grep -qi "EADDRINUSE\|Failed to start" "$LOG" 2>/dev/null && { echo "failed to start:" >&2; tail -5 "$LOG" >&2; exit 1; }
  sleep 0.5
done
echo "timed out waiting for the server" >&2; tail -5 "$LOG" >&2; exit 1
