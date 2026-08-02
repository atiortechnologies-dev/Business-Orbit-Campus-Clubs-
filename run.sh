#!/bin/bash

echo "Starting Backend..."
cd Backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "Starting Frontend..."
cd Frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Trap SIGINT and SIGTERM to kill the child processes when the script stops
trap "echo 'Stopping both servers...'; kill $BACKEND_PID $FRONTEND_PID" SIGINT SIGTERM EXIT

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
