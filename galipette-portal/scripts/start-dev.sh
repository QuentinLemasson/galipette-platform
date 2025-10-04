#!/bin/sh

# Rebuild native modules for Alpine Linux (lightningcss, esbuild, etc.)
# This is needed because volumes might have cached Windows/macOS binaries
echo "Rebuilding native modules for Alpine Linux..."
npm rebuild --workspace=galipette-portal

# Start the development server
echo "Starting Vite development server..."
npm run dev --workspace=galipette-portal

