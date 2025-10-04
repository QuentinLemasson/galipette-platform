# Development Container Setup for Galipette Cendree Platform

This document explains the **development-only** containerization setup for the Galipette Cendree Platform monorepo using Docker Desktop and Docker Compose.

> **Note**: This setup is optimized for development only. Production deployment configs will be added separately when needed.

## Overview

The platform is a monorepo npm workspace with the following structure:

```
galipette-cendree-platform/
├── galipette-backend/     # Backend API server (Node.js/Express/Prisma)
├── galipette-portal/      # Frontend React application (Vite/React/TailwindCSS)
├── galipette-shared-lib/  # Shared TypeScript types and utilities
└── package.json          # Root workspace configuration
```

## Prerequisites

- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Windows**: Docker Desktop with WSL2 backend
- **macOS/Linux**: Docker Desktop

## Container Architecture

### Development Services

1. **PostgreSQL Database** (`postgres:15-alpine`) - Development database
2. **Backend API** (`galipette-backend-dev`) - Node.js dev server with hot reload
3. **Frontend Portal** (`galipette-frontend-dev`) - Vite dev server with hot reload

### Compose Files

| File                          | Purpose                  | Services                     |
| ----------------------------- | ------------------------ | ---------------------------- |
| `docker-compose.yml`          | Default full stack (dev) | All services with hot reload |
| `docker-compose.dev.yml`      | Explicit dev full stack  | All services with hot reload |
| `docker-compose.frontend.yml` | Frontend only            | Frontend service only        |
| `docker-compose.backend.yml`  | Backend + DB only        | Backend + Database           |

## Usage

### Quick Start Scripts

#### Windows PowerShell

```powershell
# Start all services (development)
.\scripts\docker-dev.ps1 all

# Start frontend only
.\scripts\docker-dev.ps1 frontend

# Start backend only (includes database)
.\scripts\docker-dev.ps1 backend

# Stop all services
.\scripts\docker-dev.ps1 stop

# Clean up everything
.\scripts\docker-dev.ps1 clean
```

#### Linux/macOS

```bash
# Make script executable (first time only)
chmod +x scripts/docker-dev.sh

# Start all services (development)
./scripts/docker-dev.sh all

# Start frontend only
./scripts/docker-dev.sh frontend

# Start backend only (includes database)
./scripts/docker-dev.sh backend

# Stop all services
./scripts/docker-dev.sh stop

# Clean up everything
./scripts/docker-dev.sh clean
```

### Manual Docker Compose Commands

#### Start Everything (Development)

```bash
docker-compose -f docker-compose.dev.yml up --build
```

#### Start Frontend Only

```bash
docker-compose -f docker-compose.frontend.yml up --build
```

#### Start Backend Only

```bash
docker-compose -f docker-compose.backend.yml up --build
```

#### Default Compose (Full Stack)

```bash
# Using default docker-compose.yml
docker-compose up --build
```

## Ports and Services

| Service  | Port | Description              |
| -------- | ---- | ------------------------ |
| Frontend | 5173 | Vite dev server with HMR |
| Backend  | 3000 | Express API server       |
| Database | 5432 | PostgreSQL database      |

## Key Features

### 1. Monorepo TypeScript Configuration

- **tsconfig.base.json**: Shared TypeScript configuration mounted in all containers
- **Path Aliases**: Complex alias system works correctly (`@shared/*`, `@/app/*`, etc.)
- **Hot Reload**: Changes to shared library immediately reflect in both services

### 2. Service-Specific Dockerfiles

- **Backend**: `galipette-backend/Dockerfile.dev` (Node 20-alpine + Prisma)
- **Frontend**: `galipette-portal/Dockerfile.dev` (Node 20-alpine + Vite)
- **Consistent Base**: Both use `node:20-alpine` for lightweight containers

### 3. Smart Volume Management

- **Node Modules**: Isolated named volumes preserve Linux-compiled binaries
- **Source Code**: Real-time mounts enable instant hot reload
- **TypeScript Config**: Mounted separately for proper alias resolution
- **Database**: Persistent volumes maintain data between restarts

### 4. Development Workflow

- **Hot Reload**: File changes trigger automatic rebuilds
- **Fast Startup**: Containers reuse cached layers and volumes
- **Isolated Environment**: No conflicts with host Node.js/npm versions
- **Easy Debugging**: Direct access to logs and containers

## Development Workflow

### 1. Full Stack Development

```bash
# Start everything
./scripts/docker-dev.sh all

# Access services:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - Database: localhost:5432
```

### 2. Frontend-Only Development

```bash
# Start frontend only (assumes backend running elsewhere)
./scripts/docker-dev.sh frontend

# Access frontend: http://localhost:5173
```

### 3. Backend-Only Development

```bash
# Start backend + database
./scripts/docker-dev.sh backend

# Access backend API: http://localhost:3000
```

## Environment Variables

### Backend Environment

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/galipette_db?schema=public
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

### Frontend Environment

```env
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3000, 5173, and 5432 are available
   - Use `docker-compose down` to stop services
   - Check running processes: `netstat -ano | findstr "3000"` (Windows) or `lsof -i :3000` (Linux/macOS)

2. **Volume Issues**
   - Use `./scripts/docker-dev.sh clean` to reset volumes
   - Check volume mounts in docker-compose files
   - List volumes: `docker volume ls`

3. **Build Failures**
   - Clear Docker build cache: `docker builder prune`
   - Rebuild without cache: `docker-compose -f docker-compose.dev.yml build --no-cache`
   - Check Docker Desktop is running

4. **TypeScript Alias Errors**
   - Ensure `tsconfig.base.json` is mounted (check compose files)
   - Verify the file exists in project root
   - Restart containers after tsconfig changes

5. **Native Module Errors**
   - Clean volumes and rebuild: `./scripts/docker-dev.sh clean` then start again
   - Docker will recompile native modules for Linux

### Debugging Commands

```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs

# View specific service logs
docker-compose -f docker-compose.dev.yml logs frontend
docker-compose -f docker-compose.dev.yml logs backend

# Follow logs in real-time
docker-compose -f docker-compose.dev.yml logs -f

# Execute commands in running container
docker-compose -f docker-compose.dev.yml exec backend sh
docker-compose -f docker-compose.dev.yml exec frontend sh

# Check container status
docker-compose -f docker-compose.dev.yml ps

# View resource usage
docker stats

# Inspect volumes
docker volume inspect galipette-cendree-platform_frontend_node_modules_dev
```

## File Structure

```
galipette-cendree-platform/
├── docker-compose.yml              # Default full stack (dev)
├── docker-compose.dev.yml          # Explicit dev full stack
├── docker-compose.frontend.yml     # Frontend only
├── docker-compose.backend.yml      # Backend + DB only
├── scripts/
│   ├── docker-dev.sh              # Linux/macOS helper scripts
│   ├── docker-dev.ps1             # Windows PowerShell helper scripts
│   ├── podman-dev.sh              # Legacy Podman scripts (if needed)
│   └── podman-dev.ps1             # Legacy Podman scripts (if needed)
├── galipette-backend/
│   ├── Dockerfile.dev             # Backend dev container
│   ├── prisma/                    # Database schema
│   └── src/                       # Backend source code
├── galipette-portal/
│   ├── Dockerfile.dev             # Frontend dev container
│   ├── src/                       # Frontend source code
│   └── vite.config.ts             # Vite configuration
├── galipette-shared-lib/
│   └── types/                     # Shared TypeScript types
└── tsconfig.base.json             # Shared TS config (mounted in containers)
```

## Important Files for Containers

### Required in Build Context

- `package.json` / `package-lock.json` - Workspace dependencies
- `tsconfig.base.json` - TypeScript configuration with path aliases
- Service-specific `package.json` files in each workspace

### Volume Mounts (Development)

All compose files mount these for hot reload:

- Source code directories (`galipette-backend/`, `galipette-portal/`, `galipette-shared-lib/`)
- `tsconfig.base.json` - Required for TypeScript path alias resolution
- `package.json` / `package-lock.json` - For npm workspace awareness
- Named volumes for `node_modules/` - Preserves Linux-compiled binaries

## Docker Desktop Integration

### Docker Desktop Features

When using Docker Desktop, you can:

1. **Visual Container Management**
   - View all running containers in the Docker Desktop GUI
   - Monitor resource usage and logs
   - Manage container lifecycle through the interface

2. **Volume Management**
   - View and manage volumes through the GUI
   - Easy cleanup of unused volumes
   - Volume inspection and backup

3. **Network Management**
   - Visual network topology
   - Easy port forwarding configuration
   - Network troubleshooting tools

4. **Image Management**
   - Browse and manage container images
   - Build and push images through the GUI
   - Image layer inspection

### Docker Desktop Commands

```bash
# Check Docker status
docker version
docker info

# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View images
docker images

# View volumes
docker volume ls

# View networks
docker network ls

# Clean up unused resources
docker system prune -a
```

## Performance Tips

### Windows (WSL2)

- Ensure WSL2 is updated: `wsl --update`
- Keep source code in WSL2 filesystem for better performance
- Configure Docker Desktop resource limits in Settings

### macOS

- Use VirtioFS for better file sharing performance (Settings > General > VirtioFS)
- Configure resource limits in Settings > Resources
- Keep Docker Desktop updated

### General

- Use named volumes for `node_modules` (already configured)
- Minimize file watches in development tools
- Use `.dockerignore` to exclude unnecessary files (dist/, node_modules/)

## Migration from Podman

If you previously used Podman:

1. All compose files remain unchanged
2. Replace `podman-compose` with `docker-compose` in commands
3. Use the new `docker-dev.ps1` / `docker-dev.sh` scripts
4. Old `podman-dev.*` scripts are kept for reference but not needed

The setup is identical - only the runtime changed!

---

This setup provides maximum flexibility for development with reliable hot-reload, proper TypeScript alias support, and clean container management through Docker Desktop.
