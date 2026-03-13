# 🚨 PRODUCTION FIX GUIDE

## Issue Identified
Your production app is using **PostgreSQL** but the database migration wasn't applied. The error shows:
```
psycopg2.errors.UndefinedColumn: column tasks.description does not exist
```

## 🚀 QUICK FIX (Choose One Option)

### Option 1: Apply Database Migration (Recommended)

**Step 1: Run PostgreSQL Migration**
```bash
cd Backend
python migrate_postgresql.py
```

**Step 2: Restart Application**
Your app should automatically restart and work with full AI features.

### Option 2: Emergency Revert (If migration fails)

**Step 1: Disable AI Features Temporarily**
```bash
cd Backend
python emergency_fix.py
```

**Step 2: Restart Application**
App will work with basic functionality (no AI features).

## 🔧 Detailed Migration Steps

### For Railway/Heroku/Cloud Deployment:

1. **Connect to your production environment**
2. **Set environment variables** (should already be set):
   - `DATABASE_URL` or `POSTGRES_URL`
3. **Run migration script**:
   ```bash
   python migrate_postgresql.py
   ```

### Expected Migration Output:
```
🚀 Starting PostgreSQL migration for SYNQ AI...
🔗 Connected to PostgreSQL database
📋 Existing columns: ['id', 'title', 'status', 'position', 'project_id']
✅ Added column: description TEXT
✅ Added column: assigned_user_id INTEGER
✅ Added column: source VARCHAR(50)
✅ Added column: chat_message_id INTEGER
✅ Added column: due_date VARCHAR(20)
✅ Added column: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
✅ Added foreign key constraint for assigned_user_id

🎉 Migration complete! Added 6 columns to tasks table.
✅ SYNQ AI features are now ready!
```

## 🧪 Testing After Fix

### Test Basic Functionality:
1. ✅ Login works
2. ✅ Create project works
3. ✅ Create task works
4. ✅ Delete project works

### Test AI Features (if migration applied):
1. ✅ Go to team chat
2. ✅ Send: "@teammate fix the bug"
3. ✅ AI suggestion should appear
4. ✅ Click "Create Task" should work

## 🔍 Troubleshooting

### Migration Script Fails?
- Check database URL environment variable
- Verify database permissions
- Check network connectivity to database

### App Still Crashes?
- Run emergency fix: `python emergency_fix.py`
- Restart application
- Basic functionality should work

### AI Features Not Working?
- Verify migration completed successfully
- Check backend logs for AI analyzer messages
- Ensure you're in a team project (not personal)

## 📋 Environment Variables to Check

Make sure these are set in your production environment:
```bash
DATABASE_URL=postgresql://user:pass@host:port/dbname
# OR
POSTGRES_URL=postgresql://user:pass@host:port/dbname
# OR  
RAILWAY_DATABASE_URL=postgresql://user:pass@host:port/dbname
```

## 🎯 Next Steps After Fix

1. **Verify app is working**
2. **Test task creation**
3. **Test AI suggestions in team chat**
4. **Monitor logs for any errors**

## 🚨 If All Else Fails

**Complete Rollback:**
1. Revert to previous git commit before AI features
2. Redeploy application
3. Plan migration for maintenance window

The migration script should fix your production issue immediately! 🚀