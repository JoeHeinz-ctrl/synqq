from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from sqlalchemy import or_
from typing import List

from app.db.session import get_db
from app.schemas.schema import TaskCreate, TaskReorder
from app.services.task_service import TaskService

from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.task import Task
from app.models.project import Project
from app.models.team import TeamMember

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# Helper function to check user access to a project (owner or team member)
def user_has_project_access(db: Session, project_id: int, user_id: int) -> bool:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return False
    
    # Check if user is the owner
    if project.owner_id == user_id:
        return True
    
    # Check if user is a team member (if project belongs to a team)
    if project.team_id:
        return db.query(TeamMember).filter(
            TeamMember.team_id == project.team_id,
            TeamMember.user_id == user_id
        ).first() is not None
    
    return False


# CREATE TASK (User Protected)
@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Check if user has access to the project (owner or team member)
        if not user_has_project_access(db, task.project_id, current_user.id):
            raise HTTPException(status_code=404, detail="Project not found or not authorized")

        # Assign position at the end of the column
        max_task = (
            db.query(Task)
            .filter(Task.project_id == task.project_id, Task.status == task.status)
            .order_by(Task.position.desc())
            .first()
        )
        next_position = (max_task.position + 1.0) if max_task else 0.0

        return TaskService.create_task(
            db=db,
            title=task.title,
            project_id=task.project_id,
            status=task.status,
            position=next_position,
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Task creation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")


# GET TASKS (User Isolated, sorted by position)
@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get tasks from projects the user owns OR is a team member of
    return (
        db.query(Task)
        .join(Project, Task.project_id == Project.id)
        .outerjoin(TeamMember, (Project.team_id == TeamMember.team_id) & (TeamMember.user_id == current_user.id))
        .filter(
            or_(
                Project.owner_id == current_user.id,
                TeamMember.user_id == current_user.id
            )
        )
        .order_by(Task.position.asc())
        .all()
    )


# REORDER TASKS WITHIN A COLUMN — must come BEFORE /{task_id} routes
@router.put("/reorder")
def reorder_tasks(
    payload: TaskReorder,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for index, task_id in enumerate(payload.task_ids):
        task = db.query(Task).filter(Task.id == task_id).first()
        if task and user_has_project_access(db, task.project_id, current_user.id):
            task.position = float(index)

    db.commit()
    return {"success": True}


# MOVE TASK between columns (Ownership Protected)
@router.put("/{task_id}/move")
def move_task(
    task_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check if user has access to this task's project
    if not user_has_project_access(db, task.project_id, current_user.id):
        raise HTTPException(status_code=404, detail="Task not found or not authorized")

    # Place at the end of the new column
    max_task = (
        db.query(Task)
        .filter(Task.project_id == task.project_id, Task.status == status)
        .order_by(Task.position.desc())
        .first()
    )
    task.position = (max_task.position + 1.0) if (max_task and max_task.id != task.id) else 0.0
    task.status = status
    db.commit()
    db.refresh(task)

    return task


# DELETE TASK (Ownership Protected)
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check if user has access to this task's project
    if not user_has_project_access(db, task.project_id, current_user.id):
        raise HTTPException(status_code=404, detail="Task not found or not authorized")

    db.delete(task)
    db.commit()

    return {"success": True}


# RENAME TASK (Ownership Protected)
@router.patch("/{task_id}")
def rename_task(
    task_id: int,
    title: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check if user has access to this task's project
    if not user_has_project_access(db, task.project_id, current_user.id):
        raise HTTPException(status_code=404, detail="Task not found or not authorized")

    task.title = title
    db.commit()
    db.refresh(task)

    return task

