# dev.ps1 - Development script for Podman
Write-Host "Building development image..." -ForegroundColor Green
podman build -f Dockerfile.dev -t galipette-portal-dev .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Starting development container..." -ForegroundColor Green
    podman run -it --name galipette-portal-dev -p 5173:5173 -v "$(Get-Location):/app" galipette-portal-dev
} else {
    Write-Host "Build failed. Exiting." -ForegroundColor Red
    exit 1
}