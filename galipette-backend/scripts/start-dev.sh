#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 3

# Generate Prisma client (needed because volumes override build-time generation)
echo "Generating Prisma client..."
npx prisma generate --schema=./galipette-backend/prisma/schema.prisma

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy --schema=./galipette-backend/prisma/schema.prisma

# Start the development server
echo "Starting development server..."
npm run dev --workspace=galipette-backend
