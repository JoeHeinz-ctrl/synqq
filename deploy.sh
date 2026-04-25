#!/bin/bash

echo "🚀 Deploying Dozzl to Oracle Server..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Rebuild and restart containers
echo "🔨 Rebuilding containers..."
docker-compose down
docker-compose up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 10

# Check status
echo "📊 Checking service status..."
docker-compose ps

# Check logs for errors
echo "📋 Recent backend logs:"
docker-compose logs --tail=20 backend

echo ""
echo "✅ Deployment complete!"
echo "🌐 Frontend: https://dozzl.xyz"
echo "🔧 Backend: https://api.dozzl.xyz"
echo ""
echo "Test Google Auth at: https://dozzl.xyz/login"