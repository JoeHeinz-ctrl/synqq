from sqlalchemy.orm import Session
from app.models.user import User
from app.models.team import Team
from app.models.project import Project
from fastapi import HTTPException

class SubscriptionLimits:
    FREE_PERSONAL_PROJECTS = 3
    FREE_GROUPS = 1
    FREE_GROUP_PROJECTS = 1
    
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
    def check_group_creation_limit(user: User, db: Session):
        """Check if user can create more groups"""
        if user.subscription_tier == "premium":
            return True
            
        current_count = db.query(Team).filter(Team.owner_id == user.id).count()
        
        if current_count >= SubscriptionLimits.FREE_GROUPS:
            raise HTTPException(
                status_code=403,
                detail=f"Group limit reached ({SubscriptionLimits.FREE_GROUPS}). Upgrade to premium for unlimited groups."
            )
        return True
    
    @staticmethod
    def check_group_project_limit(team: Team, db: Session):
        """Check if team can have more projects"""
        if team.owner.subscription_tier == "premium":
            return True
            
        current_count = db.query(Project).filter(Project.team_id == team.id).count()
        
        if current_count >= SubscriptionLimits.FREE_GROUP_PROJECTS:
            raise HTTPException(
                status_code=403,
                detail=f"Group project limit reached ({SubscriptionLimits.FREE_GROUP_PROJECTS}). Upgrade to premium for unlimited group projects."
            )
        return True
    
    @staticmethod
    def get_user_usage_stats(user: User, db: Session):
        """Get current usage statistics for a user"""
        personal_projects = db.query(Project).filter(
            Project.owner_id == user.id,
            Project.team_id.is_(None)
        ).count()
        
        groups_created = db.query(Team).filter(Team.owner_id == user.id).count()
        
        group_projects = 0
        if groups_created > 0:
            group_projects = db.query(Project).join(Team).filter(Team.owner_id == user.id).count()
        
        return {
            "subscription_tier": user.subscription_tier,
            "personal_projects": {
                "used": personal_projects,
                "limit": SubscriptionLimits.FREE_PERSONAL_PROJECTS if user.subscription_tier == "free" else "unlimited"
            },
            "groups": {
                "used": groups_created,
                "limit": SubscriptionLimits.FREE_GROUPS if user.subscription_tier == "free" else "unlimited"
            },
            "group_projects": {
                "used": group_projects,
                "limit": SubscriptionLimits.FREE_GROUP_PROJECTS if user.subscription_tier == "free" else "unlimited"
            }
        }
