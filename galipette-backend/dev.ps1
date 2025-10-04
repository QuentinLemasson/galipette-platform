# PowerShell script for Galipette Backend Development

# Function to display help
function Show-Help {
    Write-Host "Galipette Backend Development Scripts" -ForegroundColor Green
    Write-Host ""
    Write-Host "Available commands:"
    Write-Host "  start     - Start the development environment (PostgreSQL + Backend)"
    Write-Host "  stop      - Stop the development environment"
    Write-Host "  restart   - Restart the development environment"
    Write-Host "  logs      - Show logs from all services"
    Write-Host "  db        - Connect to PostgreSQL database"
    Write-Host "  migrate   - Run database migrations"
    Write-Host "  reset     - Reset database and restart services"
    Write-Host "  clean     - Clean up Docker containers and volumes"
    Write-Host ""
}

# Function to start services
function Start-Services {
    Write-Host "Starting Galipette development environment..." -ForegroundColor Yellow
    docker-compose up -d
    Write-Host "Services started! Backend available at http://localhost:3000" -ForegroundColor Green
}

# Function to stop services
function Stop-Services {
    Write-Host "Stopping Galipette development environment..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "Services stopped!" -ForegroundColor Green
}

# Function to restart services
function Restart-Services {
    Write-Host "Restarting Galipette development environment..." -ForegroundColor Yellow
    docker-compose down
    docker-compose up -d
    Write-Host "Services restarted!" -ForegroundColor Green
}

# Function to show logs
function Show-Logs {
    docker-compose logs -f
}

# Function to connect to database
function Connect-Database {
    Write-Host "Connecting to PostgreSQL database..." -ForegroundColor Yellow
    docker-compose exec postgres psql -U postgres -d galipette_db
}

# Function to run migrations
function Run-Migrations {
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    docker-compose exec backend npx prisma migrate dev
}

# Function to reset database
function Reset-Database {
    Write-Host "Resetting database..." -ForegroundColor Yellow
    docker-compose down -v
    docker-compose up -d postgres
    Start-Sleep -Seconds 5
    docker-compose up -d backend
    Write-Host "Database reset complete!" -ForegroundColor Green
}

# Function to clean up
function Clean-Up {
    Write-Host "Cleaning up Docker containers and volumes..." -ForegroundColor Yellow
    docker-compose down -v --remove-orphans
    docker system prune -f
    Write-Host "Cleanup complete!" -ForegroundColor Green
}

# Main script logic
param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

switch ($Command.ToLower()) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { Show-Logs }
    "db" { Connect-Database }
    "migrate" { Run-Migrations }
    "reset" { Reset-Database }
    "clean" { Clean-Up }
    "help" { Show-Help }
    default { 
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help 
    }
}

