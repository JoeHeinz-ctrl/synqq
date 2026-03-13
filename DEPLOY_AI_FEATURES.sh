#!/bin/bash

# 🚀 SYNQ AI Features Deployment Script
# This script handles the complete deployment of AI features

set -e  # Exit on error

echo "🚀 Starting SYNQ AI Features Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Database Migration
echo -e "${BLUE}Step 1: Running Database Migration${NC}"
echo "This will add AI columns to the tasks table..."
echo ""

cd Backend

if [ -f "migrate_postgresql.py" ]; then
    python migrate_postgresql.py
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database migration completed successfully${NC}"
    else
        echo -e "${RED}❌ Database migration failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ migrate_postgresql.py not found${NC}"
    exit 1
fi

echo ""

# Step 2: Verify Backend Files
echo -e "${BLUE}Step 2: Verifying Backend Files${NC}"

if grep -q "class TaskFromChat" app/schemas/schema.py; then
    echo -e "${GREEN}✅ TaskFromChat schema found${NC}"
else
    echo -e "${RED}❌ TaskFromChat schema not found${NC}"
    exit 1
fi

if grep -q "@router.post(\"/from-chat\")" app/routes/task_routes.py; then
    echo -e "${GREEN}✅ /tasks/from-chat endpoint found${NC}"
else
    echo -e "${RED}❌ /tasks/from-chat endpoint not found${NC}"
    exit 1
fi

echo ""

# Step 3: Verify Frontend Files
echo -e "${BLUE}Step 3: Verifying Frontend Files${NC}"

cd ../frountent

if grep -q "export async function createTaskFromChat" src/services/api.ts; then
    echo -e "${GREEN}✅ createTaskFromChat function found${NC}"
else
    echo -e "${RED}❌ createTaskFromChat function not found${NC}"
    exit 1
fi

if grep -q "socket.on(\"ai_task_suggestion\"" src/pages/chat.tsx; then
    echo -e "${GREEN}✅ AI socket listener found${NC}"
else
    echo -e "${RED}❌ AI socket listener not found${NC}"
    exit 1
fi

if grep -q "AiTaskSuggestion" src/pages/chat.tsx; then
    echo -e "${GREEN}✅ AiTaskSuggestion component found${NC}"
else
    echo -e "${RED}❌ AiTaskSuggestion component not found${NC}"
    exit 1
fi

echo ""

# Step 4: Summary
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All Verifications Passed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo "1. Restart Backend:"
echo "   cd Backend"
echo "   python run.py"
echo ""
echo "2. Restart Frontend (in another terminal):"
echo "   cd frountent"
echo "   npm run dev"
echo ""
echo "3. Test AI Features:"
echo "   - Go to Team Chat"
echo "   - Send: '@teammate fix the bug tomorrow'"
echo "   - Look for AI suggestion card"
echo "   - Click 'Create Task'"
echo ""
echo "4. For detailed testing, see: QUICK_TEST_EXAMPLES.md"
echo ""
echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
