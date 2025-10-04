#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
npx prisma migrate deploy

# Start the development server
echo "Starting development server..."
npm run dev
