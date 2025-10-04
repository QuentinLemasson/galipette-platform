# Docker development scripts for Galipette Cendree Platform (PowerShell)

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("all", "frontend", "backend", "stop", "clean")]
    [string]$Command
)

# Show help if no command provided
if (-not $Command) {
    Write-Host "Usage: .\scripts\docker-dev.ps1 {all|frontend|backend|stop|clean}" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  all       - Start all services (frontend + backend + database)" -ForegroundColor Gray
    Write-Host "  frontend  - Start frontend only" -ForegroundColor Gray
    Write-Host "  backend   - Start backend + database" -ForegroundColor Gray
    Write-Host "  stop      - Stop all services" -ForegroundColor Gray
    Write-Host "  clean     - Stop all services and clean up volumes" -ForegroundColor Gray
    exit 1
}

switch ($Command) {
    "all" {
        Write-Host "Starting all services (frontend + backend + database)..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml up --build
    }
    "frontend" {
        Write-Host "Starting frontend only..." -ForegroundColor Green
        docker-compose -f docker-compose.frontend.yml up --build
    }
    "backend" {
        Write-Host "Starting backend + database..." -ForegroundColor Green
        docker-compose -f docker-compose.backend.yml up --build
    }
    "stop" {
        Write-Host "Stopping all services..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yml down
        docker-compose -f docker-compose.frontend.yml down
        docker-compose -f docker-compose.backend.yml down
    }
    "clean" {
        Write-Host "Cleaning up containers and volumes..." -ForegroundColor Red
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker-compose -f docker-compose.frontend.yml down -v --remove-orphans
        docker-compose -f docker-compose.backend.yml down -v --remove-orphans
        docker system prune -f
    }
}


