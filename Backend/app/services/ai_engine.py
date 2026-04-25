import re
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

class AIEngine:
    def __init__(self):
        self.intents = {
            'plan': ['plan my day', 'plan day', 'schedule', 'organize day', 'what should i do today', 'daily plan'],
            'break': ['break task', 'break down', 'split task', 'subtasks', 'divide task', 'break into steps'],
            'prioritize': ['prioritize', 'priority', 'what first', 'order tasks', 'most important', 'urgent'],
            'chat': ['help', 'tired', 'focus', 'stuck', 'motivation', 'advice']
        }

        self.task_templates = {
            'build': ['Design architecture', 'Set up environment', 'Implement core features', 'Add styling', 'Test functionality', 'Deploy'],
            'create': ['Plan structure', 'Gather resources', 'Draft content', 'Review and edit', 'Finalize'],
            'design': ['Research inspiration', 'Create wireframes', 'Design mockups', 'Get feedback', 'Iterate design'],
            'implement': ['Set up foundation', 'Code core logic', 'Add error handling', 'Write tests', 'Document'],
            'write': ['Outline content', 'Research topic', 'Write first draft', 'Edit and revise', 'Proofread'],
            'learn': ['Find resources', 'Study basics', 'Practice exercises', 'Build project', 'Review concepts'],
            'fix': ['Identify problem', 'Research solution', 'Implement fix', 'Test solution', 'Document changes'],
            'setup': ['Install dependencies', 'Configure settings', 'Test connection', 'Document setup'],
            'default': ['Break into smaller steps', 'Research requirements', 'Plan approach', 'Execute', 'Review results']
        }

        self.chat_responses = {
            'tired': [
                "When you're tired, focus on 1-2 small tasks today. Quality over quantity!",
                "Try the 2-minute rule: if it takes less than 2 minutes, do it now.",
                "Consider taking a short break first, then tackle your easiest task."
            ],
            'focus': [
                "Try the Pomodoro technique: 25 minutes focused work, 5 minute break.",
                "Start with your smallest task to build momentum.",
                "Remove distractions and focus on just one thing at a time."
            ],
            'stuck': [
                "Break the task into smaller, more manageable pieces.",
                "Try explaining the problem out loud or writing it down.",
                "Take a step back and approach it from a different angle."
            ],
            'motivation': [
                "Remember why you started - your goals matter!",
                "Celebrate small wins along the way.",
                "Progress, not perfection. Every step counts."
            ],
            'overwhelmed': [
                "Focus on what you can control right now.",
                "Pick just one task and ignore the rest for now.",
                "Remember: you don't have to do everything today."
            ],
            'default': [
                "I'm here to help you stay productive! Try asking me to plan your day or break down a task.",
                "What's on your mind? I can help prioritize your tasks or give you some productivity tips.",
                "Let's tackle your tasks together! Ask me to plan your day or break down complex tasks."
            ]
        }

    def detect_intent(self, message: str) -> str:
        lower_message = message.lower()
        
        for intent, keywords in self.intents.items():
            if any(keyword in lower_message for keyword in keywords):
                return intent
        
        return 'chat'

    def plan_my_day(self, tasks: List[Dict]) -> Dict[str, Any]:
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + timedelta(days=1)

        # Filter relevant tasks
        relevant_tasks = []
        for task in tasks:
            if task.get('status', '').lower() == 'done':
                continue
            
            if task.get('due_date'):
                try:
                    due_date = datetime.fromisoformat(task['due_date'].replace('Z', '+00:00'))
                    if due_date <= tomorrow:
                        relevant_tasks.append(task)
                except:
                    relevant_tasks.append(task)
            else:
                relevant_tasks.append(task)

        # Sort by priority and deadline
        def sort_key(task):
            priority_order = {'doing': 0, 'todo': 1}
            priority = priority_order.get(task.get('status', '').lower(), 2)
            
            due_date_score = 999
            if task.get('due_date'):
                try:
                    due_date = datetime.fromisoformat(task['due_date'].replace('Z', '+00:00'))
                    due_date_score = (due_date - today).days
                except:
                    pass
            
            return (priority, due_date_score)

        sorted_tasks = sorted(relevant_tasks, key=sort_key)[:6]
        
        plan = []
        for i, task in enumerate(sorted_tasks):
            plan.append({
                'id': task['id'],
                'title': task['title'],
                'status': task.get('status'),
                'due_date': task.get('due_date'),
                'priority': i + 1,
                'suggestion': self._get_task_suggestion(task, i)
            })

        return {
            'type': 'plan',
            'data': {
                'title': 'Your Day Plan',
                'tasks': plan,
                'summary': self._generate_plan_summary(plan)
            }
        }

    def break_task(self, task_title: str, existing_task: Dict = None) -> Dict[str, Any]:
        lower_title = task_title.lower()
        template = 'default'
        
        # Find matching template
        for key in self.task_templates:
            if key in lower_title:
                template = key
                break
        
        base_steps = self.task_templates[template]
        customized_steps = self._customize_steps(base_steps, task_title)
        
        subtasks = []
        for i, step in enumerate(customized_steps):
            subtasks.append({
                'title': step,
                'description': f'Step {i + 1} of breaking down: {task_title}',
                'status': 'todo',
                'parent_task': task_title
            })

        return {
            'type': 'tasks',
            'data': {
                'title': f'Breaking down: {task_title}',
                'subtasks': subtasks,
                'original_task': existing_task
            }
        }

    def prioritize_tasks(self, tasks: List[Dict]) -> Dict[str, Any]:
        active_tasks = [task for task in tasks if task.get('status', '').lower() != 'done']
        
        prioritized = []
        now = datetime.now()
        
        for task in active_tasks:
            score = 0
            
            # Deadline scoring
            if task.get('due_date'):
                try:
                    due_date = datetime.fromisoformat(task['due_date'].replace('Z', '+00:00'))
                    days_until_due = (due_date - now).days
                    
                    if days_until_due < 0:
                        score += 100  # Overdue
                    elif days_until_due == 0:
                        score += 80   # Due today
                    elif days_until_due == 1:
                        score += 60   # Due tomorrow
                    elif days_until_due <= 3:
                        score += 40   # Due this week
                    elif days_until_due <= 7:
                        score += 20   # Due next week
                except:
                    pass
            
            # Status scoring
            status = task.get('status', '').lower()
            if status == 'doing':
                score += 30
            elif status == 'todo':
                score += 10
            
            # Title-based urgency keywords
            urgent_keywords = ['urgent', 'asap', 'important', 'critical', 'deadline', 'meeting']
            title_lower = task.get('title', '').lower()
            if any(keyword in title_lower for keyword in urgent_keywords):
                score += 25
            
            task_with_score = task.copy()
            task_with_score['priority_score'] = score
            prioritized.append(task_with_score)
        
        sorted_tasks = sorted(prioritized, key=lambda x: x['priority_score'], reverse=True)
        
        for i, task in enumerate(sorted_tasks):
            task['rank'] = i + 1
            task['reason'] = self._get_priority_reason(task)
        
        return {
            'type': 'priority',
            'data': {
                'title': 'Task Priority Ranking',
                'tasks': sorted_tasks
            }
        }

    def chat_fallback(self, message: str) -> Dict[str, Any]:
        lower_message = message.lower()
        response_category = 'default'
        
        # Detect emotional/situational keywords
        if 'tired' in lower_message or 'exhausted' in lower_message:
            response_category = 'tired'
        elif 'focus' in lower_message or 'concentrate' in lower_message or 'distracted' in lower_message:
            response_category = 'focus'
        elif 'stuck' in lower_message or 'blocked' in lower_message or 'confused' in lower_message:
            response_category = 'stuck'
        elif 'motivation' in lower_message or 'give up' in lower_message or 'discouraged' in lower_message:
            response_category = 'motivation'
        elif 'overwhelmed' in lower_message or 'too much' in lower_message or 'stressed' in lower_message:
            response_category = 'overwhelmed'
        
        responses = self.chat_responses[response_category]
        random_response = random.choice(responses)
        
        return {
            'type': 'chat',
            'data': {
                'message': random_response,
                'category': response_category,
                'suggestions': self._get_chat_suggestions(response_category)
            }
        }

    def process_message(self, message: str, tasks: List[Dict]) -> Dict[str, Any]:
        intent = self.detect_intent(message)
        
        if intent == 'plan':
            return self.plan_my_day(tasks)
        elif intent == 'break':
            task_title = self._extract_task_title(message) or "Current task"
            return self.break_task(task_title)
        elif intent == 'prioritize':
            return self.prioritize_tasks(tasks)
        else:
            return self.chat_fallback(message)

    def get_contextual_suggestions(self, tasks: List[Dict]) -> List[str]:
        """Generate contextual suggestions based on current tasks"""
        suggestions = []
        
        active_tasks = [task for task in tasks if task.get('status', '').lower() != 'done']
        
        if not active_tasks:
            suggestions = ["Great job! No active tasks. Ready to plan something new?"]
        elif len(active_tasks) > 5:
            suggestions = ["You have many tasks. Try 'prioritize my tasks' to focus on what matters most."]
        else:
            suggestions = ["Plan my day", "Break down a complex task", "Prioritize my tasks"]
        
        return suggestions

    # Helper methods
    def _customize_steps(self, steps: List[str], task_title: str) -> List[str]:
        customized = []
        for step in steps:
            # Replace generic terms with task-specific ones
            customized_step = step
            if 'task' in step.lower():
                last_word = task_title.split()[-1] if task_title.split() else 'task'
                customized_step = step.replace('task', last_word).replace('Task', last_word.capitalize())
            customized.append(customized_step)
        return customized

    def _get_task_suggestion(self, task: Dict, index: int) -> str:
        if index == 0:
            return "Start here - your top priority!"
        
        if task.get('due_date'):
            try:
                due_date = datetime.fromisoformat(task['due_date'].replace('Z', '+00:00'))
                today = datetime.now()
                days_until = (due_date - today).days
                
                if days_until < 0:
                    return "Overdue - tackle this ASAP"
                elif days_until == 0:
                    return "Due today - don't delay"
                elif days_until == 1:
                    return "Due tomorrow - plan ahead"
            except:
                pass
        
        return "Good task to work on when ready"

    def _generate_plan_summary(self, plan: List[Dict]) -> str:
        total_tasks = len(plan)
        urgent_tasks = 0
        
        for task in plan:
            if task.get('due_date'):
                try:
                    due_date = datetime.fromisoformat(task['due_date'].replace('Z', '+00:00'))
                    if due_date <= datetime.now():
                        urgent_tasks += 1
                except:
                    pass
        
        if total_tasks == 0:
            return "No tasks for today - great job staying on top of things!"
        elif urgent_tasks > 0:
            return f"{total_tasks} tasks planned, {urgent_tasks} urgent. Focus on the top priorities first."
        else:
            return f"{total_tasks} tasks planned for today. Start with the first one and build momentum!"

    def _get_priority_reason(self, task: Dict) -> str:
        reasons = []
        
        if task.get('due_date'):
            try:
                due_date = datetime.fromisoformat(task['due_date'].replace('Z', '+00:00'))
                now = datetime.now()
                days_until = (due_date - now).days
                
                if days_until < 0:
                    reasons.append("Overdue")
                elif days_until == 0:
                    reasons.append("Due today")
                elif days_until == 1:
                    reasons.append("Due tomorrow")
            except:
                pass
        
        if task.get('status', '').lower() == 'doing':
            reasons.append("In progress")
        
        urgent_keywords = ['urgent', 'important', 'critical']
        title = task.get('title', '').lower()
        if any(keyword in title for keyword in urgent_keywords):
            reasons.append("Marked as urgent")
        
        return ", ".join(reasons) if reasons else "Normal priority"

    def _get_chat_suggestions(self, category: str) -> List[str]:
        suggestions = {
            'tired': ["Plan my day", "Show easy tasks", "Break down a big task"],
            'focus': ["Prioritize tasks", "Plan my day", "What should I do next?"],
            'stuck': ["Break task into steps", "Show similar tasks", "Get help"],
            'motivation': ["Show progress", "Plan my day", "Celebrate wins"],
            'overwhelmed': ["Prioritize tasks", "Plan my day", "Focus on one thing"],
            'default': ["Plan my day", "Break down a task", "Prioritize tasks"]
        }
        
        return suggestions.get(category, suggestions['default'])

    def _extract_task_title(self, message: str) -> str:
        """Extract task title from message"""
        break_keywords = ['break down', 'break task', 'split task', 'divide']
        lower_message = message.lower()
        
        for keyword in break_keywords:
            index = lower_message.find(keyword)
            if index != -1:
                after_keyword = message[index + len(keyword):].strip()
                # Remove common words and quotes
                cleaned = re.sub(r'^(the|a|an|my|this|that|"|\')\s*', '', after_keyword, flags=re.IGNORECASE)
                return cleaned.strip()
        
        return None