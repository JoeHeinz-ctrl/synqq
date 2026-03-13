"""
EMERGENCY FIX: Temporarily disable AI features to get app working
Run this if you need the app working immediately before migration
"""
import os
import shutil

def emergency_fix():
    """Temporarily revert Task model to basic version"""
    
    print("🚨 EMERGENCY FIX: Reverting to basic Task model...")
    
    # Backup current task model
    if os.path.exists("app/models/task.py"):
        shutil.copy("app/models/task.py", "app/models/task_ai_backup.py")
        print("✅ Backed up AI Task model to task_ai_backup.py")
    
    # Create basic task model
    basic_task_model = '''from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    status = Column(String, default="TODO")
    position = Column(Float, default=0.0, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    project = relationship("Project", back_populates="tasks")
'''
    
    # Write basic model
    with open("app/models/task.py", "w") as f:
        f.write(basic_task_model)
    
    print("✅ Reverted to basic Task model")
    
    # Update TaskService to basic version
    basic_task_service = '''from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.project import Project


class TaskService:

    @staticmethod
    def create_task(db: Session, title: str, project_id: int, status: str, position: float = 0.0):
        task = Task(title=title, project_id=project_id, status=status, position=position)
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def get_tasks_for_user(db: Session, user_id: int):
        return (
            db.query(Task)
            .join(Project, Task.project_id == Project.id)
            .filter(Project.owner_id == user_id)
            .all()
        )
'''
    
    with open("app/services/task_service.py", "w") as f:
        f.write(basic_task_service)
    
    print("✅ Reverted TaskService to basic version")
    
    print("\n🎯 EMERGENCY FIX COMPLETE!")
    print("✅ App should now work without AI features")
    print("✅ Basic task creation/deletion should work")
    print("\n📋 To restore AI features later:")
    print("1. Run: python migrate_postgresql.py")
    print("2. Restore: cp app/models/task_ai_backup.py app/models/task.py")
    print("3. Restart the application")

if __name__ == "__main__":
    emergency_fix()