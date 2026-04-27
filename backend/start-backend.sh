#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
  if [[ -n "${USER_SERVICE_PID:-}" ]]; then
    kill "$USER_SERVICE_PID" >/dev/null 2>&1 || true
  fi

  if [[ -n "${API_GATEWAY_PID:-}" ]]; then
    kill "$API_GATEWAY_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

cd "$ROOT_DIR"

if [[ ! -f ".env" ]]; then
  cp .env.example .env
fi

echo "Starting PostgreSQL and Redis..."
npm run infra:up

echo "Waiting for PostgreSQL to accept connections..."
until docker compose -f docker-compose.yml exec -T postgres pg_isready -U postgres >/dev/null 2>&1; do
  sleep 2
done

echo "Pushing Prisma schema..."
npm run prisma:push

echo "Seeding user-service..."
npm run seed:user

echo "Starting user-service..."
npm run dev:user-service &
USER_SERVICE_PID=$!

echo "Starting api-gateway..."
npm run dev:api-gateway &
API_GATEWAY_PID=$!

echo "Backend is starting."
echo "Profile endpoint: http://localhost:3000/api/profile"
echo "Press Ctrl+C to stop the services started by this script."

wait "$USER_SERVICE_PID" "$API_GATEWAY_PID"
