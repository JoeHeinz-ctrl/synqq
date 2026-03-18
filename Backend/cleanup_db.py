"""
Database cleanup script for SaaS MVP limits
Enforces: 3 personal projects max, 1 team max, 1 project in that team max
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.db.database import DATABASE_URL, Base, engine
from app.models.user import User
from app.models.team import Team, TeamMember
from app.models.project import Project
from app.models.task import Task
from app.models.message import Message

def cleanup_database():
    """Clean up database to enforce limits"""
    print("🧹 Starting database cleanup...")
    
    from app.db.session import SessionLocal
    db = SessionLocal()
    
    try:
        # Get all users
        users = db.query(User).all()
        
        for user in users:
            print(f"\n👤 Processing user: {user.name} (ID: {user.id})")
            
            # 1. Keep only first 3 personal projects (no team_id)
            personal_projects = db.query(Project).filter(
                Project.owner_id == user.id,
                Project.team_id.is_(None)
            ).order_by(Project.id).all()
            
            if len(personal_projects) > 3:
                excess = personal_projects[3:]
                print(f"  🗑️ Deleting {len(excess)} excess personal projects")
                for proj in excess:
                    # Delete associated tasks and messages first
                    db.query(Task).filter(Task.project_id == proj.id).delete()
                    db.query(Message).filter(Message.project_id == proj.id).delete()
                    db.delete(proj)
                db.commit()
                print(f"  ✅ Kept first 3 personal projects")
            else:
                print(f"  ✓ Has {len(personal_projects)} personal projects (OK)")
            
            # 2. Keep only 1 team (first one created)
            teams = db.query(Team).filter(Team.owner_id == user.id).order_by(Team.id).all()
            
            if len(teams) > 1:
                keep_team = teams[0]
                excess_teams = teams[1:]
                
                print(f"  🗑️ Deleting {len(excess_teams)} excess teams")
                
                for team in excess_teams:
                    # Delete all projects in this team
                    team_projects = db.query(Project).filter(Project.team_id == team.id).all()
                    for proj in team_projects:
                        db.query(Task).filter(Task.project_id == proj.id).delete()
                        db.query(Message).filter(Message.project_id == proj.id).delete()
                        db.delete(proj)
                    
                    # Delete team members
                    db.query(TeamMember).filter(TeamMember.team_id == team.id).delete()
                    
                    # Delete the team
                    db.delete(team)
                
                db.commit()
                print(f"  ✅ Kept team: {keep_team.name} (ID: {keep_team.id})")
                
                # 3. Keep only 1 project in the kept team
                team_projects = db.query(Project).filter(
                    Project.team_id == keep_team.id
                ).order_by(Project.id).all()
                
                if len(team_projects) > 1:
                    excess_projects = team_projects[1:]
                    print(f"  🗑️ Deleting {len(excess_projects)} excess team projects")
                    for proj in excess_projects:
                        db.query(Task).filter(Task.project_id == proj.id).delete()
                        db.query(Message).filter(Message.project_id == proj.id).delete()
                        db.delete(proj)
                    db.commit()
                    print(f"  ✅ Kept 1 project in team")
                else:
                    print(f"  ✓ Has {len(team_projects)} team project(s)")
            elif len(teams) == 1:
                # Check if this team has more than 1 project
                team_projects = db.query(Project).filter(
                    Project.team_id == teams[0].id
                ).order_by(Project.id).all()
                
                if len(team_projects) > 1:
                    excess_projects = team_projects[1:]
                    print(f"  🗑️ Deleting {len(excess_projects)} excess team projects")
                    for proj in excess_projects:
                        db.query(Task).filter(Task.project_id == proj.id).delete()
                        db.query(Message).filter(Message.project_id == proj.id).delete()
                        db.delete(proj)
                    db.commit()
                    print(f"  ✅ Kept 1 project in team")
                else:
                    print(f"  ✓ Has {len(team_projects)} team project(s)")
            else:
                print(f"  ✓ No teams")
        
        print("\n✅ Database cleanup complete!")
        print("\n📊 Final state per user:")
        for user in db.query(User).all():
            pp_count = db.query(Project).filter(
                Project.owner_id == user.id,
                Project.team_id.is_(None)
            ).count()
            teams = db.query(Team).filter(Team.owner_id == user.id).all()
            team_count = len(teams)
            team_proj_count = 0
            if teams:
                team_proj_count = db.query(Project).filter(
                    Project.team_id == teams[0].id
                ).count()
            print(f"  {user.name}: {pp_count} personal projects, {team_count} team(s), {team_proj_count} team project(s)")
        
    except Exception as e:
        print(f"\n❌ Error during cleanup: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    cleanup_database()
