#!/bin/bash

# Start development servers

echo "Starting Decryptify development environment..."

# Check if .env files exist
if [ ! -f backend/.env ]; then
    echo "Error: backend/.env file not found!"
    echo "Please create it with your API keys"
    exit 1
fi

if [ ! -f frontend/.env.local ]; then
    echo "Creating frontend/.env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
fi

# Install dependencies if needed
echo "Checking backend dependencies..."
cd backend
pip install -e . > /dev/null 2>&1

echo "Checking frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start backend in background
echo "Starting backend server..."
cd ../backend
google-adk api_server --module=main &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Development servers started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID" INT
wait
