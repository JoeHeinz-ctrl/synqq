# Chat System Fix Instructions

## Critical Changes Made

### 1. Backend Dockerfile Fix
**File**: `Backend/Dockerfile`
- Changed: `CMD ["uvicorn", "app.main:socket_app", ...]` (was `app.main:app`)
- This is CRITICAL - the server must run `socket_app` not `app` for Socket.IO to work

### 2. Backend Main.py Fix
**File**: `Backend/app/main.py`
- Moved `socket_app = socketio.ASGIApp(sio, app)` to the END of the file
- Added `/socket-test` endpoint to verify socket configuration

### 3. Socket Handler Improvements
**File**: `Backend/app/socket_handler.py`
- Added extensive logging to debug message flow
- Fixed database session management
- Ensured projectId is always converted to string

### 4. Frontend Socket Connection
**File**: `frountent/src/hooks/useChat.ts`
- Added explicit socket path configuration
- Added reconnection settings
- Enhanced logging for debugging

## How to Deploy and Test

### For Railway (Backend)
1. Push these changes to your GitHub repository
2. Railway will automatically redeploy
3. **IMPORTANT**: Verify the build command uses `socket_app`:
   - In Railway dashboard, check that the start command is:
   - `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`

### For Vercel (Frontend)
1. Push the built frontend to GitHub
2. Vercel will automatically redeploy
3. The new build includes all socket fixes

### Local Testing (Recommended First)

1. **Start Backend Locally**:
   ```bash
   cd Backend
   uvicorn app.main:socket_app --reload --host 0.0.0.0 --port 8000
   ```

2. **Test Socket Connection**:
   ```bash
   cd Backend
   pip install python-socketio[client]
   python test_socket.py
   ```
   You should see:
   - ✅ Connected to server!
   - 📤 Sent join_project
   - 👥 Users update
   - 📨 New message

3. **Start Frontend Locally**:
   ```bash
   cd frountent
   npm run dev
   ```
   Update `.env` to point to local backend:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Test in Browser**:
   - Open browser console (F12)
   - Navigate to chat page
   - Look for these logs:
     - `✅ Socket connected`
     - `📤 Emitting join_project`
     - `👥 Users updated`
   - Send a message and check for:
     - `📤 Sending message`
     - `✅ Message emitted`
     - `📨 New message received`

## Debugging Checklist

If chat still doesn't work:

1. **Check Backend Logs**:
   - Look for "Client connected" messages
   - Look for "User joining" messages
   - Look for "Received send_message" messages

2. **Check Browser Console**:
   - Should see socket connection logs
   - Should see message emit logs
   - Check for any errors

3. **Test Socket Endpoint**:
   ```bash
   curl https://synqq-production.up.railway.app/socket-test
   ```
   Should return JSON with socket stats

4. **Verify Railway Configuration**:
   - Ensure start command uses `socket_app`
   - Check environment variables are set
   - Verify CORS origins include your Vercel domain

## Common Issues

### Issue: Messages disappear immediately
**Cause**: Backend not running `socket_app`
**Fix**: Update Railway start command to use `app.main:socket_app`

### Issue: Socket never connects
**Cause**: CORS or transport issues
**Fix**: Check CORS settings in `main.py` include your domain

### Issue: "Team Members (0)" even in team projects
**Cause**: Users not joining room properly
**Fix**: Check backend logs for "User joining" messages

## Production Deployment

After local testing works:

1. **Update Railway**:
   - Go to Railway dashboard
   - Settings → Deploy
   - Ensure start command: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`
   - Redeploy

2. **Update Vercel**:
   - Push to GitHub
   - Vercel auto-deploys
   - Verify `.env` has correct Railway URL

3. **Test Production**:
   - Open production URL
   - Check browser console
   - Send test messages
   - Verify in multiple browser tabs/windows

## Support

If issues persist, check:
1. Backend logs in Railway dashboard
2. Browser console in production
3. Network tab for socket.io requests
4. `/socket-test` endpoint response
