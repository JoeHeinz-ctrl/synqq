# 🚀 Deploy Google OAuth Fix

## The Problem
Docker containers on Oracle Cloud can't resolve DNS for `oauth2.googleapis.com`, blocking Google login.

## The Solution
We've configured:
1. Multiple DNS servers (8.8.8.8, 8.8.4.4, 1.1.1.1)
2. Hardcoded IP addresses for Google OAuth servers
3. Custom Docker network configuration
4. System-level DNS fixes

## Deploy Steps

### On Oracle Server:

```bash
# 1. Pull latest code
cd ~/synqq
git pull origin main

# 2. Make script executable and run it
chmod +x fix_dns_and_deploy.sh
./fix_dns_and_deploy.sh
```

That's it! The script will:
- Configure system DNS
- Configure Docker DNS
- Restart everything
- Test DNS resolution
- Show you the logs

## If It Still Doesn't Work

Check Oracle Cloud firewall:

```bash
# Check if outbound HTTPS is allowed
curl -v https://oauth2.googleapis.com/token

# If that fails, you need to configure Oracle Cloud Security Lists:
# 1. Go to Oracle Cloud Console
# 2. Navigate to: Networking → Virtual Cloud Networks → Your VCN
# 3. Click on your subnet's Security List
# 4. Add Egress Rule:
#    - Destination: 0.0.0.0/0
#    - Protocol: TCP
#    - Destination Port: 443
```

## Test Google Login

1. Go to https://dozzl.xyz
2. Click "Sign in with Google"
3. Check backend logs: `docker-compose logs -f backend`

## Troubleshooting

```bash
# Check DNS from host
nslookup oauth2.googleapis.com

# Check DNS from container
docker exec synq-Backend python -c "import socket; print(socket.gethostbyname('oauth2.googleapis.com'))"

# Check backend logs
docker-compose logs backend | grep -i google

# Restart everything
docker-compose down && docker-compose up -d
```
