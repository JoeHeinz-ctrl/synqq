from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.task import Task
from app.services.ai_engine import AIEngine
from app.db.session import get_db
from app.routes.auth_routes import get_current_user

router = APIRouter(prefix="/api/ai", tags=["AI"])
ai_engine = AIEngine()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    type: str
    data: dict
    timestamp: str
    user_message: str

@router.post("/chat", response_model=ChatResponse)
async def ai_chat(
    request: ChatRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Fetch user's tasks
        user_tasks = db.query(Task).filter(Task.assigned_tosss == current_user.id).all()
        
        # Convert tasks to dict format for AI engine
        tasks_data = []
        for task in user_tasks:
            tasks_data.append({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'status': task.status,
                'due_date': task.due_date.isoformat() if task.due_date else None,
                'priority': getattr(task, 'priority', None)
            })
        
        # Process message with AI engine
        response = ai_engine.process_message(request.message, tasks_data)
        
        # Add metadata
        response['timestamp'] = datetime.utcnow().isoformat()
        response['user_message'] = request.message
        
        return response
        
    except Exception as e:
        print(f"AI Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/suggestions")
async def get_suggestions(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get contextual suggestions based on user's current tasks"""
    try:
        # Fetch user's tasks
        user_tasks = db.query(Task).filter(Task.assigned_tosss == current_user.id).all()
        
        # Convert tasks to dict format
        tasks_data = []
        for task in user_tasks:
            tasks_data.append({
                'id': task.id,
                'title': task.title,
                'status': task.status,
                'due_date': task.due_date.isoformat() if task.due_date else None
            })
        
        # Generate contextual suggestions
        suggestions = ai_engine.get_contextual_suggestions(tasks_data)
        
        return {
            'suggestions': suggestions,
            'timestamp': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        print(f"AI Suggestions Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")