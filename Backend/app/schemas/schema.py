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
    status: str = "todo"

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
