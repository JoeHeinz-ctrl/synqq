from pydantic import BaseModel, EmailStr
from typing import List, Optional

# -------- PROJECT --------
class ProjectCreate(BaseModel):
    title: str
    team_id: Optional[int] = None

# -------- TASK --------
class TaskCreate(BaseModel):
    title: str
    status: str = "todo"
    project_id: int

class TaskFromChat(BaseModel):
    title: str
    project_id: int
    assigned_user_id: Optional[int] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    chat_message_id: Optional[int] = None

class TaskReorder(BaseModel):
    task_ids: List[int]

# -------- USER --------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# -------- TEAM --------
class TeamCreate(BaseModel):
    name: str

class TeamJoin(BaseModel):
    team_code: str
