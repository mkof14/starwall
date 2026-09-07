#!/usr/bin/env bash
# Keep StarWall reachable: local Next.js (+ Postgres) and a Cloudflare tunnel.
# Restarts any piece that dies. Writes the public URL to /tmp/starwall-public-url.txt
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${STARWALL_PORT:-3000}"
URL_FILE="${STARWALL_URL_FILE:-/tmp/starwall-public-url.txt}"
CF_LOG="${STARWALL_CF_LOG:-/tmp/starwall-cf.log}"

adopt_tunnel_pid() {
  local pid
  pid="$(pgrep -x cloudflared | head -n 1 || true)"
  if [ -n "$pid" ]; then
    echo "$pid" > /tmp/starwall-cf.pid
    return 0
  fi
  return 1
}

start_tunnel() {
  if adopt_tunnel_pid && kill -0 "$(cat /tmp/starwall-cf.pid)" 2>/dev/null; then
    echo "[keep-up] cloudflared already running (pid $(cat /tmp/starwall-cf.pid))"
    return 0
  fi
  echo "[keep-up] starting cloudflared quick tunnel"
  : >"$CF_LOG"
  nohup cloudflared tunnel --url "http://127.0.0.1:${PORT}" --no-autoupdate >>"$CF_LOG" 2>&1 &
  echo $! > /tmp/starwall-cf.pid
}

capture_public_url() {
  local url
  url="$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$CF_LOG" 2>/dev/null | tail -n 1 || true)"
  if [ -n "$url" ]; then
    echo "$url" >"$URL_FILE"
  fi
}

tunnel_alive() {
  local pid
  pid="$(cat /tmp/starwall-cf.pid 2>/dev/null || true)"
  [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null
}

echo "[keep-up] StarWall supervisor starting in $ROOT"
bash "$ROOT/scripts/ensure-site.sh"
start_tunnel
capture_public_url

echo "[keep-up] watching (Ctrl+C stops this supervisor, not the site)"
while true; do
  bash "$ROOT/scripts/ensure-site.sh" >/tmp/starwall-ensure.log 2>&1 || true
  if ! tunnel_alive; then
    echo "[keep-up] tunnel down — restarting"
    start_tunnel
  fi
  capture_public_url
  sleep 8
done
