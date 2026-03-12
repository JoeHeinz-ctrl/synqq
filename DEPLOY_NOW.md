# 🚀 IMMEDIATE DEPLOYMENT STEPS

## The Problem
Your backend is running `app.main:app` but it MUST run `app.main:socket_app` for Socket.IO to work.

## Quick Fix for Railway

### Option 1: Update via Railway Dashboard (FASTEST)
1. Go to Railway dashboard: https://railway.app
2. Select your backend service
3. Go to **Settings** → **Deploy**
4. Find **Start Command** or **Custom Start Command**
5. Change it to:
   ```
   uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT
   ```
6. Click **Save** and **Redeploy**

### Option 2: Create railway.json (RECOMMENDED)
Create a file `Backend/railway.json`:
```json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Then commit and push to trigger redeploy.

### Option 3: Update Dockerfile (ALREADY DONE)
The Dockerfile is already updated. Just push to GitHub:
```bash
git add .
git commit -m "Fix: Use socket_app for Socket.IO support"
git push origin main
```

Railway will auto-redeploy.

## Verify It's Working

### 1. Check Backend Health
```bash
curl https://synqq-production.up.railway.app/socket-test
```

Should return something like:
```json
{
  "socket_configured": true,
  "active_users": 0,
  "project_rooms": {},
  "message_history_count": {}
}
```

### 2. Check Socket.IO Endpoint
```bash
curl https://synqq-production.up.railway.app/socket.io/
```

Should return Socket.IO handshake data (not 404).

### 3. Test in Browser
1. Open: https://synqq-neon.vercel.app
2. Login and go to a project
3. Click Chat tab
4. Open browser console (F12)
5. Look for: `✅ Socket connected`
6. Send a message
7. Message should appear immediately

## If Still Not Working

### Check Railway Logs
1. Go to Railway dashboard
2. Select backend service
3. Click **Deployments** → Latest deployment
4. Check logs for:
   - `Client connected: <sid>`
   - `User joining: <name>`
   - `Received send_message`

### Check Browser Console
Should see:
```
🔌 Connecting to socket... https://synqq-production.up.railway.app
✅ Socket connected: <socket-id>
🔗 Socket transport: websocket
📤 Emitting join_project: {projectId: "4", userId: 5, userName: "Your Name"}
👥 Users updated: [{id: 5, name: "Your Name", online: true}]
```

When sending message:
```
📤 Sending message: {projectId: "4", content: "test"}
✅ Message emitted
📨 New message received: {id: "...", userId: 5, userName: "Your Name", content: "test", ...}
📝 Current messages: 0
📝 Updated messages: 1
```

## Emergency Rollback

If something breaks, you can quickly rollback:

### In Railway:
1. Go to **Deployments**
2. Find previous working deployment
3. Click **⋯** → **Redeploy**

### In Code:
```bash
git revert HEAD
git push origin main
```

## Next Steps After Fix

1. ✅ Verify chat works in personal projects
2. ✅ Verify chat works in team projects
3. ✅ Test file uploads
4. ✅ Test with multiple users (open in different browsers)
5. ✅ Test audio/video calls (optional)

## Contact

If you need help:
1. Share Railway logs
2. Share browser console logs
3. Share response from `/socket-test` endpoint
