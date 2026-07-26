#!/usr/bin/env bash

set -e

export NODE_ENV=production

echo "Creating uploads directory..."
mkdir -p public/uploads

echo "Running database migrations..."
npm run migration:run

echo "Starting application..."
exec npm run start:prod