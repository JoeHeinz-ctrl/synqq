"""
SYNQ AI - Message Analyzer Service
Lightweight NLP-based task detection from chat messages
"""
import re
from typing import Optional, Dict, List
from datetime import datetime, timedelta


class MessageAnalyzer:
    """Analyzes chat messages to detect potential tasks"""
    
    # Action verbs that indicate task creation
    ACTION_VERBS = {
        'fix', 'build', 'deploy', 'update', 'create', 'finish', 
        'implement', 'design', 'test', 'write', 'review', 'refactor',
        'add', 'remove', 'delete', 'setup', 'configure', 'install',
        'debug', 'optimize', 'improve', 'enhance', 'develop', 'release',
        'ship', 'send', 'mail', 'contact', 'call', 'meeting', 'sync',
        'prepare', 'finalize', 'submit', 'verify', 'validate', 'check'
    }
    
    # Task indicators
    TASK_INDICATORS = {
        'task', 'todo', 'action item', 'please', 'need to', 
        'should', 'must', 'have to', 'can you', 'could you',
        "let's", "i will", "gonna", 'going to', 'scheduled',
        'assigned', 'requesting', 'reminder', 'urgent', 'priority'
    }
    
    # Deadline keywords
    DEADLINE_KEYWORDS = {
        'today': 0,
        'tonight': 0,
        'tomorrow': 1,
        'next week': 7,
        'this week': 3,
        'asap': 0,
        'urgent': 0,
        'monday': 1, # Simple offset for keyword match
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6,
        'sunday': 7,
        'by end of day': 0,
        'eod': 0
    }
    
    @staticmethod
    def analyze_message(message_text: str, team_members: List[Dict]) -> Dict:
        """
        Analyze a message to detect if it contains a task
        
        Args:
            message_text: The chat message content
            team_members: List of team members with 'id', 'name', 'email'
        
        Returns:
            Dict with task detection results
        """
        message_lower = message_text.lower().strip()
        
        # Check if message is too short
        if len(message_text.strip()) < 5:
            return {"isTask": False}
        
        # Detect task indicators
        has_action_verb = MessageAnalyzer._has_action_verb(message_lower)
        has_task_indicator = MessageAnalyzer._has_task_indicator(message_lower)
        has_mention = MessageAnalyzer._has_mention(message_text)
        
        # Calculate task probability
        is_task = has_action_verb or has_task_indicator
        
        if not is_task:
            return {"isTask": False}
        
        # Extract task details
        title = MessageAnalyzer._extract_title(message_text)
        assignee = MessageAnalyzer._extract_assignee(message_text, team_members)
        due_date = MessageAnalyzer._extract_due_date(message_lower)
        
        return {
            "isTask": True,
            "title": title,
            "assignee": assignee,
            "dueDate": due_date,
            "confidence": MessageAnalyzer._calculate_confidence(
                has_action_verb, has_task_indicator, has_mention
            )
        }
    
    @staticmethod
    def _has_action_verb(message_lower: str) -> bool:
        """Check if message contains action verbs"""
        words = set(re.findall(r'\b\w+\b', message_lower))
        return bool(words & MessageAnalyzer.ACTION_VERBS)
    
    @staticmethod
    def _has_task_indicator(message_lower: str) -> bool:
        """Check if message contains task indicators"""
        for indicator in MessageAnalyzer.TASK_INDICATORS:
            if indicator in message_lower:
                return True
        return False
    
    @staticmethod
    def _has_mention(message_text: str) -> bool:
        """Check if message contains @mentions"""
        return bool(re.search(r'@\w+', message_text))
    
    @staticmethod
    def _extract_title(message_text: str) -> str:
        """Extract task title from message"""
        # Remove mentions
        text = re.sub(r'@\w+', '', message_text).strip()
        
        # Remove politeness and task indicators
        removals = [
            r'^(please|can you|could you|could someone|i need someone to|i need to|need to|we should|should|must|have to|let\'s|task:|todo:|action item:)\s*',
            r'^(create|add|implement)\s+(task|todo|action item)',
            r'^(create|add|implement)\s+',
            r'\s+(today|tomorrow|tonight|next week|this week|asap|urgent|by eod|eod)$'
        ]
        
        for pattern in removals:
            text = re.sub(pattern, '', text, flags=re.IGNORECASE).strip()
        
        # Capitalize first letter
        text = text.strip()
        if text:
            text = text[0].upper() + text[1:]
        
        # Limit length
        if len(text) > 100:
            text = text[:97] + "..."
        
        return text or "New task"
    
    @staticmethod
    def _extract_assignee(message_text: str, team_members: List[Dict]) -> Optional[Dict]:
        """Extract assignee from @mentions"""
        # Find all mentions
        mentions = re.findall(r'@(\w+)', message_text)
        
        if not mentions:
            return None
        
        # Try to match mention with team members
        mention_lower = mentions[0].lower()
        
        for member in team_members:
            name_lower = member['name'].lower()
            email_lower = member.get('email', '').lower()
            
            # Match by name or email prefix
            if (mention_lower in name_lower or 
                name_lower.startswith(mention_lower) or
                email_lower.startswith(mention_lower)):
                return {
                    "id": member['id'],
                    "name": member['name']
                }
        
        # Return mention as-is if no match
        return {
            "id": None,
            "name": f"@{mentions[0]}"
        }
    
    @staticmethod
    def _extract_due_date(message_lower: str) -> Optional[str]:
        """Extract due date from message"""
        for keyword, days_offset in MessageAnalyzer.DEADLINE_KEYWORDS.items():
            if keyword in message_lower:
                target_date = datetime.now() + timedelta(days=days_offset)
                return target_date.strftime("%Y-%m-%d")
        
        return None
    
    @staticmethod
    def _calculate_confidence(has_action_verb: bool, has_task_indicator: bool, has_mention: bool) -> float:
        """Calculate confidence score (0-1)"""
        score = 0.0
        
        if has_action_verb:
            score += 0.4
        if has_task_indicator:
            score += 0.4
        if has_mention:
            score += 0.2
        
        return min(score, 1.0)
