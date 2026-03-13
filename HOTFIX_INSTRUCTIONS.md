# 🚨 HOTFIX: Task Creation & Project Deletion Issues

## Issues Identified

1. **"Failed to create task"** - TaskService not updated for new schema
2. **"Project not found"** - Possible foreign key constraint issues
3. **Backend dependencies** - Virtual environment might not be activated

## Quick Fixes

### 1. Backend Setup (Run these commands)

```bash
# Navigate to backend
cd Backend

# Activate virtual environment (if exists)
# Windows:
.venv\Scripts\activate
# OR create new one:
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migration (if not done)
python migrate_task_model.py

# Start backend
python run.py
```

### 2. Database Reset (If issues persist)

If you're still getting errors, reset the database:

```bash
cd Backend
# Backup current database (optional)
copy project.db project.db.backup

# Delete database to recreate
del project.db

# Start backend (will recreate database)
python run.py
```

### 3. Test Task Creation

After backend is running:

1. Create a new user account
2. Create a team and project
3. Try creating a task manually first
4. Then test AI suggestions in chat

## Root Cause Analysis

The issues are caused by:

1. **TaskService** using old Task constructor without new fields
2. **Foreign key constraints** on `assigned_user_id` field
3. **Backend not restarted** after schema changes

## Files Already Fixed

✅ `Backend/app/services/task_service.py` - Updated to handle new schema
✅ `Backend/migrate_task_model.py` - Database migration script
✅ All AI components implemented correctly

## Verification Steps

1. **Backend Health Check**:
   ```bash
   curl http://localhost:8000/
   # Should return: {"message": "Backend is running 🚀 with Socket.IO v2"}
   ```

2. **Database Schema Check**:
   ```bash
   python -c "
   import sqlite3
   conn = sqlite3.connect('project.db')
   cursor = conn.cursor()
   cursor.execute('PRAGMA table_info(tasks)')
   print([col[1] for col in cursor.fetchall()])
   conn.close()
   "
   # Should show: ['id', 'title', 'status', 'position', 'project_id', 'description', 'assigned_user_id', 'source', 'chat_message_id', 'due_date', 'created_at']
   ```

3. **Test Task Creation**:
   - Go to project board
   - Click "Add Task" 
   - Should work without errors

4. **Test AI Suggestions**:
   - Go to team chat
   - Send: "@teammate fix the bug"
   - Should see AI suggestion appear

## If Problems Persist

1. Check browser console for JavaScript errors
2. Check backend logs for Python errors
3. Verify all dependencies are installed
4. Try with a fresh database

## Emergency Rollback

If needed, revert the Task model changes:

```python
# In Backend/app/models/task.py, temporarily use:
class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    status = Column(String, default="TODO")
    position = Column(Float, default=0.0, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="tasks")
```

This will restore basic functionality while we debug the AI features.