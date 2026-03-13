"""
Safe Task model that works with both old and new database schemas
Use this temporarily until migration is complete
"""
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class TaskSafe(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    status = Column(String, default="TODO")
    position = Column(Float, default=0.0, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Only include basic relationships that exist in old schema
    project = relationship("Project", back_populates="tasks")