from sqlalchemy.orm import Session
from app.models.user import User
from app.models.team import Team
from app.models.project import Project
from fastapi import HTTPException

class SubscriptionLimits:
    FREE_PERSONAL_PROJECTS = 3
    FREE_TEAMS = 1
    FREE_TEAM_PROJECTS = 1
    
    @staticmethod
    def check_personal_project_limit(user: User, db: Session):
        """Check if user can create more personal projects"""
        if user.subscription_tier == "premium":
            return True
            
        current_count = db.query(Project).filter(
            Project.owner_id == user.id,
            Project.team_id.is_(None)
        ).count()
        
        if current_count >= SubscriptionLimits.FREE_PERSONAL_PROJECTS:
            raise HTTPException(
                status_code=403,
                detail=f"Personal project limit reached ({SubscriptionLimits.FREE_PERSONAL_PROJECTS}). Upgrade to premium for unlimited projects."
            )
        return True
    
    @staticmethod
    def check_team_creation_limit(user: User, db: Session):
        """Check if user can create a team"""
        if user.subscription_tier == "premium":
            return True
            
        current_count = db.query(Team).filter(Team.owner_id == user.id).count()
        
        if current_count >= SubscriptionLimits.FREE_TEAMS:
            raise HTTPException(
                status_code=403,
                detail="Team limit reached (1 max). Upgrade to premium for unlimited teams."
            )
        return True
    
    @staticmethod
    def check_team_project_limit(team: Team, db: Session):
        """Check if team can have more projects"""
        if team.owner.subscription_tier == "premium":
            return True
            
        current_count = db.query(Project).filter(Project.team_id == team.id).count()
        
        if current_count >= SubscriptionLimits.FREE_TEAM_PROJECTS:
            raise HTTPException(
                status_code=403,
                detail="Project limit reached (1 per team). Upgrade to premium for unlimited projects."
            )
        return True
    
    @staticmethod
    def get_user_usage_stats(user: User, db: Session):
        """Get current usage statistics for a user"""
        personal_projects = db.query(Project).filter(
            Project.owner_id == user.id,
            Project.team_id.is_(None)
        ).count()
        
        teams_created = db.query(Team).filter(Team.owner_id == user.id).count()
        
        team_projects = 0
        if teams_created > 0:
            team_projects = db.query(Project).join(Team).filter(Team.owner_id == user.id).count()
        
        is_free = user.subscription_tier == "free"
        
        return {
            "subscription_tier": user.subscription_tier,
            "personal_projects": {
                "used": personal_projects,
                "limit": SubscriptionLimits.FREE_PERSONAL_PROJECTS if is_free else "unlimited"
            },
            "teams": {
                "used": teams_created,
                "limit": SubscriptionLimits.FREE_TEAMS if is_free else "unlimited"
            },
            "team_projects": {
                "used": team_projects,
                "limit": SubscriptionLimits.FREE_TEAM_PROJECTS if is_free else "unlimited"
            }
        }
