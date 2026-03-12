# 🚀 Deployment Checklist

## Pre-Deployment ✅
- [x] All TypeScript errors fixed
- [x] Frontend builds successfully
- [x] Backend files updated
- [x] Dockerfile updated to use socket_app
- [x] railway.json created with correct start command
- [x] docker-compose.yml updated
- [x] Extensive logging added
- [x] Test script created

## Deploy Steps

### 1. Commit Changes
```bash
git add .
git commit -m "Fix: Enable Socket.IO for real-time chat functionality"
git push origin main
```

### 2. Wait for Auto-Deploy
- **Railway**: Monitors GitHub, auto-deploys backend (~2-3 minutes)
- **Vercel**: Monitors GitHub, auto-deploys frontend (~1-2 minutes)

### 3. Verify Backend Deployment
```bash
# Test socket endpoint
curl https://synqq-production.up.railway.app/socket-test

# Expected response:
# {
#   "socket_configured": true,
#   "active_users": 0,
#   "project_rooms": {},
#   "message_history_count": {}
# }
```

### 4. Verify Frontend Deployment
- Open: https://synqq-neon.vercel.app
- Should load without errors

## Testing Checklist

### Basic Functionality
- [ ] Can login successfully
- [ ] Can navigate to project
- [ ] Can click Chat tab
- [ ] Chat interface loads

### Socket Connection
Open browser console (F12) and verify:
- [ ] See: `🔌 Connecting to socket...`
- [ ] See: `✅ Socket connected: <socket-id>`
- [ ] See: `🔗 Socket transport: websocket`
- [ ] See: `📤 Emitting join_project`
- [ ] See: `👥 Users updated`

### Personal Project Chat
- [ ] Open personal project
- [ ] Go to Chat tab
- [ ] See: "This is a personal project..." message
- [ ] Type message and press Enter
- [ ] See: `📤 Sending message`
- [ ] See: `✅ Message emitted`
- [ ] See: `📨 New message received`
- [ ] Message appears in chat
- [ ] Refresh page - message history loads

### Team Project Chat
- [ ] Open team project
- [ ] Go to Chat tab
- [ ] See team members in sidebar
- [ ] See your name with "(You)"
- [ ] Send message
- [ ] Message appears immediately
- [ ] Open in another browser/incognito
- [ ] Login as different user
- [ ] Join same project chat
- [ ] Both users see each other online
- [ ] Messages sync between users

### File Upload
- [ ] Click 📎 button
- [ ] Select a file (PDF, image, etc.)
- [ ] File message appears with 📎 icon
- [ ] Click file link
- [ ] File downloads correctly

### Call UI (Optional)
- [ ] See call buttons (📞 📹) next to online users
- [ ] Click audio call button
- [ ] Call modal appears
- [ ] Can end call

## Troubleshooting

### If Socket Doesn't Connect

1. **Check Railway Logs**:
   - Go to Railway dashboard
   - Click on backend service
   - View logs
   - Look for: "Client connected"

2. **Check Start Command**:
   - Railway dashboard → Settings
   - Verify: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`

3. **Check CORS**:
   - Verify `https://synqq-neon.vercel.app` is in CORS origins
   - Check `Backend/app/main.py` line ~20

### If Messages Don't Appear

1. **Check Browser Console**:
   - Should see "📤 Sending message"
   - Should see "✅ Message emitted"
   - Should see "📨 New message received"
   - If missing any, note which one

2. **Check Backend Logs**:
   - Should see "Received send_message"
   - Should see "Broadcasting to X users"
   - Should see "Sent to <sid>"

3. **Check projectId**:
   - In console, verify projectId in join_project matches send_message
   - Should be same string value

### If Users Don't Show

1. **Check join_project**:
   - Console should show: `📤 Emitting join_project: {projectId: "X", userId: Y, userName: "Name"}`
   - Backend logs should show: "User joining: Name (Y) -> Project X"

2. **Check users_update**:
   - Console should show: `👥 Users updated: [{id: Y, name: "Name", online: true}]`

## Rollback Plan

If deployment breaks something:

### Quick Rollback
```bash
git revert HEAD
git push origin main
```

### Railway Rollback
1. Go to Railway dashboard
2. Click Deployments
3. Find previous working deployment
4. Click ⋯ → Redeploy

### Vercel Rollback
1. Go to Vercel dashboard
2. Click Deployments
3. Find previous working deployment
4. Click ⋯ → Promote to Production

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Messages send and receive in real-time
✅ File uploads work
✅ Multiple users can chat together
✅ Message history persists
✅ Socket stays connected

## Post-Deployment

### Monitor for 24 Hours
- Check Railway logs for errors
- Monitor Vercel analytics
- Watch for user reports

### Performance Metrics
- Socket connection time: < 2 seconds
- Message delivery: < 100ms
- File upload: < 5 seconds (depends on size)

### Known Limitations
- Messages stored in memory (reset on server restart)
- Files stored as base64 (memory intensive)
- No message persistence to database
- No rate limiting

### Future Improvements
1. Add database persistence
2. Implement file storage service
3. Add typing indicators
4. Add read receipts
5. Add message search
6. Add emoji reactions
7. Implement WebRTC TURN server

---

**Deployment Status**: Ready ✅
**Estimated Time**: 10 minutes
**Risk Level**: Low (can rollback easily)
**Impact**: HIGH - Core feature fix
