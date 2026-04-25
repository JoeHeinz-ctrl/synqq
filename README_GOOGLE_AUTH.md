# Google Auth Fix - DO THIS NOW

## What You Need to Do

### 1. Restart Backend on Oracle Server
The backend CORS has been updated. You MUST restart it:

```bash
# SSH to your Oracle server
ssh your-oracle-server

# Go to backend directory and restart
cd /path/to/backend
# Restart however you run it (pm2, systemd, docker, etc.)
```

### 2. Configure Google Cloud Console
Go here: https://console.cloud.google.com/apis/credentials

Find: `335846643539-am8i2gne8ajsu3sbgfomb61pp26dr6ir`

Add to **Authorized JavaScript origins**:
- `https://dozzl.xyz`
- `https://www.dozzl.xyz`

### 3. Test
- Go to https://dozzl.xyz/login
- Click "Continue with Google"
- Should work!

## What's Fixed
✅ Frontend points to `https://api.dozzl.xyz`
✅ Backend CORS allows `https://dozzl.xyz`
✅ Login card is centered
✅ All code is clean and simple

## The Issue
Your backend is running on Oracle server, not localhost. The CORS configuration needs to be deployed and the backend restarted for Google Auth to work.