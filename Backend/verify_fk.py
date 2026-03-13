"""
Verify and fix foreign key constraints
"""
import os
import psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()
load_dotenv('../.env')

def get_database_url():
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    db_host = os.getenv('DB_HOST')
    db_port = os.getenv('DB_PORT', '5432')
    db_name = os.getenv('DB_NAME')
    
    if all([db_user, db_password, db_host, db_name]):
        return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    return None

def verify_fk():
    database_url = get_database_url()
    if not database_url:
        print("❌ No database URL")
        return False
    
    try:
        parsed = urlparse(database_url)
        conn = psycopg2.connect(
            host=parsed.hostname,
            port=parsed.port or 5432,
            database=parsed.path[1:],
            user=parsed.username,
            password=parsed.password
        )
        cursor = conn.cursor()
        
        # Check foreign keys
        cursor.execute("""
            SELECT constraint_name, table_name 
            FROM information_schema.table_constraints 
            WHERE constraint_type = 'FOREIGN KEY' 
            AND table_name = 'tasks'
        """)
        fks = cursor.fetchall()
        print(f"Foreign keys on tasks: {fks}")
        
        # Check if assigned_user_id FK exists
        has_fk = any('assigned_user' in str(fk) for fk in fks)
        if not has_fk:
            print("⚠️  Missing FK for assigned_user_id, adding...")
            try:
                cursor.execute("""
                    ALTER TABLE tasks 
                    ADD CONSTRAINT fk_tasks_assigned_user 
                    FOREIGN KEY (assigned_user_id) REFERENCES users(id)
                """)
                conn.commit()
                print("✅ Added FK constraint")
            except Exception as e:
                print(f"⚠️  FK already exists or error: {e}")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    verify_fk()
