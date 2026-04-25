#!/usr/bin/env python3
import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port} with Socket.IO support...")
    print(f"📍 Host: 0.0.0.0")
    print(f"🔧 App: app.main:socket_app")
    print(f"📊 Log level: info")
    
    uvicorn.run(
        "app.main:socket_app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )
