#!/bin/bash

# Mussa Full Stack Project Stop Script
# This script stops both backend API and frontend dev server

echo "🛑 Stopping Mussa Full Stack Project..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Stop Backend
if [ -f /tmp/mussa-backend.pid ]; then
    BACKEND_PID=$(cat /tmp/mussa-backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}Stopping Backend API (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        rm /tmp/mussa-backend.pid
        echo -e "${GREEN}✓ Backend stopped${NC}"
    else
        echo -e "${YELLOW}Backend not running${NC}"
        rm /tmp/mussa-backend.pid
    fi
else
    # Try to kill by process name as fallback
    pkill -f "MussaApi" 2>/dev/null && echo -e "${GREEN}✓ Backend stopped${NC}" || echo -e "${YELLOW}Backend not running${NC}"
fi
echo ""

# Stop Frontend
if [ -f /tmp/mussa-frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/mussa-frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}Stopping Frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
        rm /tmp/mussa-frontend.pid
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    else
        echo -e "${YELLOW}Frontend not running${NC}"
        rm /tmp/mussa-frontend.pid
    fi
else
    # Try to kill by process name as fallback
    pkill -f "next dev" 2>/dev/null && echo -e "${GREEN}✓ Frontend stopped${NC}" || echo -e "${YELLOW}Frontend not running${NC}"
fi
echo ""

# Clean up any remaining processes
echo -e "${YELLOW}Cleaning up any remaining processes...${NC}"
pkill -f "dotnet run.*MussaApi" 2>/dev/null || true
pkill -f "node.*next.*dev" 2>/dev/null || true

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ All services stopped${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
