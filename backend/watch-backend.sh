#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
  if [[ -n "${AUTH_SERVICE_PID:-}" ]]; then kill "$AUTH_SERVICE_PID" >/dev/null 2>&1 || true; fi
  if [[ -n "${USER_SERVICE_PID:-}" ]]; then kill "$USER_SERVICE_PID" >/dev/null 2>&1 || true; fi
  if [[ -n "${GOALS_SERVICE_PID:-}" ]]; then kill "$GOALS_SERVICE_PID" >/dev/null 2>&1 || true; fi
  if [[ -n "${ANALYTICS_SERVICE_PID:-}" ]]; then kill "$ANALYTICS_SERVICE_PID" >/dev/null 2>&1 || true; fi
  if [[ -n "${GAMIFICATION_SERVICE_PID:-}" ]]; then kill "$GAMIFICATION_SERVICE_PID" >/dev/null 2>&1 || true; fi
  if [[ -n "${API_GATEWAY_PID:-}" ]]; then kill "$API_GATEWAY_PID" >/dev/null 2>&1 || true; fi
  if [[ -n "${GOALS_PRISMA_WATCHER_PID:-}" ]]; then kill "$GOALS_PRISMA_WATCHER_PID" >/dev/null 2>&1 || true; fi
}

trap cleanup EXIT INT TERM

cd "$ROOT_DIR"

if [[ ! -f ".env" ]]; then
  cp .env.example .env
fi

restart_goals_service() {
  echo "Goals Prisma/seed files changed. Regenerating, pushing schema, reseeding and restarting goals-service..."

  npm run prisma:generate
  npm run prisma:push
  npm run seed:all

  if [[ -n "${GOALS_SERVICE_PID:-}" ]]; then
    kill "$GOALS_SERVICE_PID" >/dev/null 2>&1 || true
    wait "$GOALS_SERVICE_PID" 2>/dev/null || true
  fi

  echo "Starting goals-service..."
  npm run dev:goals-service &
  GOALS_SERVICE_PID=$!

  echo "goals-service restarted."
}

compute_goals_prisma_hash() {
  find "$ROOT_DIR/goals-service/prisma" -type f \( -name '*.ts' -o -name '*.prisma' \) -print0 \
    | sort -z \
    | xargs -0 shasum \
    | shasum \
    | awk '{ print $1 }'
}

echo "Starting PostgreSQL and Redis..."
npm run infra:up

echo "Waiting for PostgreSQL to accept connections..."
until docker compose -f docker-compose.yml exec -T postgres pg_isready -U postgres >/dev/null 2>&1; do
  sleep 2
done

echo "Generating Prisma clients..."
npm run prisma:generate

echo "Pushing Prisma schema..."
npm run prisma:push

echo "Seeding prototype data..."
npm run seed:all

echo "Starting user-service..."
npm run dev:user-service &
USER_SERVICE_PID=$!

echo "Starting auth-service..."
npm run dev:auth-service &
AUTH_SERVICE_PID=$!

echo "Starting goals-service..."
npm run dev:goals-service &
GOALS_SERVICE_PID=$!

echo "Watching goals-service Prisma and seed files for changes..."
(
  LAST_GOALS_PRISMA_HASH="$(compute_goals_prisma_hash)"
  while true; do
    sleep 2
    CURRENT_GOALS_PRISMA_HASH="$(compute_goals_prisma_hash)"
    if [[ "$CURRENT_GOALS_PRISMA_HASH" != "$LAST_GOALS_PRISMA_HASH" ]]; then
      LAST_GOALS_PRISMA_HASH="$CURRENT_GOALS_PRISMA_HASH"
      restart_goals_service
    fi
  done
) &
GOALS_PRISMA_WATCHER_PID=$!

echo "Starting analytics-service..."
npm run dev:analytics-service &
ANALYTICS_SERVICE_PID=$!

echo "Starting gamification-service..."
npm run dev:gamification-service &
GAMIFICATION_SERVICE_PID=$!

echo "Starting api-gateway..."
npm run dev:api-gateway &
API_GATEWAY_PID=$!

echo "Backend is starting."
echo "Scriptet har kört: infra, prisma generate, prisma push, seed:all och alla tjänster."
echo "Auth start endpoint: http://localhost:3005/auth/google/start"
echo "Profile endpoint: http://localhost:3000/api/profile/demo-auth-user-1"
echo "Goals endpoint: http://localhost:3000/api/goals/demo-auth-user-1"
echo "Goal templates endpoint: http://localhost:3000/api/goals/templates/list"
echo "Press Ctrl+C to stop the services started by this script."

wait "$AUTH_SERVICE_PID" \
     "$USER_SERVICE_PID" \
     "$GOALS_SERVICE_PID" \
     "$ANALYTICS_SERVICE_PID" \
     "$GAMIFICATION_SERVICE_PID" \
     "$API_GATEWAY_PID" \
     "$GOALS_PRISMA_WATCHER_PID"
