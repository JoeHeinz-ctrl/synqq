# 🧪 Quick Test Examples for AI Features

## How to Test AI Task Detection

### Setup
1. Make sure you're in a **team project** (AI only works for team projects)
2. Open the **Team Chat** page
3. Have the browser console open (F12) to see debug messages

---

## Test Messages

Copy and paste these messages into the chat to test AI detection:

### ✅ Should Detect Task

```
@john fix the login bug tomorrow
```
Expected: Detects action verb "fix", assignee "@john", deadline "tomorrow"

```
deploy the new feature by Friday
```
Expected: Detects action verb "deploy", deadline "Friday"

```
create a new dashboard for analytics
```
Expected: Detects action verb "create", task title

```
@sarah review the pull request asap
```
Expected: Detects action verb "review", assignee "@sarah", urgency "asap"

```
implement the payment system next week
```
Expected: Detects action verb "implement", deadline "next week"

```
fix bug #123 - database connection timeout
```
Expected: Detects action verb "fix", issue reference

```
@team setup the staging environment today
```
Expected: Detects action verb "setup", team mention, deadline "today"

```
refactor the authentication module
```
Expected: Detects action verb "refactor", task title

```
test the new API endpoints
```
Expected: Detects action verb "test", task title

```
document the API changes
```
Expected: Detects action verb "document", task title

### ❌ Should NOT Detect Task

```
just chatting about the weather
```
Expected: No suggestion (no task keywords)

```
how are you doing today?
```
Expected: No suggestion (casual conversation)

```
the meeting is at 3pm
```
Expected: No suggestion (not a task)

```
I like pizza
```
Expected: No suggestion (random comment)

---

## What to Look For

### When AI Detects a Task

1. **AI Suggestion Card appears** below your message
   - Shows detected task title
   - Shows assignee (if detected)
   - Shows due date (if detected)

2. **Three buttons:**
   - ✅ **Create Task** - Creates task immediately
   - ✏️ **Edit** - Opens modal to modify details
   - ❌ **Ignore** - Dismisses suggestion

3. **Browser Console shows:**
   ```
   🤖 AI suggestion received: {messageId: "...", suggestion: {...}}
   ```

### When Creating a Task

1. Click "Create Task" or "Edit" → "Save"
2. Task appears in the project board
3. Suggestion card disappears
4. Console shows: `✅ Task created successfully`

### When Ignoring a Suggestion

1. Click "Ignore"
2. Suggestion card disappears
3. Won't reappear for that message

---

## Debug Checklist

- [ ] You're in a **team project** (not personal)
- [ ] Socket connection is active (green dot in header)
- [ ] Message contains **action verb** (fix, build, deploy, etc.)
- [ ] Browser console shows no errors
- [ ] Backend logs show `🤖 SYNQ AI detected task`
- [ ] You're the message sender (suggestions only show for own messages)

---

## Common Issues

### Suggestion doesn't appear
- Check if message has task keywords
- Verify you're in a team project
- Check browser console for errors
- Refresh page and try again

### "Create Task" button doesn't work
- Check browser console for error message
- Verify you have access to the project
- Check backend logs for errors

### Task appears but suggestion doesn't disappear
- Refresh the page
- Check browser console for errors

---

## Performance Expectations

- AI analysis: **<10ms** per message
- Suggestion appears: **instantly** (within 100ms)
- Task creation: **<1 second**
- No noticeable lag or slowdown

---

## Next Steps After Testing

1. ✅ Verify AI detection works
2. ✅ Test task creation from suggestions
3. ✅ Test editing suggestions
4. ✅ Test ignoring suggestions
5. 📊 Monitor performance
6. 🚀 Deploy to production
