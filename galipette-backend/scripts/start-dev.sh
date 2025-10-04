#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 3

# Generate Prisma client (needed because volumes override build-time generation)
echo "Generating Prisma client..."
npm exec --workspace=galipette-backend -- prisma generate

# Run migrations
echo "Running database migrations..."
npm exec --workspace=galipette-backend -- prisma migrate deploy

# Start the development server
echo "Starting development server..."
npm run dev --workspace=galipette-backend
