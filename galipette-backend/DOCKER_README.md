# Galipette Backend - Docker Development Environment

This document explains how to set up and use the Docker development environment for the Galipette backend.

## Prerequisites

- Docker Desktop installed and running
- Git (for cloning the repository)

## Quick Start

### 1. Environment Setup

Copy the sample environment file:

```bash
cp sample.env .env
```

### 2. Start Development Environment

**On Windows (PowerShell):**

```powershell
.\dev.ps1 start
```

**On Linux/macOS:**

```bash
./dev.sh start
```

**Or using Docker Compose directly:**

```bash
docker-compose up -d
```

### 3. Database Setup

After starting the services, run the database migrations:

```bash
# Using the development script
.\dev.ps1 migrate    # Windows
./dev.sh migrate     # Linux/macOS

# Or directly with Docker Compose
docker-compose exec backend npx prisma migrate dev
```

## Available Services

- **Backend API**: http://localhost:3000
- **PostgreSQL Database**: localhost:5432
  - Database: `galipette_db`
  - Username: `postgres`
  - Password: `postgres`

## Development Scripts

### Windows (PowerShell)

```powershell
.\dev.ps1 start      # Start all services
.\dev.ps1 stop       # Stop all services
.\dev.ps1 restart    # Restart all services
.\dev.ps1 logs       # Show logs from all services
.\dev.ps1 db         # Connect to PostgreSQL database
.\dev.ps1 migrate    # Run database migrations
.\dev.ps1 reset      # Reset database and restart services
.\dev.ps1 clean      # Clean up Docker containers and volumes
```

### Linux/macOS (Bash)

```bash
./dev.sh start       # Start all services
./dev.sh stop        # Stop all services
./dev.sh restart     # Restart all services
./dev.sh logs        # Show logs from all services
./dev.sh db          # Connect to PostgreSQL database
./dev.sh migrate     # Run database migrations
./dev.sh reset       # Reset database and restart services
./dev.sh clean       # Clean up Docker containers and volumes
```

## Environment Variables

The development environment uses the following configuration:

- `DATABASE_URL`: `postgresql://postgres:postgres@postgres:5432/galipette_db?schema=public`
- `PORT`: `3000`
- `NODE_ENV`: `development`
- `CORS_ORIGIN`: `http://localhost:5173`

## Database Management

### Connect to Database

```bash
# Using the development script
.\dev.ps1 db         # Windows
./dev.sh db          # Linux/macOS

# Or directly
docker-compose exec postgres psql -U postgres -d galipette_db
```

### Reset Database

```bash
# Using the development script
.\dev.ps1 reset     # Windows
./dev.sh reset       # Linux/macOS

# Or manually
docker-compose down -v
docker-compose up -d
```

### View Database Schema

```bash
docker-compose exec backend npx prisma studio
```

## Troubleshooting

### Port Conflicts

If you get port conflicts, you can modify the ports in `docker-compose.yml`:

```yaml
ports:
  - '3001:3000' # Change 3000 to 3001 on the left side
```

### Database Connection Issues

1. Ensure PostgreSQL container is running: `docker-compose ps`
2. Check logs: `docker-compose logs postgres`
3. Verify environment variables in `.env` file

### Clean Restart

If you encounter issues, try a clean restart:

```bash
# Using the development script
.\dev.ps1 clean      # Windows
./dev.sh clean       # Linux/macOS

# Then start again
.\dev.ps1 start      # Windows
./dev.sh start       # Linux/macOS
```

## File Structure

```
galipette-backend/
├── docker-compose.yml      # Docker services configuration
├── Dockerfile.dev          # Development Dockerfile for backend
├── .dockerignore          # Files to ignore in Docker build
├── dev.ps1                # Windows development script
├── dev.sh                 # Linux/macOS development script
├── sample.env             # Environment variables template
└── DOCKER_README.md       # This file
```

## Development Workflow

1. **Start the environment**: `.\dev.ps1 start` (Windows) or `./dev.sh start` (Linux/macOS)
2. **Make code changes**: Edit files in your IDE
3. **View logs**: `.\dev.ps1 logs` (Windows) or `./dev.sh logs` (Linux/macOS)
4. **Run migrations**: `.\dev.ps1 migrate` (Windows) or `./dev.sh migrate` (Linux/macOS)
5. **Test API**: Visit http://localhost:3000
6. **Stop when done**: `.\dev.ps1 stop` (Windows) or `./dev.sh stop` (Linux/macOS)

## Notes

- The backend service uses volume mounting for hot reloading during development
- Database data persists in a Docker volume named `postgres_data`
- The development environment is configured for the frontend running on port 5173
- All services are connected via a Docker network named `galipette-network`

