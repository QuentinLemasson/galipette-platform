#!/bin/sh

# Install platform-specific LightningCSS binary for Debian/glibc
# This is needed because optional dependencies may not be in the volume
echo "Installing LightningCSS for Debian Linux (glibc)..."
npm install --no-save --workspace=galipette-portal lightningcss-linux-x64-gnu

# Rebuild other native modules (esbuild, etc.)
echo "Rebuilding native modules..."
npm rebuild --workspace=galipette-portal

# Start the development server
echo "Starting Vite development server..."
npm run dev --workspace=galipette-portal
