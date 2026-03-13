from sqlalchemy.orm import Session
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
