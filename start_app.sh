#!/bin/bash

# Function to cleanup background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p)
}
trap cleanup EXIT

echo "Starting Nourish Select Platform..."

# 1. Start Python Backend
echo "Starting AI Backend on port 8000..."
source backend/venv/bin/activate
uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend
sleep 2

# 2. Start Next.js Frontend
echo "Starting Web Frontend on port 3000..."
npm run dev
