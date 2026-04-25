#!/bin/bash

echo "🔧 Fixing DNS for Docker containers on Oracle Cloud..."

# Step 1: Configure systemd-resolved to use Google DNS
echo "📝 Configuring systemd-resolved..."
sudo bash -c 'cat > /etc/systemd/resolved.conf << EOF
[Resolve]
DNS=8.8.8.8 8.8.4.4 1.1.1.1
FallbackDNS=1.0.0.1
DNSStubListener=no
EOF'

# Step 2: Restart systemd-resolved
echo "🔄 Restarting systemd-resolved..."
sudo systemctl restart systemd-resolved

# Step 3: Update /etc/resolv.conf
echo "📝 Updating /etc/resolv.conf..."
sudo rm -f /etc/resolv.conf
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf

# Step 4: Configure Docker daemon
echo "📝 Configuring Docker daemon..."
sudo bash -c 'cat > /etc/docker/daemon.json << EOF
{
  "dns": ["8.8.8.8", "8.8.4.4", "1.1.1.1"],
  "dns-opts": ["ndots:0"],
  "dns-search": []
}
EOF'

# Step 5: Restart Docker
echo "🔄 Restarting Docker daemon..."
sudo systemctl restart docker

# Step 6: Wait for Docker to be ready
echo "⏳ Waiting for Docker to be ready..."
sleep 5

# Step 7: Restart containers
echo "🐳 Restarting containers..."
cd ~/synqq
docker-compose down
docker-compose up -d

# Step 8: Wait for containers to start
echo "⏳ Waiting for containers to start..."
sleep 10

# Step 9: Test DNS resolution from inside container
echo "🧪 Testing DNS resolution from backend container..."
docker exec synq-Backend python -c "import socket; print('✅ DNS works! IP:', socket.gethostbyname('oauth2.googleapis.com'))" || echo "❌ DNS still not working"

# Step 10: Check backend logs
echo "📋 Recent backend logs:"
docker-compose logs --tail=20 backend

echo ""
echo "✅ Deployment complete!"
echo "🌐 Test Google login at: https://dozzl.xyz"
echo "📊 Check logs with: docker-compose logs -f backend"
