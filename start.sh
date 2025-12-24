#!/bin/bash

# Mussa Full Stack Project Startup Script
# This script starts both backend API and frontend dev server

set -e

echo "🚀 Starting Mussa Full Stack Project..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start Backend API
echo -e "${BLUE}Starting Backend API...${NC}"
cd "$SCRIPT_DIR/backend/MussaApi"
dotnet run --urls http://localhost:5074 > /tmp/mussa-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/mussa-backend.pid
echo -e "${GREEN}✓ Backend API started (PID: $BACKEND_PID)${NC}"
echo -e "  URL: http://localhost:5074"
echo -e "  Swagger: http://localhost:5074/swagger"
echo ""

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:5074/swagger > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠ Backend took longer than expected. Check logs: tail /tmp/mussa-backend.log${NC}"
    fi
    sleep 1
done
echo ""

# Start Frontend Dev Server
echo -e "${BLUE}Starting Frontend Dev Server...${NC}"
cd "$SCRIPT_DIR"
npm run dev > /tmp/mussa-frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/mussa-frontend.pid
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo -e "  URL: http://localhost:3000"
echo ""

# Wait for frontend to be ready
echo -e "${YELLOW}Waiting for frontend to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${YELLOW}⚠ Frontend took longer than expected. Check logs: tail /tmp/mussa-frontend.log${NC}"
    fi
    sleep 1
done
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Backend API:${NC}"
echo -e "  • API: http://localhost:5074"
echo -e "  • Swagger: http://localhost:5074/swagger"
echo -e "  • Logs: tail -f /tmp/mussa-backend.log"
echo ""
echo -e "${BLUE}Frontend:${NC}"
echo -e "  • App: http://localhost:3000"
echo -e "  • Admin Login: http://localhost:3000/en/admin/login"
echo -e "  • Logs: tail -f /tmp/mussa-frontend.log"
echo ""
echo -e "${BLUE}Demo Credentials:${NC}"
echo -e "  • Username: supervisor"
echo -e "  • Password: supervisor"
echo ""
echo -e "${YELLOW}To stop all services, run:${NC} ./stop.sh"
echo ""
