from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.project import Project
from app.models.task import Task
from app.models.team import Team, TeamMember
from app.models.user import User
from app.schemas.schema import ProjectCreate
from app.core.dependencies import get_current_user
from app.services.subscription_service import SubscriptionLimits

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/")
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check subscription limits for personal projects
    if payload.team_id is None:
        SubscriptionLimits.check_personal_project_limit(current_user, db)
    
    # If team_id is provided, verify the user is a member and check group project limits
    if payload.team_id is not None:
        membership = db.query(TeamMember).filter(
            TeamMember.team_id == payload.team_id,
            TeamMember.user_id == current_user.id,
        ).first()
        if not membership:
            raise HTTPException(status_code=403, detail="You are not a member of this team")
        
        # Check group project limits
        team = db.query(Team).filter(Team.id == payload.team_id).first()
        if team:
            SubscriptionLimits.check_group_project_limit(team, db)

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
    try:
        project = db.query(Project).filter(
            Project.id == project_id,
            Project.owner_id == current_user.id
        ).first()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Delete messages first (they reference projects)
        from app.models.message import Message
        db.query(Message).filter(Message.project_id == project_id).delete()
        
        # Delete associated tasks
        db.query(Task).filter(Task.project_id == project_id).delete()
        
        # Delete the project
        db.delete(project)
        db.commit()
        return {"detail": "Project deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Project deletion error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")


@router.get("/{project_id}/members")
def get_project_members(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all members who have access to this project"""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if user has access to this project
    if project.owner_id != current_user.id:
        if project.team_id:
            membership = db.query(TeamMember).filter(
                TeamMember.team_id == project.team_id,
                TeamMember.user_id == current_user.id,
            ).first()
            if not membership:
                raise HTTPException(status_code=403, detail="Access denied")
        else:
            raise HTTPException(status_code=403, detail="Access denied")
    
    members = []
    
    # Add project owner
    owner = db.query(User).filter(User.id == project.owner_id).first()
    if owner:
        members.append({
            "id": owner.id,
            "name": owner.name,
            "email": owner.email,
            "role": "owner"
        })
    
    # If project has a team, add all team members
    if project.team_id:
        team_members = db.query(TeamMember).filter(
            TeamMember.team_id == project.team_id
        ).all()
        
        for tm in team_members:
            if tm.user_id != project.owner_id:  # Don't duplicate owner
                user = db.query(User).filter(User.id == tm.user_id).first()
                if user:
                    members.append({
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role": "member"
                    })
    
    return members


# DELETE TEAM (Owner Only)
@router.delete("/team/{team_id}")
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a team and all its projects"""
    try:
        team = db.query(Team).filter(
            Team.id == team_id,
            Team.owner_id == current_user.id
        ).first()

        if not team:
            raise HTTPException(status_code=404, detail="Team not found or not authorized")

        # Get all projects in this team
        projects = db.query(Project).filter(Project.team_id == team_id).all()
        
        # Import Message model
        from app.models.message import Message
        
        # Delete all messages, tasks, and projects
        for project in projects:
            db.query(Message).filter(Message.project_id == project.id).delete()
            db.query(Task).filter(Task.project_id == project.id).delete()
        
        # Delete all projects
        db.query(Project).filter(Project.team_id == team_id).delete()
        
        # Delete all team members
        db.query(TeamMember).filter(TeamMember.team_id == team_id).delete()
        
        # Delete the team
        db.delete(team)
        db.commit()
        
        return {"detail": "Team and all projects deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Team deletion error: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete team: {str(e)}")
