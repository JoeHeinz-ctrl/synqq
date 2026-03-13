"""
PostgreSQL Migration script for SYNQ AI features
Run this to add new columns to the tasks table in production
"""
import os
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
load_dotenv('../.env')  # Also try root .env

def get_database_url():
    """Get database URL from environment variables"""
    # Try common environment variable names
    database_url = (
        os.getenv('DATABASE_URL') or 
        os.getenv('POSTGRES_URL') or 
        os.getenv('DB_URL') or
        os.getenv('RAILWAY_DATABASE_URL')
    )
    
    # If no full URL, construct from individual components
    if not database_url:
        db_user = os.getenv('DB_USER')
        db_password = os.getenv('DB_PASSWORD')
        db_host = os.getenv('DB_HOST')
        db_port = os.getenv('DB_PORT', '5432')
        db_name = os.getenv('DB_NAME')
        
        if all([db_user, db_password, db_host, db_name]):
            database_url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
            print(f"✅ Constructed database URL from environment variables")
        else:
            print("❌ No database URL found in environment variables")
            print("Please set one of: DATABASE_URL, POSTGRES_URL, DB_URL, RAILWAY_DATABASE_URL")
            print("Or set: DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME")
            return None
    
    return database_url

def migrate_postgresql():
    """Add new AI columns to PostgreSQL tasks table"""
    database_url = get_database_url()
    if not database_url:
        return False
    
    try:
        # Parse the database URL
        parsed = urlparse(database_url)
        
        # Connect to PostgreSQL
        conn = psycopg2.connect(
            host=parsed.hostname,
            port=parsed.port or 5432,
            database=parsed.path[1:],  # Remove leading slash
            user=parsed.username,
            password=parsed.password
        )
        
        cursor = conn.cursor()
        
        print("🔗 Connected to PostgreSQL database")
        
        # Check existing columns
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tasks'
        """)
        
        existing_columns = [row[0] for row in cursor.fetchall()]
        print(f"📋 Existing columns: {existing_columns}")
        
        # Define new columns to add
        new_columns = [
            ("description", "TEXT"),
            ("assigned_user_id", "INTEGER"),
            ("source", "VARCHAR(50)"),
            ("chat_message_id", "INTEGER"),
            ("due_date", "VARCHAR(20)"),
            ("created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
        ]
        
        migrations_applied = 0
        
        for column_name, column_type in new_columns:
            if column_name not in existing_columns:
                try:
                    sql = f"ALTER TABLE tasks ADD COLUMN {column_name} {column_type}"
                    cursor.execute(sql)
                    print(f"✅ Added column: {column_name} {column_type}")
                    migrations_applied += 1
                except Exception as e:
                    print(f"❌ Failed to add {column_name}: {e}")
        
        # Add foreign key constraints if columns were added
        if "assigned_user_id" in [col[0] for col in new_columns if col[0] not in existing_columns]:
            try:
                cursor.execute("""
                    ALTER TABLE tasks 
                    ADD CONSTRAINT fk_tasks_assigned_user 
                    FOREIGN KEY (assigned_user_id) REFERENCES users(id)
                """)
                print("✅ Added foreign key constraint for assigned_user_id")
            except Exception as e:
                print(f"⚠️  Foreign key constraint warning: {e}")
        
        # Commit changes
        conn.commit()
        cursor.close()
        conn.close()
        
        if migrations_applied > 0:
            print(f"\n🎉 Migration complete! Added {migrations_applied} columns to tasks table.")
            print("✅ SYNQ AI features are now ready!")
        else:
            print("\n✅ Database is already up to date!")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting PostgreSQL migration for SYNQ AI...")
    success = migrate_postgresql()
    
    if success:
        print("\n🎯 Next steps:")
        print("1. Restart your application")
        print("2. Test task creation in the UI")
        print("3. Test AI suggestions in team chat")
    else:
        print("\n🚨 Migration failed. Please check the error messages above.")