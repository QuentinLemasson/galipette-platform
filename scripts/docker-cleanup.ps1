# Docker Cleanup Script for Windows PowerShell
# Removes unused containers, images, volumes, and build cache

Write-Host "Docker Cleanup Script" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host ""

# Show current disk usage
Write-Host "Current Docker disk usage:" -ForegroundColor Yellow
docker system df
Write-Host ""

# Ask for confirmation
$confirmation = Read-Host "Do you want to proceed with cleanup? (y/N)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Starting cleanup..." -ForegroundColor Cyan

# Remove all stopped containers
Write-Host "1. Removing stopped containers..." -ForegroundColor Yellow
docker container prune -f

# Remove all unused images (not just dangling)
Write-Host "2. Removing unused images..." -ForegroundColor Yellow
docker image prune -a -f

# Remove all unused volumes
Write-Host "3. Removing unused volumes..." -ForegroundColor Yellow
docker volume prune -f

# Remove all unused networks
Write-Host "4. Removing unused networks..." -ForegroundColor Yellow
docker network prune -f

# Remove build cache
Write-Host "5. Removing build cache..." -ForegroundColor Yellow
docker builder prune -a -f

# Full system prune (everything unused)
Write-Host "6. Performing full system prune..." -ForegroundColor Yellow
docker system prune -a --volumes -f

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Final Docker disk usage:" -ForegroundColor Yellow
docker system df

