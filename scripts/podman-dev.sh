#!/bin/bash

# Podman development scripts for Galipette Cendree Platform

case "$1" in
  "all")
    echo "Starting all services (frontend + backend + database)..."
    podman-compose -f docker-compose.dev.yml up --build
    ;;
  "frontend")
    echo "Starting frontend only..."
    podman-compose -f docker-compose.frontend.yml up --build
    ;;
  "backend")
    echo "Starting backend + database..."
    podman-compose -f docker-compose.backend.yml up --build
    ;;
  "stop")
    echo "Stopping all services..."
    podman-compose -f docker-compose.dev.yml down
    podman-compose -f docker-compose.frontend.yml down
    podman-compose -f docker-compose.backend.yml down
    ;;
  "clean")
    echo "Cleaning up containers and volumes..."
    podman-compose -f docker-compose.dev.yml down -v --remove-orphans
    podman-compose -f docker-compose.frontend.yml down -v --remove-orphans
    podman-compose -f docker-compose.backend.yml down -v --remove-orphans
    podman system prune -f
    ;;
  *)
    echo "Usage: $0 {all|frontend|backend|stop|clean}"
    echo ""
    echo "Commands:"
    echo "  all       - Start all services (frontend + backend + database)"
    echo "  frontend  - Start frontend only"
    echo "  backend   - Start backend + database"
    echo "  stop      - Stop all services"
    echo "  clean     - Stop all services and clean up volumes"
    exit 1
    ;;
esac
