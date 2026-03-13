# SYNQ AI - Quick Start Guide

## Setup Instructions

### 1. Database Migration

Update your existing database to support AI features:

```bash
cd Backend
python migrate_task_model.py
```

Expected output:
```
✅ Executed: ALTER TABLE tasks ADD COLUMN description TEXT
✅ Executed: ALTER TABLE tasks ADD COLUMN assigned_user_id INTEGER
✅ Executed: ALTER TABLE tasks ADD COLUMN source TEXT
✅ Executed: ALTER TABLE tasks ADD COLUMN chat_message_id INTEGER
✅ Executed: ALTER TABLE tasks ADD COLUMN due_date TEXT
✅ Executed: ALTER TABLE tasks ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

✅ Migration complete! Added 6 columns.
```

### 2. Start Backend

```bash
cd Backend
python run.py
```

The backend will automatically load the new message analyzer service.

### 3. Start Frontend

```bash
cd frountent
npm install  # if needed
npm run dev
```

### 4. Test the Feature

1. Login to SYNQ
2. Navigate to a team project
3. Open the Chat tab
4. Send a message like:
   - "@teammate fix the login bug tomorrow"
   - "todo: deploy the backend"
   - "we should update the docs today"

5. Watch the AI suggestion appear under your message!

## Example Test Messages

### Basic Task Detection
```
fix the login bug
```
**Expected:** Task suggestion with title "Fix the login bug"

### With Assignee
```
@Joe update the API docs
```
**Expected:** Task suggestion assigned to Joe

### With Deadline
```
deploy the backend tomorrow
```
**Expected:** Task suggestion with due date set to tomorrow

### Complete Example
```
@Sarah please fix the payment bug by tomorrow
```
**Expected:** Task suggestion with:
- Title: "Please fix the payment bug"
- Assigned to: Sarah
- Due: Tomorrow

## Troubleshooting

### No suggestions appearing?

1. Check backend console for analyzer logs:
```
🤖 SYNQ AI detected task: {'isTask': True, 'title': '...', ...}
✨ Sent AI suggestion to <socket_id>
```

2. Check frontend console for socket events:
```
🤖 AI suggestion received: {messageId: '...', suggestion: {...}}
```

3. Verify you're in a team project (not personal project)

### Suggestions not creating tasks?

1. Check network tab for `/tasks/from-chat` API call
2. Verify assigned user is a team member
3. Check backend logs for errors

### Database errors?

Run the migration script again:
```bash
cd Backend
python migrate_task_model.py
```

## Feature Highlights

✨ **Instant Detection** - Tasks detected in <10ms
✨ **Smart Parsing** - Extracts title, assignee, and deadline
✨ **One-Click Creation** - Create tasks without leaving chat
✨ **Edit Before Create** - Modify details in a modal
✨ **Non-Intrusive** - Suggestions only for your messages
✨ **Dismissible** - Ignore suggestions you don't need

## What Gets Detected?

### Action Verbs
fix, build, deploy, update, create, finish, implement, design, test, write, review, refactor, add, remove, delete, setup, configure, install, debug, optimize, improve, enhance, develop

### Task Indicators
task, todo, action item, please, need to, should, must, have to, can you, could you

### Mentions
@username (matches team members by name)

### Deadlines
today, tonight, tomorrow, next week, this week, asap, urgent

## Next Steps

1. Test with your team
2. Provide feedback on detection accuracy
3. Suggest additional keywords or patterns
4. Monitor task creation analytics (source="chat_ai")

## Support

For issues or questions, check:
- `SYNQ_AI_FEATURE.md` - Complete technical documentation
- Backend logs - Message analyzer output
- Frontend console - Socket.IO events
- Network tab - API calls

Happy task creating! 🚀
