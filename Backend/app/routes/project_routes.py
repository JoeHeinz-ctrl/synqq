from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.project import Project
from app.models.team import TeamMember
from app.models.user import User
from app.schemas.schema import ProjectCreate
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/")
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # If team_id is provided, verify the user is a member
    if payload.team_id is not None:
        membership = db.query(TeamMember).filter(
            TeamMember.team_id == payload.team_id,
            TeamMember.user_id == current_user.id,
        ).first()
        if not membership:
            raise HTTPException(status_code=403, detail="You are not a member of this team")

    project = Project(title=payload.title, owner_id=current_user.id, team_id=payload.team_id)
    db.add(project)
    db.commit()
    db.refresh(project)
    return {"id": project.id, "title": project.title, "owner_id": project.owner_id, "team_id": project.team_id}


@router.get("/")
def get_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Return only personal projects (no team affiliation)
    projects = db.query(Project).filter(
        Project.owner_id == current_user.id,
        Project.team_id == None,
    ).all()
    return [{"id": p.id, "title": p.title, "owner_id": p.owner_id, "team_id": p.team_id} for p in projects]


@router.patch("/{project_id}")
def rename_project(
    project_id: int,
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.title = payload.title
    db.commit()
    db.refresh(project)
    return {"id": project.id, "title": project.title, "owner_id": project.owner_id, "team_id": project.team_id}


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.owner_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"detail": "Project deleted"}
