import random
import string

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.team import Team, TeamMember
from app.models.project import Project
from app.models.user import User
from app.schemas.schema import TeamCreate, TeamJoin
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/teams", tags=["Teams"])


def _generate_code(length: int = 8) -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


# ── Create a new team ─────────────────────────────────────────────────────────
@router.post("/")
def create_team(
    payload: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Generate unique code
    for _ in range(10):
        code = _generate_code()
        if not db.query(Team).filter(Team.team_code == code).first():
            break
    else:
        raise HTTPException(status_code=500, detail="Could not generate unique team code")

    team = Team(name=payload.name, team_code=code, owner_id=current_user.id)
    db.add(team)
    db.flush()  # get team.id before adding member

    member = TeamMember(team_id=team.id, user_id=current_user.id)
    db.add(member)
    db.commit()
    db.refresh(team)

    return {
        "id": team.id,
        "name": team.name,
        "team_code": team.team_code,
        "owner_id": team.owner_id,
    }


# ── Join a team by code ───────────────────────────────────────────────────────
@router.post("/join")
def join_team(
    payload: TeamJoin,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    team = db.query(Team).filter(Team.team_code == payload.team_code.upper()).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found — check the code and try again")

    already = db.query(TeamMember).filter(
        TeamMember.team_id == team.id,
        TeamMember.user_id == current_user.id,
    ).first()
    if already:
        raise HTTPException(status_code=400, detail="You are already a member of this team")

    member = TeamMember(team_id=team.id, user_id=current_user.id)
    db.add(member)
    db.commit()

    return {
        "id": team.id,
        "name": team.name,
        "team_code": team.team_code,
        "owner_id": team.owner_id,
    }


# ── List teams the current user belongs to ────────────────────────────────────
@router.get("/")
def get_my_teams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    memberships = (
        db.query(TeamMember).filter(TeamMember.user_id == current_user.id).all()
    )
    team_ids = [m.team_id for m in memberships]
    teams = db.query(Team).filter(Team.id.in_(team_ids)).all()
    return [
        {"id": t.id, "name": t.name, "team_code": t.team_code, "owner_id": t.owner_id}
        for t in teams
    ]


# ── List projects for a specific team ─────────────────────────────────────────
@router.get("/{team_id}/projects")
def get_team_projects(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify membership
    membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == current_user.id,
    ).first()
    if not membership:
        raise HTTPException(status_code=403, detail="You are not a member of this team")

    projects = db.query(Project).filter(Project.team_id == team_id).all()
    return [{"id": p.id, "title": p.title, "owner_id": p.owner_id, "team_id": p.team_id} for p in projects]
