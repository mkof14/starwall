#!/usr/bin/env bash
# Bring StarWall up locally and exit when it answers.
# Idempotent: safe to run from environment start, cron, or the supervisor.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HOST="${STARWALL_HOST:-0.0.0.0}"
PORTS="${STARWALL_PORTS:-3000 43180}"
NEXT_LOG="${STARWALL_NEXT_LOG:-/tmp/starwall-next.log}"
PG_LOG="${STARWALL_PG_LOG:-/tmp/starwall-pg.log}"

export DATABASE_URL="${DATABASE_URL:-postgresql://starwall:starwall@127.0.0.1:5432/starwall}"
export NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-starwall-dev-secret-not-for-production}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-http://127.0.0.1:3000}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://127.0.0.1:3000}"

alive() {
  local port="$1"
  curl -sf -o /dev/null --max-time 3 "http://127.0.0.1:${port}/"
}

ensure_postgres() {
  if pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
    return 0
  fi
  echo "[ensure] starting Postgres…" | tee -a "$PG_LOG"
  sudo pg_ctlcluster 16 main start >>"$PG_LOG" 2>&1 || sudo service postgresql start >>"$PG_LOG" 2>&1 || true
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1 && return 0
    sleep 1
  done
  echo "[ensure] WARN: Postgres not ready — marketing pages still serve." | tee -a "$PG_LOG"
}

ensure_deps() {
  if [ ! -d "$ROOT/node_modules/next" ]; then
    echo "[ensure] installing npm packages…"
    npm ci
  fi
}

ensure_build() {
  if [ ! -f "$ROOT/.next/BUILD_ID" ]; then
    echo "[ensure] building Next.js…"
    npm run build
  fi
}

start_port() {
  local port="$1"
  if alive "$port"; then
    echo "[ensure] already up on :${port}"
    return 0
  fi
  echo "[ensure] starting next start on :${port}"
  nohup npx next start -H "$HOST" -p "$port" >>"$NEXT_LOG" 2>&1 &
  local i
  for i in $(seq 1 40); do
    alive "$port" && return 0
    sleep 0.5
  done
  echo "[ensure] WARN: :${port} did not answer yet" >&2
  return 1
}

ensure_postgres
ensure_deps
ensure_build

ok=0
for port in $PORTS; do
  start_port "$port" && ok=1
done

if [ "$ok" -eq 1 ]; then
  echo "[ensure] StarWall is local at http://127.0.0.1:3000/ and http://127.0.0.1:43180/"
  exit 0
fi

echo "[ensure] StarWall did not come up" >&2
exit 1
