"""
Migration script to add new columns to Task model for AI features
Run this once to update existing database
"""
import sqlite3

def migrate_database():
    conn = sqlite3.connect('project.db')
    cursor = conn.cursor()
    
    # Check if columns already exist
    cursor.execute("PRAGMA table_info(tasks)")
    columns = [col[1] for col in cursor.fetchall()]
    
    migrations = []
    
    if 'description' not in columns:
        migrations.append("ALTER TABLE tasks ADD COLUMN description TEXT")
    
    if 'assigned_user_id' not in columns:
        migrations.append("ALTER TABLE tasks ADD COLUMN assigned_user_id INTEGER")
    
    if 'source' not in columns:
        migrations.append("ALTER TABLE tasks ADD COLUMN source TEXT")
    
    if 'chat_message_id' not in columns:
        migrations.append("ALTER TABLE tasks ADD COLUMN chat_message_id INTEGER")
    
    if 'due_date' not in columns:
        migrations.append("ALTER TABLE tasks ADD COLUMN due_date TEXT")
    
    if 'created_at' not in columns:
        migrations.append("ALTER TABLE tasks ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    
    # Execute migrations
    for migration in migrations:
        try:
            cursor.execute(migration)
            print(f"✅ Executed: {migration}")
        except Exception as e:
            print(f"❌ Failed: {migration} - {e}")
    
    conn.commit()
    conn.close()
    
    if migrations:
        print(f"\n✅ Migration complete! Added {len(migrations)} columns.")
    else:
        print("\n✅ Database is already up to date!")

if __name__ == "__main__":
    migrate_database()
