from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.services.subscription_service import SubscriptionLimits

router = APIRouter(prefix="/subscription", tags=["Subscription"])

@router.get("/usage")
def get_usage_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get current usage statistics for the logged-in user"""
    return SubscriptionLimits.get_user_usage_stats(current_user, db)

@router.get("/limits")
def get_subscription_limits(
    current_user: User = Depends(get_current_user),
):
    """Get subscription limits for the current user"""
    if current_user.subscription_tier == "premium":
        return {
            "tier": "premium",
            "personal_projects": "unlimited",
            "groups": "unlimited", 
            "group_projects": "unlimited"
        }
    
    return {
        "tier": "free",
        "personal_projects": SubscriptionLimits.FREE_PERSONAL_PROJECTS,
        "groups": SubscriptionLimits.FREE_GROUPS,
        "group_projects": SubscriptionLimits.FREE_GROUP_PROJECTS
    }
