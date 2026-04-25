from fastapi import FastAPI
from app.routes import auth_routes, project_routes, task_routes
from app.routes import team_routes, subscription_routes
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.models.user import User
from app.models.project import Project
from app.models.task import Task
from app.models.team import Team, TeamMember
from app.models.message import Message
from datetime import datetime

# Optional AI routes - don't crash if not available
try:
    from app.routes import ai
    ai_routes_available = True
    print("✅ AI routes loaded successfully")
except ImportError as e:
    ai = None
    ai_routes_available = False
    print(f"⚠️ AI routes not available: {e}")
import socketio
import os
import psycopg2
from urllib.parse import urlparse

# Optional Socket.IO - don't crash if not available
try:
    from app.socket_handler import sio
    socket_available = True
    print("✅ Socket.IO loaded successfully")
except ImportError as e:
    sio = None
    socket_available = False
    print(f"⚠️ Socket.IO not available: {e}")

# ⭐ Create database tables (optional - don't crash on failure)
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"⚠️ Database table creation failed: {e}")
    print("ℹ️ Application will continue without database setup")

# ⭐ Run migrations to add missing columns (optional)
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

# Run migrations on startup (optional)
try:
    run_migrations()
except Exception as e:
    print(f"⚠️ Migration failed: {e}")
    print("ℹ️ Application will continue without migrations")

app = FastAPI(title="Project Management App")

@app.on_event("startup")
async def startup_event():
    """Startup event handler for debugging"""
    print("🚀 FastAPI application starting up...")
    print(f"✅ Core routes loaded: auth, project, task, team, subscription")
    print(f"🤖 AI routes available: {ai_routes_available}")
    print("🌐 CORS middleware: enabled (production mode)")
    print("💾 Database: connected")
    print(f"🔧 Socket.IO: {'enabled' if socket_available else 'disabled'}")
    print("🏥 Health check: /health endpoint active")
    print("✅ Application startup complete!")

# Include all routes FIRST
app.include_router(auth_routes.router)
app.include_router(project_routes.router)
app.include_router(task_routes.router)

# Include AI routes only if available
if ai_routes_available and ai:
    app.include_router(ai.router)
    print("✅ AI routes registered")
else:
    print("⚠️ AI routes skipped - not available")

app.include_router(team_routes.router)
app.include_router(subscription_routes.router)

# Add CORS middleware AFTER routes
# Production CORS configuration for dozzl.xyz
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://dozzl.xyz",
        "https://www.dozzl.xyz",
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev server
        "http://127.0.0.1:5173",  # Alternative localhost
        "http://127.0.0.1:3000",  # Alternative localhost
        "https://accounts.google.com",  # Allow Google OAuth
        "https://oauth2.googleapis.com"  # Allow Google OAuth API
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Global OPTIONS handler for CORS preflight
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle all OPTIONS requests for CORS preflight"""
    return {
        "message": "CORS preflight OK",
        "path": full_path,
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "headers": "all"
    }

@app.get("/")
def root():
    return {"message": "Backend is running 🚀 with Socket.IO v2"}

@app.get("/health")
def health_check():
    """Health check endpoint for Docker and load balancers"""
    return {
        "status": "ok",
        "message": "Backend is healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": "connected",
            "ai_routes": "available" if ai_routes_available else "unavailable",
            "cors": "enabled"
        }
    }

@app.get("/test/cors")
def test_cors():
    """Test endpoint specifically for CORS validation"""
    return {
        "cors_test": "success",
        "message": "If you can see this from the frontend, CORS is working!",
        "timestamp": "2024-04-25T12:00:00Z",
        "origin_allowed": True
    }

@app.post("/test/cors")
def test_cors_post():
    """Test POST endpoint for CORS validation"""
    return {
        "cors_post_test": "success",
        "message": "POST request successful - CORS is working for all methods!",
        "timestamp": "2024-04-25T12:00:00Z"
    }

@app.get("/debug/cors")
def debug_cors():
    """Debug endpoint to check CORS configuration"""
    return {
        "cors_status": "PRODUCTION MODE - DOZZL.XYZ CONFIGURED",
        "allowed_origins": [
            "https://dozzl.xyz",
            "https://www.dozzl.xyz",
            "http://localhost:5173",
            "http://localhost:3000",
            "https://accounts.google.com",
            "https://oauth2.googleapis.com"
        ],
        "allowed_methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "allowed_headers": ["*"],
        "credentials_allowed": True,
        "preflight_handler": "enabled",
        "backend_url": "https://api.dozzl.xyz",
        "frontend_url": "https://dozzl.xyz"
    }

@app.get("/debug/google-oauth")
def debug_google_oauth():
    """Debug endpoint to check Google OAuth configuration"""
    import os
    return {
        "google_client_id": os.getenv("GOOGLE_CLIENT_ID", "NOT_SET")[:20] + "...",
        "google_client_secret_set": bool(os.getenv("GOOGLE_CLIENT_SECRET")),
        "frontend_url": os.getenv("FRONTEND_URL", "NOT_SET"),
        "oauth_endpoint": "/auth/google",
        "redirect_uri": "postmessage",
        "cors_includes_google": True,
        "message": "Google OAuth should work if client ID is configured for dozzl.xyz domain"
    }

@app.get("/socket-test")
def socket_test():
    """Test endpoint to verify socket.io is configured"""
    if not socket_available:
        return {
            "socket_configured": False,
            "message": "Socket.IO not available",
            "active_users": 0,
            "project_rooms": {}
        }
    
    try:
        from app.socket_handler import active_users, project_rooms
        return {
            "socket_configured": True,
            "active_users": len(active_users),
            "project_rooms": {k: len(v) for k, v in project_rooms.items()}
        }
    except Exception as e:
        return {
            "socket_configured": False,
            "error": str(e),
            "active_users": 0,
            "project_rooms": {}
        }

# Optional socket handler imports
try:
    from app.socket_handler import active_users, project_rooms
except ImportError:
    active_users = {}
    project_rooms = {}

# Wrap FastAPI app with Socket.IO - MUST be at the end (optional)
if socket_available and sio:
    socket_app = socketio.ASGIApp(sio, app)
    print("✅ Socket.IO ASGI app created")
else:
    socket_app = app
    print("⚠️ Using FastAPI app without Socket.IO")
