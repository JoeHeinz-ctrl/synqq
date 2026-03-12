from fastapi import FastAPI
from app.routes import auth_routes, project_routes, task_routes
from app.routes import team_routes
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.team import Team, TeamMember
from app.models.message import Message
import socketio

from app.routes import auth_routes, project_routes, task_routes, team_routes
from app.socket_handler import sio

# ⭐ Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Management App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://synqq-neon.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_routes.router)
app.include_router(project_routes.router)
app.include_router(task_routes.router)
app.include_router(team_routes.router)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀 with Socket.IO v2"}

@app.get("/socket-test")
def socket_test():
    """Test endpoint to verify socket.io is configured"""
    return {
        "socket_configured": True,
        "active_users": len(active_users),
        "project_rooms": {k: len(v) for k, v in project_rooms.items()}
    }

# Import the dictionaries from socket_handler
from app.socket_handler import active_users, project_rooms

# Wrap FastAPI app with Socket.IO - MUST be at the end
socket_app = socketio.ASGIApp(sio, app)
