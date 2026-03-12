from datetime import datetime
from typing import Dict, List
import socketio
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# Store active connections
active_users: Dict[str, Dict] = {}  # sid -> {user_id, project_id, name}
project_rooms: Dict[str, List[str]] = {}  # project_id -> [sid, sid, ...]
message_history: Dict[str, List[Dict]] = {}  # project_id -> [messages]


def get_db():
    """Get database session"""
    return SessionLocal()


@sio.event
async def connect(sid, environ, auth):
    """Handle client connection"""
    print(f"Client connected: {sid}")
    # You can validate auth token here
    return True


@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    print(f"Client disconnected: {sid}")
    
    if sid in active_users:
        user_data = active_users[sid]
        project_id = user_data.get('project_id')
        
        # Remove from active users
        del active_users[sid]
        
        # Remove from project room
        if project_id and project_id in project_rooms:
            if sid in project_rooms[project_id]:
                project_rooms[project_id].remove(sid)
            
            # Notify others in the room
            await update_users_list(project_id)


@sio.event
async def join_project(sid, data):
    """User joins a project room"""
    project_id = str(data.get('projectId'))
    user_id = data.get('userId')
    user_name = data.get('userName', f"User {user_id}")
    
    print(f"👤 User joining: {user_name} ({user_id}) -> Project {project_id}")
    
    # Fetch real user name from database
    db = get_db()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user_name = user.name
            print(f"✅ Found user in DB: {user_name}")
    finally:
        db.close()
    
    # Store user info
    active_users[sid] = {
        'user_id': user_id,
        'project_id': project_id,
        'name': user_name,
        'online': True
    }
    
    # Add to project room
    if project_id not in project_rooms:
        project_rooms[project_id] = []
    project_rooms[project_id].append(sid)
    
    print(f"📋 Project rooms: {project_rooms}")
    print(f"👥 Active users: {active_users}")
    
    # Send message history
    if project_id in message_history:
        print(f"📜 Sending {len(message_history[project_id])} messages from history")
        await sio.emit('message_history', message_history[project_id], room=sid)
    else:
        print(f"📜 No message history for project {project_id}")
    
    # Update users list for everyone in the room
    await update_users_list(project_id)
    
    print(f"✅ User {user_name} ({user_id}) joined project {project_id}")


@sio.event
async def leave_project(sid, data):
    """User leaves a project room"""
    if sid in active_users:
        project_id = active_users[sid].get('project_id')
        
        if project_id and project_id in project_rooms:
            if sid in project_rooms[project_id]:
                project_rooms[project_id].remove(sid)
            
            await update_users_list(project_id)


@sio.event
async def send_message(sid, data):
    """Handle new message"""
    print(f"📨 Received send_message from {sid}: {data}")
    
    if sid not in active_users:
        print(f"❌ User {sid} not in active_users")
        return
    
    user_data = active_users[sid]
    project_id = str(data.get('projectId'))
    content = data.get('content')
    
    print(f"📤 Creating message for project {project_id}")
    
    message = {
        'id': f"{sid}_{datetime.now().timestamp()}",
        'userId': user_data['user_id'],
        'userName': user_data['name'],
        'content': content,
        'timestamp': datetime.now().isoformat(),
        'type': 'text'
    }
    
    # Store message
    if project_id not in message_history:
        message_history[project_id] = []
    message_history[project_id].append(message)
    
    print(f"💾 Stored message. History length: {len(message_history[project_id])}")
    
    # Broadcast to all users in the project
    if project_id in project_rooms:
        print(f"📢 Broadcasting to {len(project_rooms[project_id])} users")
        for user_sid in project_rooms[project_id]:
            await sio.emit('new_message', message, room=user_sid)
            print(f"✅ Sent to {user_sid}")
    else:
        print(f"❌ Project {project_id} not in project_rooms")


@sio.event
async def send_file(sid, data):
    """Handle file upload"""
    print(f"📎 Received send_file from {sid}: {data.get('fileName')}")
    
    if sid not in active_users:
        print(f"❌ User {sid} not in active_users")
        return
    
    user_data = active_users[sid]
    project_id = str(data.get('projectId'))
    file_name = data.get('fileName')
    file_data = data.get('fileData')
    file_type = data.get('fileType')
    file_size = data.get('fileSize')
    
    # Create file message
    message = {
        'id': f"{sid}_{datetime.now().timestamp()}",
        'userId': user_data['user_id'],
        'userName': user_data['name'],
        'content': f"📎 {file_name}",
        'timestamp': datetime.now().isoformat(),
        'type': 'file',
        'fileUrl': file_data,  # In production, upload to storage and use URL
        'fileName': file_name,
        'fileType': file_type,
        'fileSize': file_size
    }
    
    # Store message
    if project_id not in message_history:
        message_history[project_id] = []
    message_history[project_id].append(message)
    
    print(f"💾 Stored file message. History length: {len(message_history[project_id])}")
    
    # Broadcast to all users in the project
    if project_id in project_rooms:
        print(f"📢 Broadcasting file to {len(project_rooms[project_id])} users")
        for user_sid in project_rooms[project_id]:
            await sio.emit('new_message', message, room=user_sid)
            print(f"✅ Sent file to {user_sid}")
    else:
        print(f"❌ Project {project_id} not in project_rooms")


@sio.event
async def call_user(sid, data):
    """Initiate a call to another user"""
    target_user_id = data.get('targetUserId')
    offer = data.get('offer')
    call_type = data.get('callType')
    
    if sid not in active_users:
        return
    
    caller = active_users[sid]
    
    # Find target user's sid
    target_sid = None
    for user_sid, user_data in active_users.items():
        if user_data['user_id'] == target_user_id:
            target_sid = user_sid
            break
    
    if target_sid:
        print(f"📞 Routing call from {caller['name']} to user {target_user_id}")
        await sio.emit('incoming_call', {
            'from': {
                'id': caller['user_id'],
                'name': caller['name']
            },
            'offer': offer,
            'callType': call_type
        }, room=target_sid)
    else:
        print(f"❌ Target user {target_user_id} not found")


@sio.event
async def answer_call(sid, data):
    """Answer an incoming call"""
    answer = data.get('answer')
    target_user_id = data.get('targetUserId')
    
    if sid not in active_users:
        return
    
    # Find caller's sid
    target_sid = None
    for user_sid, user_data in active_users.items():
        if user_data['user_id'] == target_user_id:
            target_sid = user_sid
            break
    
    if target_sid:
        print(f"✅ Routing answer to user {target_user_id}")
        await sio.emit('call_accepted', {
            'answer': answer,
            'from': active_users[sid]['user_id']
        }, room=target_sid)
    else:
        print(f"❌ Caller {target_user_id} not found")


@sio.event
async def reject_call(sid, data):
    """Reject an incoming call"""
    target_user_id = data.get('targetUserId')
    
    # Find caller's sid
    target_sid = None
    for user_sid, user_data in active_users.items():
        if user_data['user_id'] == target_user_id:
            target_sid = user_sid
            break
    
    if target_sid:
        print(f"❌ Call rejected, notifying user {target_user_id}")
        await sio.emit('call_rejected', {}, room=target_sid)


@sio.event
async def end_call(sid, data):
    """End an active call"""
    target_user_id = data.get('targetUserId')
    
    if not target_user_id:
        return
    
    # Find other party's sid
    target_sid = None
    for user_sid, user_data in active_users.items():
        if user_data['user_id'] == target_user_id:
            target_sid = user_sid
            break
    
    if target_sid:
        print(f"📴 Call ended, notifying user {target_user_id}")
        await sio.emit('call_ended', {}, room=target_sid)


@sio.event
async def ice_candidate(sid, data):
    """Exchange ICE candidates for WebRTC"""
    candidate = data.get('candidate')
    target_user_id = data.get('targetUserId')
    
    if sid not in active_users:
        return
    
    # Find other party's sid
    target_sid = None
    for user_sid, user_data in active_users.items():
        if user_data['user_id'] == target_user_id:
            target_sid = user_sid
            break
    
    if target_sid:
        await sio.emit('ice_candidate', {
            'candidate': candidate,
            'from': active_users[sid]['user_id']
        }, room=target_sid)


async def update_users_list(project_id: str):
    """Send updated users list to all users in a project"""
    if project_id not in project_rooms:
        return
    
    users_list = []
    for user_sid in project_rooms[project_id]:
        if user_sid in active_users:
            user_data = active_users[user_sid]
            users_list.append({
                'id': user_data['user_id'],
                'name': user_data['name'],
                'online': True
            })
    
    # Emit to all users in the project
    for user_sid in project_rooms[project_id]:
        await sio.emit('users_update', users_list, room=user_sid)
