#!/bin/bash

# Kill anything already on these ports
kill $(lsof -ti:8080) 2>/dev/null
kill $(lsof -ti:3000) 2>/dev/null

# Start backend
python3 backend.py &
BACKEND_PID=$!

# Start frontend
python3 -m http.server 3000 &
FRONTEND_PID=$!

echo ""
echo "  ✓ Backend  → http://localhost:8080"
echo "  ✓ Frontend → http://localhost:3000"
echo "  ✓ Admin    → http://localhost:3000?admin=1"
echo ""
echo "  Press Ctrl+C to stop both servers."
echo ""

open http://localhost:3000

# On Ctrl+C, kill both
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'" EXIT
wait
