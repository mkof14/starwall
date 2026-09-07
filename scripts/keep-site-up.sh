#!/usr/bin/env bash
# Keep StarWall reachable: Postgres + next start + Cloudflare quick tunnel.
# Restarts any piece that dies. Writes the public URL to /tmp/starwall-public-url.txt
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${STARWALL_PORT:-3000}"
HOST="${STARWALL_HOST:-0.0.0.0}"
URL_FILE="${STARWALL_URL_FILE:-/tmp/starwall-public-url.txt}"
NEXT_LOG="${STARWALL_NEXT_LOG:-/tmp/starwall-next.log}"
CF_LOG="${STARWALL_CF_LOG:-/tmp/starwall-cf.log}"
PG_LOG="${STARWALL_PG_LOG:-/tmp/starwall-pg.log}"

export DATABASE_URL="${DATABASE_URL:-postgresql://starwall:starwall@127.0.0.1:5432/starwall}"
export NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-starwall-dev-secret-not-for-production}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-http://127.0.0.1:${PORT}}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://127.0.0.1:${PORT}}"

ensure_postgres() {
  if pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
    return 0
  fi
  echo "[keep-up] starting Postgres…" | tee -a "$PG_LOG"
  if command -v pg_isready >/dev/null 2>&1; then
    sudo pg_ctlcluster 16 main start >>"$PG_LOG" 2>&1 || sudo service postgresql start >>"$PG_LOG" 2>&1 || true
  fi
  for _ in 1 2 3 4 5 6 7 8; do
    pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1 && return 0
    sleep 1
  done
  echo "[keep-up] WARN: Postgres not ready — Next will still serve marketing pages." | tee -a "$PG_LOG"
}

ensure_build() {
  if [ ! -f "$ROOT/.next/BUILD_ID" ]; then
    echo "[keep-up] building Next.js…"
    npm run build
  fi
}

next_alive() {
  curl -sf -o /dev/null --max-time 3 "http://127.0.0.1:${PORT}/" && return 0
  return 1
}

adopt_next_pid() {
  local pid
  pid="$(pgrep -f "next start -H ${HOST} -p ${PORT}" | head -n 1 || true)"
  if [ -n "$pid" ]; then
    echo "$pid" > /tmp/starwall-next.pid
  fi
}

start_next() {
  if next_alive; then
    adopt_next_pid
    echo "[keep-up] Next.js already answering on :${PORT}"
    return 0
  fi
  echo "[keep-up] starting next start on :${PORT}"
  nohup npx next start -H "$HOST" -p "$PORT" >>"$NEXT_LOG" 2>&1 &
  echo $! > /tmp/starwall-next.pid
  for _ in $(seq 1 40); do
    next_alive && return 0
    sleep 0.5
  done
  echo "[keep-up] WARN: next start did not answer yet" >&2
}

adopt_tunnel_pid() {
  local pid
  pid="$(pgrep -f "cloudflared tunnel --url http://127.0.0.1:${PORT}" | head -n 1 || true)"
  if [ -n "$pid" ]; then
    echo "$pid" > /tmp/starwall-cf.pid
    return 0
  fi
  return 1
}

start_tunnel() {
  if adopt_tunnel_pid; then
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
ensure_postgres
ensure_build

if ! next_alive; then
  start_next
fi
if ! tunnel_alive; then
  start_tunnel
fi

echo "[keep-up] watching (Ctrl+C stops this supervisor, not the site)"
while true; do
  if ! next_alive; then
    echo "[keep-up] Next.js down — restarting"
    start_next
  fi
  if ! tunnel_alive; then
    echo "[keep-up] tunnel down — restarting"
    start_tunnel
  fi
  capture_public_url
  sleep 8
done
