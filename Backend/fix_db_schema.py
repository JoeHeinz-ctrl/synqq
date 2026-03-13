"""
Quick fix to ensure all task columns exist
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

def fix_schema():
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
        
        # Check columns
        cursor.execute("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'tasks'
        """)
        cols = [row[0] for row in cursor.fetchall()]
        print(f"Current columns: {cols}")
        
        # Add missing columns
        missing = []
        for col, typ in [
            ('description', 'TEXT'),
            ('due_date', 'VARCHAR(20)'),
            ('assigned_user_id', 'INTEGER'),
            ('created_at', 'TIMESTAMP')
        ]:
            if col not in cols:
                try:
                    cursor.execute(f"ALTER TABLE tasks ADD COLUMN {col} {typ}")
                    missing.append(col)
                    print(f"✅ Added {col}")
                except Exception as e:
                    print(f"⚠️  {col}: {e}")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"✅ Fixed {len(missing)} columns")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    fix_schema()
