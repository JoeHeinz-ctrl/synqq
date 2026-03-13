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
import os
import psycopg2
from urllib.parse import urlparse

from app.routes import auth_routes, project_routes, task_routes, team_routes
from app.socket_handler import sio

# ⭐ Create database tables
Base.metadata.create_all(bind=engine)

# ⭐ Run migrations to add missing columns
def run_migrations():
    """Ensure all required columns exist in the database"""
    try:
        from dotenv import load_dotenv
        load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))
        
        db_user = os.getenv('DB_USER')
        db_password = os.getenv('DB_PASSWORD')
        db_host = os.getenv('DB_HOST')
        db_port = os.getenv('DB_PORT', '5432')
        db_name = os.getenv('DB_NAME')
        
        if not all([db_user, db_password, db_host, db_name]):
            print("⚠️  Skipping migrations - database config incomplete")
            return
        
        database_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        parsed = urlparse(database_url)
        
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
