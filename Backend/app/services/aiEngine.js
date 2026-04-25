class AIEngine {
  constructor() {
    this.intents = {
      plan: ['plan my day', 'plan day', 'schedule', 'organize day', 'what should i do today', 'daily plan'],
      break: ['break task', 'break down', 'split task', 'subtasks', 'divide task', 'break into steps'],
      prioritize: ['prioritize', 'priority', 'what first', 'order tasks', 'most important', 'urgent'],
      chat: ['help', 'tired', 'focus', 'stuck', 'motivation', 'advice']
    };

    this.taskTemplates = {
      'build': ['Design architecture', 'Set up environment', 'Implement core features', 'Add styling', 'Test functionality', 'Deploy'],
      'create': ['Plan structure', 'Gather resources', 'Draft content', 'Review and edit', 'Finalize'],
      'design': ['Research inspiration', 'Create wireframes', 'Design mockups', 'Get feedback', 'Iterate design'],
      'implement': ['Set up foundation', 'Code core logic', 'Add error handling', 'Write tests', 'Document'],
      'write': ['Outline content', 'Research topic', 'Write first draft', 'Edit and revise', 'Proofread'],
      'learn': ['Find resources', 'Study basics', 'Practice exercises', 'Build project', 'Review concepts'],
      'fix': ['Identify problem', 'Research solution', 'Implement fix', 'Test solution', 'Document changes'],
      'setup': ['Install dependencies', 'Configure settings', 'Test connection', 'Document setup'],
      'default': ['Break into smaller steps', 'Research requirements', 'Plan approach', 'Execute', 'Review results']
    };

    this.chatResponses = {
      tired: [
        "When you're tired, focus on 1-2 small tasks today. Quality over quantity!",
        "Try the 2-minute rule: if it takes less than 2 minutes, do it now.",
        "Consider taking a short break first, then tackle your easiest task."
      ],
      focus: [
        "Try the Pomodoro technique: 25 minutes focused work, 5 minute break.",
        "Start with your smallest task to build momentum.",
        "Remove distractions and focus on just one thing at a time."
      ],
      stuck: [
        "Break the task into smaller, more manageable pieces.",
        "Try explaining the problem out loud or writing it down.",
        "Take a step back and approach it from a different angle."
      ],
      motivation: [
        "Remember why you started - your goals matter!",
        "Celebrate small wins along the way.",
        "Progress, not perfection. Every step counts."
      ],
      overwhelmed: [
        "Focus on what you can control right now.",
        "Pick just one task and ignore the rest for now.",
        "Remember: you don't have to do everything today."
      ],
      default: [
        "I'm here to help you stay productive! Try asking me to plan your day or break down a task.",
        "What's on your mind? I can help prioritize your tasks or give you some productivity tips.",
        "Let's tackle your tasks together! Ask me to plan your day or break down complex tasks."
      ]
    };
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(this.intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }
    
    return 'chat';
  }

  planMyDay(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Filter today's tasks and upcoming urgent tasks
    const relevantTasks = tasks.filter(task => {
      if (task.status?.toLowerCase() === 'done') return false;
      
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        return dueDate <= tomorrow;
      }
      
      return task.status?.toLowerCase() !== 'done';
    });

    // Sort by priority and deadline
    const sortedTasks = relevantTasks.sort((a, b) => {
      // Priority: doing > todo > others
      const priorityOrder = { 'doing': 0, 'todo': 1 };
      const aPriority = priorityOrder[a.status?.toLowerCase()] ?? 2;
      const bPriority = priorityOrder[b.status?.toLowerCase()] ?? 2;
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // Then by due date
      if (a.due_date && b.due_date) {
        return new Date(a.due_date) - new Date(b.due_date);
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      
      return 0;
    });

    const plan = sortedTasks.slice(0, 6).map((task, index) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      due_date: task.due_date,
      priority: index + 1,
      suggestion: this.getTaskSuggestion(task, index)
    }));

    return {
      type: 'plan',
      data: {
        title: 'Your Day Plan',
        tasks: plan,
        summary: this.generatePlanSummary(plan)
      }
    };
  }

  breakTask(taskTitle, existingTask = null) {
    const lowerTitle = taskTitle.toLowerCase();
    let template = 'default';
    
    // Find matching template
    for (const [key, steps] of Object.entries(this.taskTemplates)) {
      if (lowerTitle.includes(key)) {
        template = key;
        break;
      }
    }
    
    const baseSteps = this.taskTemplates[template];
    const customizedSteps = this.customizeSteps(baseSteps, taskTitle);
    
    const subtasks = customizedSteps.map((step, index) => ({
      title: step,
      description: `Step ${index + 1} of breaking down: ${taskTitle}`,
      status: 'todo',
      parent_task: taskTitle
    }));

    return {
      type: 'tasks',
      data: {
        title: `Breaking down: ${taskTitle}`,
        subtasks: subtasks,
        original_task: existingTask
      }
    };
  }

  prioritizeTasks(tasks) {
    const activeTasks = tasks.filter(task => task.status?.toLowerCase() !== 'done');
    
    const prioritized = activeTasks.map(task => {
      let score = 0;
      const now = new Date();
      
      // Deadline scoring
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue < 0) score += 100; // Overdue
        else if (daysUntilDue === 0) score += 80; // Due today
        else if (daysUntilDue === 1) score += 60; // Due tomorrow
        else if (daysUntilDue <= 3) score += 40; // Due this week
        else if (daysUntilDue <= 7) score += 20; // Due next week
      }
      
      // Status scoring
      if (task.status?.toLowerCase() === 'doing') score += 30;
      else if (task.status?.toLowerCase() === 'todo') score += 10;
      
      // Title-based urgency keywords
      const urgentKeywords = ['urgent', 'asap', 'important', 'critical', 'deadline', 'meeting'];
      const titleLower = task.title.toLowerCase();
      if (urgentKeywords.some(keyword => titleLower.includes(keyword))) {
        score += 25;
      }
      
      return { ...task, priority_score: score };
    });
    
    const sorted = prioritized.sort((a, b) => b.priority_score - a.priority_score);
    
    return {
      type: 'priority',
      data: {
        title: 'Task Priority Ranking',
        tasks: sorted.map((task, index) => ({
          ...task,
          rank: index + 1,
          reason: this.getPriorityReason(task)
        }))
      }
    };
  }

  chatFallback(message) {
    const lowerMessage = message.toLowerCase();
    let responseCategory = 'default';
    
    // Detect emotional/situational keywords
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      responseCategory = 'tired';
    } else if (lowerMessage.includes('focus') || lowerMessage.includes('concentrate') || lowerMessage.includes('distracted')) {
      responseCategory = 'focus';
    } else if (lowerMessage.includes('stuck') || lowerMessage.includes('blocked') || lowerMessage.includes('confused')) {
      responseCategory = 'stuck';
    } else if (lowerMessage.includes('motivation') || lowerMessage.includes('give up') || lowerMessage.includes('discouraged')) {
      responseCategory = 'motivation';
    } else if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('too much') || lowerMessage.includes('stressed')) {
      responseCategory = 'overwhelmed';
    }
    
    const responses = this.chatResponses[responseCategory];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      type: 'chat',
      data: {
        message: randomResponse,
        category: responseCategory,
        suggestions: this.getChatSuggestions(responseCategory)
      }
    };
  }

  // Helper methods
  customizeSteps(steps, taskTitle) {
    return steps.map(step => {
      // Replace generic terms with task-specific ones
      return step
        .replace(/task/gi, taskTitle.split(' ').slice(-1)[0] || 'task')
        .replace(/project/gi, taskTitle.split(' ')[0] || 'project');
    });
  }

  getTaskSuggestion(task, index) {
    if (index === 0) return "Start here - your top priority!";
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntil < 0) return "Overdue - tackle this ASAP";
      if (daysUntil === 0) return "Due today - don't delay";
      if (daysUntil === 1) return "Due tomorrow - plan ahead";
    }
    return "Good task to work on when ready";
  }

  generatePlanSummary(plan) {
    const totalTasks = plan.length;
    const urgentTasks = plan.filter(task => 
      task.due_date && new Date(task.due_date) <= new Date()
    ).length;
    
    if (totalTasks === 0) return "No tasks for today - great job staying on top of things!";
    if (urgentTasks > 0) return `${totalTasks} tasks planned, ${urgentTasks} urgent. Focus on the top priorities first.`;
    return `${totalTasks} tasks planned for today. Start with the first one and build momentum!`;
  }

  getPriorityReason(task) {
    const reasons = [];
    
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const now = new Date();
      const daysUntil = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntil < 0) reasons.push("Overdue");
      else if (daysUntil === 0) reasons.push("Due today");
      else if (daysUntil === 1) reasons.push("Due tomorrow");
    }
    
    if (task.status?.toLowerCase() === 'doing') reasons.push("In progress");
    
    const urgentKeywords = ['urgent', 'important', 'critical'];
    if (urgentKeywords.some(keyword => task.title.toLowerCase().includes(keyword))) {
      reasons.push("Marked as urgent");
    }
    
    return reasons.length > 0 ? reasons.join(", ") : "Normal priority";
  }

  getChatSuggestions(category) {
    const suggestions = {
      tired: ["Plan my day", "Show easy tasks", "Break down a big task"],
      focus: ["Prioritize tasks", "Plan my day", "What should I do next?"],
      stuck: ["Break task into steps", "Show similar tasks", "Get help"],
      motivation: ["Show progress", "Plan my day", "Celebrate wins"],
      overwhelmed: ["Prioritize tasks", "Plan my day", "Focus on one thing"],
      default: ["Plan my day", "Break down a task", "Prioritize tasks"]
    };
    
    return suggestions[category] || suggestions.default;
  }

  processMessage(message, tasks) {
    const intent = this.detectIntent(message);
    
    switch (intent) {
      case 'plan':
        return this.planMyDay(tasks);
      case 'break':
        // Extract task title from message
        const taskTitle = this.extractTaskTitle(message) || "Current task";
        return this.breakTask(taskTitle);
      case 'prioritize':
        return this.prioritizeTasks(tasks);
      default:
        return this.chatFallback(message);
    }
  }

  extractTaskTitle(message) {
    // Simple extraction - look for text after "break" keywords
    const breakKeywords = ['break down', 'break task', 'split task', 'divide'];
    const lowerMessage = message.toLowerCase();
    
    for (const keyword of breakKeywords) {
      const index = lowerMessage.indexOf(keyword);
      if (index !== -1) {
        const afterKeyword = message.substring(index + keyword.length).trim();
        // Remove common words and quotes
        return afterKeyword.replace(/^(the|a|an|my|this|that|"|')/i, '').trim();
      }
    }
    
    return null;
  }
}

module.exports = AIEngine;