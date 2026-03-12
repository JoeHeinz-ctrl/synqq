#!/usr/bin/env python3
"""
Simple script to test Socket.IO connection
Run this to verify socket.io is working
"""
import socketio
import time

# Create a Socket.IO client
sio = socketio.Client()

@sio.event
def connect():
    print("✅ Connected to server!")
    print(f"🆔 Session ID: {sio.sid}")
    
    # Join a test project
    sio.emit('join_project', {
        'projectId': '1',
        'userId': 1,
        'userName': 'Test User'
    })
    print("📤 Sent join_project")

@sio.event
def disconnect():
    print("❌ Disconnected from server")

@sio.event
def users_update(data):
    print(f"👥 Users update: {data}")

@sio.event
def message_history(data):
    print(f"📜 Message history: {data}")

@sio.event
def new_message(data):
    print(f"📨 New message: {data}")

if __name__ == '__main__':
    try:
        print("🔌 Connecting to http://localhost:8000...")
        sio.connect('http://localhost:8000')
        
        # Wait a bit for join to complete
        time.sleep(2)
        
        # Send a test message
        print("📤 Sending test message...")
        sio.emit('send_message', {
            'projectId': '1',
            'content': 'Hello from test script!'
        })
        
        # Keep connection alive for a bit
        time.sleep(5)
        
        sio.disconnect()
        print("✅ Test completed")
        
    except Exception as e:
        print(f"❌ Error: {e}")
