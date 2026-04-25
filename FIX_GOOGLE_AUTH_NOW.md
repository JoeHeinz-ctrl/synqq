# Fix Google Auth - Simple Steps

## The Problem
Your frontend at `https://dozzl.xyz` can't talk to your backend at `https://api.dozzl.xyz` because of CORS.

## The Solution (3 Steps)

### Step 1: Deploy Backend Changes
I've updated the backend CORS in `Backend/app/main.py`. You need to:

1. Push these changes to your Oracle server
2. Restart the backend service

```bash
# On your Oracle server
cd /path/to/backend
git pull
# Restart your backend service (however you run it)
```

### Step 2: Configure Google OAuth Console
Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

Find your OAuth Client ID: `335846643539-am8i2gne8ajsu3sbgfomb61pp26dr6ir`

Add these **Authorized JavaScript origins**:
- `https://dozzl.xyz`
- `https://www.dozzl.xyz`
- `http://localhost:5173` (for local testing)

Add these **Authorized redirect URIs**:
- `https://dozzl.xyz`
- `https://www.dozzl.xyz`

### Step 3: Test
1. Clear browser cache
2. Go to `https://dozzl.xyz/login`
3. Click "Continue with Google"
4. Should work now!

## What I Fixed in the Code

✅ **Frontend API URL**: Set to `https://api.dozzl.xyz`
✅ **Backend CORS**: Allows `https://dozzl.xyz` and `localhost:5173`
✅ **Login card alignment**: Properly centered
✅ **Google OAuth flow**: Proper error handling

## If Still Not Working

Check browser console for the specific error:
- If "CORS error" → Backend not restarted with new CORS config
- If "redirect_uri_mismatch" → Google Console not configured
- If "invalid_client" → Wrong Client ID

The backend MUST be restarted for CORS changes to work!