from sqlalchemy.orm import Session
from app.models.project import Project

class ProjectService:

    @staticmethod
    def create_project(db: Session, name: str, owner_id: int):
        project = Project(name=name, owner_id=owner_id)
        db.add(project)
        db.commit()
        db.refresh(project)
        return project

    @staticmethod
    def get_projects(db: Session):
        return db.query(Project).all()
