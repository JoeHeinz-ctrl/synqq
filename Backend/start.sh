#!/bin/bash
echo "🚀 Starting server with Socket.IO support..."
exec uvicorn app.main:socket_app --host 0.0.0.0 --port ${PORT:-8000}
