#!/bin/bash

# VCU Mini Hacks 2026 - Complete Startup Script
# This script starts all three services: Python Agent, Backend, and Frontend

echo "🚀 Starting VCU Mini Hacks Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill any existing processes on the ports
echo "${YELLOW}Cleaning up existing processes...${NC}"
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Start Python Agent (FastAPI)
echo ""
echo "${BLUE}1️⃣  Starting Python Recipe Agent (Port 8000)...${NC}"
cd /workspaces/VCUMiniHacks26/agent
python3 -m uvicorn recipe_agent:app --host 0.0.0.0 --port 8000 > /tmp/agent.log 2>&1 &
AGENT_PID=$!
echo "   Agent PID: $AGENT_PID"
sleep 3

# Check if agent started successfully
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "${GREEN}   ✓ Python Agent is running${NC}"
else
    echo "${YELLOW}   ⚠ Python Agent may not be ready yet${NC}"
fi

# Start Backend (Express)
echo ""
echo "${BLUE}2️⃣  Starting Backend Server (Port 3001)...${NC}"
cd /workspaces/VCUMiniHacks26/backend
npm start > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
sleep 3

# Check if backend started successfully
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "${GREEN}   ✓ Backend is running${NC}"
else
    echo "${YELLOW}   ⚠ Backend may not be ready yet${NC}"
fi

# Start Frontend (Next.js)
echo ""
echo "${BLUE}3️⃣  Starting Frontend (Port 3000)...${NC}"
cd /workspaces/VCUMiniHacks26/frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
sleep 5

echo ""
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "${GREEN}✨ All services started!${NC}"
echo "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📍 Service URLs:"
echo "   🐰 Frontend:      http://localhost:3000"
echo "   🔧 Backend:       http://localhost:3001"
echo "   🤖 Agent API:     http://localhost:8000"
echo ""
echo "📋 Process IDs:"
echo "   Agent:   $AGENT_PID"
echo "   Backend: $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Agent:   tail -f /tmp/agent.log"
echo "   Backend: tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 To stop all services:"
echo "   kill $AGENT_PID $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to view logs..."
sleep 2

# Tail all logs
tail -f /tmp/agent.log /tmp/backend.log /tmp/frontend.log
