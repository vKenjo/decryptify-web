# PowerShell script to start development servers

Write-Host "Starting Decryptify development environment..." -ForegroundColor Green

# Check if .env files exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "Error: backend\.env file not found!" -ForegroundColor Red
    Write-Host "Please create it with your API keys"
    exit 1
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "Creating frontend\.env.local..."
    "NEXT_PUBLIC_API_URL=http://localhost:8000" | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
}

# Check and install dependencies
Write-Host "Checking backend dependencies..."
Set-Location backend
pip install -e . | Out-Null

Write-Host "Checking frontend dependencies..."
Set-Location ..\frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..."
    npm install
}

# Start backend
Write-Host "Starting backend server..." -ForegroundColor Yellow
Set-Location ..\backend
Start-Process -NoNewWindow powershell -ArgumentList "google-adk api_server --module=main"

# Wait for backend to start
Start-Sleep -Seconds 5

# Start frontend
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Set-Location ..\frontend
Start-Process -NoNewWindow powershell -ArgumentList "npm run dev"

Write-Host ""
Write-Host "Development servers started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow

# Keep the script running
while ($true) {
    Start-Sleep -Seconds 1
}
