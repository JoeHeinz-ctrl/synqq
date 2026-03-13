@echo off
REM 🚀 SYNQ AI Features Deployment Script (Windows)
REM This script handles the complete deployment of AI features

setlocal enabledelayedexpansion

echo.
echo 🚀 Starting SYNQ AI Features Deployment...
echo.

REM Step 1: Database Migration
echo [Step 1] Running Database Migration
echo This will add AI columns to the tasks table...
echo.

cd Backend

if exist "migrate_postgresql.py" (
    python migrate_postgresql.py
    if !errorlevel! equ 0 (
        echo ✅ Database migration completed successfully
    ) else (
        echo ❌ Database migration failed
        exit /b 1
    )
) else (
    echo ❌ migrate_postgresql.py not found
    exit /b 1
)

echo.

REM Step 2: Verify Backend Files
echo [Step 2] Verifying Backend Files

findstr /M "class TaskFromChat" app\schemas\schema.py >nul
if !errorlevel! equ 0 (
    echo ✅ TaskFromChat schema found
) else (
    echo ❌ TaskFromChat schema not found
    exit /b 1
)

findstr /M "@router.post(\"/from-chat\")" app\routes\task_routes.py >nul
if !errorlevel! equ 0 (
    echo ✅ /tasks/from-chat endpoint found
) else (
    echo ❌ /tasks/from-chat endpoint not found
    exit /b 1
)

echo.

REM Step 3: Verify Frontend Files
echo [Step 3] Verifying Frontend Files

cd ..\frountent

findstr /M "export async function createTaskFromChat" src\services\api.ts >nul
if !errorlevel! equ 0 (
    echo ✅ createTaskFromChat function found
) else (
    echo ❌ createTaskFromChat function not found
    exit /b 1
)

findstr /M "socket.on(\"ai_task_suggestion\"" src\pages\chat.tsx >nul
if !errorlevel! equ 0 (
    echo ✅ AI socket listener found
) else (
    echo ❌ AI socket listener not found
    exit /b 1
)

findstr /M "AiTaskSuggestion" src\pages\chat.tsx >nul
if !errorlevel! equ 0 (
    echo ✅ AiTaskSuggestion component found
) else (
    echo ❌ AiTaskSuggestion component not found
    exit /b 1
)

echo.

REM Step 4: Summary
echo ===================================================
echo ✅ All Verifications Passed!
echo ===================================================
echo.

echo 📋 Next Steps:
echo.
echo 1. Restart Backend:
echo    cd Backend
echo    python run.py
echo.
echo 2. Restart Frontend (in another terminal):
echo    cd frountent
echo    npm run dev
echo.
echo 3. Test AI Features:
echo    - Go to Team Chat
echo    - Send: '@teammate fix the bug tomorrow'
echo    - Look for AI suggestion card
echo    - Click 'Create Task'
echo.
echo 4. For detailed testing, see: QUICK_TEST_EXAMPLES.md
echo.
echo 🎉 Deployment preparation complete!
echo.

pause
