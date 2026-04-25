from fastapi import FastAPI
from app.routes import auth_routes, project_routes, task_routes, ai_routes
from app.routes import team_routes, subscription_routes
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.team import Team, TeamMember
from app.models.message import Message
import socketio
import os
import psycopg2
from urllib.parse import urlparse

from app.routes import auth_routes, project_routes, task_routes, team_routes, subscription_routes
from app.socket_handler import sio

# ⭐ Create database tables
Base.metadata.create_all(bind=engine)

# ⭐ Run migrations to add missing columns
def run_migrations():
    """Ensure all required columns exist in the database"""
    try:
        from app.db.database import DATABASE_URL
        
        if not DATABASE_URL or DATABASE_URL.startswith("sqlite"):
            print("ℹ️ Skipping migrations - using SQLite or no database configured")
            return
            
        parsed = urlparse(DATABASE_URL)
        
        conn = psycopg2.connect(
            host=parsed.hostname,
            port=parsed.port or 5432,
            database=parsed.path[1:],
            user=parsed.username,
            password=parsed.password
        )
        cursor = conn.cursor()
        
        # Check existing columns
        cursor.execute("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'tasks'
        """)
        existing_cols = [row[0] for row in cursor.fetchall()]
        
        # Add missing columns
        new_columns = [
            ("description", "TEXT"),
            ("assigned_user_id", "INTEGER"),
            ("source", "VARCHAR(50)"),
            ("chat_message_id", "INTEGER"),
            ("due_date", "VARCHAR(20)"),
            ("created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
        ]
        
        # Add subscription-related columns for users table
        cursor.execute("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'users'
        """)
        existing_user_cols = [row[0] for row in cursor.fetchall()]
        
        user_columns = [
            ("subscription_tier", "VARCHAR(20) DEFAULT 'free'"),
            ("projects_created", "INTEGER DEFAULT 0"),
            ("groups_created", "INTEGER DEFAULT 0")
        ]
        
        for col_name, col_type in user_columns:
            if col_name not in existing_user_cols:
                try:
                    cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
                    print(f"✅ Added user column: {col_name}")
                except Exception as e:
                    print(f"⚠️  User column {col_name}: {e}")
        
        # Add subscription-related columns for teams table
        cursor.execute("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'teams'
        """)
        existing_team_cols = [row[0] for row in cursor.fetchall()]
        
        team_columns = [
            ("group_projects_created", "INTEGER DEFAULT 0")
        ]
        
        for col_name, col_type in team_columns:
            if col_name not in existing_team_cols:
                try:
                    cursor.execute(f"ALTER TABLE teams ADD COLUMN {col_name} {col_type}")
                    print(f"✅ Added team column: {col_name}")
                except Exception as e:
                    print(f"⚠️  Team column {col_name}: {e}")
        
        for col_name, col_type in new_columns:
            if col_name not in existing_cols:
                try:
                    cursor.execute(f"ALTER TABLE tasks ADD COLUMN {col_name} {col_type}")
                    print(f"✅ Added column: {col_name}")
                except Exception as e:
                    print(f"⚠️  Column {col_name}: {e}")
        
        # Add foreign key if needed
        if "assigned_user_id" in [c[0] for c in new_columns if c[0] not in existing_cols]:
            try:
                cursor.execute("""
                    ALTER TABLE tasks 
                    ADD CONSTRAINT fk_tasks_assigned_user 
                    FOREIGN KEY (assigned_user_id) REFERENCES users(id)
                """)
                print("✅ Added foreign key constraint")
            except:
                pass
        
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database migrations complete")
    except Exception as e:
        print(f"⚠️  Migration warning: {e}")

# Run migrations on startup
run_migrations()

app = FastAPI(title="Project Management App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://synqq.vercel.app",
        "https://synqq-neon.vercel.app",
        "https://dozzl.xyz",
        "https://www.dozzl.xyz",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)


app.include_router(auth_routes.router)
app.include_router(project_routes.router)
app.include_router(task_routes.router)
app.include_router(ai_routes.router, prefix="/api/ai", tags=["ai"])
app.include_router(team_routes.router)
app.include_router(subscription_routes.router)

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
