#!/bin/sh
set -e

echo "Running database migrations..."
node_modules/.bin/prisma migrate deploy

echo "Syncing seed accounts..."
node_modules/.bin/tsx prisma/seed.ts

echo "Starting application..."
exec "$@"
