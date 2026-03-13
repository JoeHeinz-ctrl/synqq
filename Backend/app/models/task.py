from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True, default="")

    status = Column(String, default="TODO")
    position = Column(Float, default=0.0, nullable=False)

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    assigned_user_id = Column(Integer, ForeignKey("users.id"), nullable=True, default=None)
    
    # AI metadata
    source = Column(String, nullable=True, default="manual")  # "chat_ai", "manual", etc.
    chat_message_id = Column(Integer, nullable=True, default=None)
    due_date = Column(String, nullable=True, default=None)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=True)

    project = relationship("Project", back_populates="tasks")
    assigned_user = relationship("User", foreign_keys=[assigned_user_id])
