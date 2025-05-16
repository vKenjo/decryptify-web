# Rebuild and run Docker containers
Write-Host "Rebuilding and running Docker containers..." -ForegroundColor Green

# Stop all running containers
docker-compose down

# Make sure the environment variables are accessible
Write-Host "Checking for .env file..." -ForegroundColor Yellow
if(-not (Test-Path -Path ".\.env")) {
    Write-Host "Warning: .env file not found! Please make sure your environment variables are correctly set." -ForegroundColor Red
}

# Rebuild the containers
Write-Host "Rebuilding containers..." -ForegroundColor Yellow
docker-compose build --no-cache

# Run the containers
Write-Host "Starting containers..." -ForegroundColor Yellow
docker-compose up

Write-Host "Done!" -ForegroundColor Green
