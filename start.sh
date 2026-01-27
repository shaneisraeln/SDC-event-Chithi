#!/bin/bash

echo "========================================"
echo "  Code Prix - Starting Servers"
echo "========================================"
echo ""

echo "[1/2] Starting Backend Server..."
npm run server &
BACKEND_PID=$!
sleep 3

echo "[2/2] Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  Servers Started!"
echo "========================================"
echo "  Backend:  http://localhost:3001"
echo "  Frontend: http://localhost:3000"
echo "========================================"
echo ""
echo "Opening browser in 5 seconds..."
sleep 5

# Open browser based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000
fi

echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
