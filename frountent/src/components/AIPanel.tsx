import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  data?: any;
  timestamp: Date;
}

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTasks?: (tasks: any[]) => void;
}

export function AIPanel({ isOpen, onClose, onCreateTasks }: AIPanelProps) {
  const { mode, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const isDark = mode === 'dark';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI productivity assistant. I can help you plan your day, break down tasks, and prioritize your work. What would you like to do?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://api.dozzl.xyz"}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const aiResponse = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: formatAIResponse(aiResponse),
        data: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAIResponse = (response: any): string => {
    switch (response.type) {
      case 'plan':
        return `Here's your day plan:\n\n${response.data.summary}`;
      case 'tasks':
        return `I've broken down "${response.data.title}" into ${response.data.subtasks.length} manageable steps.`;
      case 'priority':
        return `I've analyzed your tasks and ranked them by priority. Focus on the top items first!`;
      case 'chat':
        return response.data.message;
      default:
        return response.data?.message || "I'm here to help with your productivity!";
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  const handleCreateTasks = (tasks: any[]) => {
    if (onCreateTasks) {
      onCreateTasks(tasks);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.type === 'user') {
      return <div>{message.content}</div>;
    }

    // AI message with special rendering based on data type
    if (message.data) {
      switch (message.data.type) {
        case 'plan':
          return (
            <div>
              <div className="mb-3">{message.content}</div>
              <div className="space-y-2">
                {message.data.data.tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: colors.primary, color: '#fff' }}
                      >
                        {task.priority}
                      </span>
                      <span className="font-medium">{task.title}</span>
                    </div>
                    {task.suggestion && (
                      <div className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                        {task.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );

        case 'tasks':
          return (
            <div>
              <div className="mb-3">{message.content}</div>
              <div className="space-y-2">
                {message.data.data.subtasks.map((task: any, index: number) => (
                  <div
                    key={index}
                    className="p-2 rounded border"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="font-medium text-sm">{task.title}</div>
                    {task.description && (
                      <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                        {task.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleCreateTasks(message.data.data.subtasks)}
                className="mt-3 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                style={{
                  background: colors.primary,
                  color: '#fff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.primaryHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.primary;
                }}
              >
                Add to Board
              </button>
            </div>
          );

        case 'priority':
          return (
            <div>
              <div className="mb-3">{message.content}</div>
              <div className="space-y-2">
                {message.data.data.tasks.slice(0, 5).map((task: any) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg border"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ 
                          background: task.rank <= 3 ? colors.primary : colors.textSecondary,
                          color: '#fff'
                        }}
                      >
                        {task.rank}
                      </span>
                      <span className="font-medium">{task.title}</span>
                    </div>
                    {task.reason && (
                      <div className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                        {task.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return <div>{message.content}</div>;
      }
    }

    return <div>{message.content}</div>;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 right-0 h-full z-50"
      style={{
        width: window.innerWidth <= 768 ? '100vw' : '400px',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        style={{ zIndex: -1 }}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        className="h-full flex flex-col"
        style={{
          background: colors.surface,
          borderLeft: window.innerWidth <= 768 ? 'none' : `1px solid ${colors.border}`,
          boxShadow: isDark 
            ? '-4px 0 20px rgba(0,0,0,0.5)' 
            : '-2px 0 15px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: colors.primary }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: colors.text }}>
                AI Assistant
              </h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Your productivity companion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.surfaceHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickAction('Plan my day')}
              className="p-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: colors.primaryLight,
                color: colors.primary,
                border: `1px solid ${colors.primary}20`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.primary;
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.primaryLight;
                e.currentTarget.style.color = colors.primary;
              }}
            >
              Plan My Day
            </button>
            <button
              onClick={() => handleQuickAction('Prioritize my tasks')}
              className="p-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: colors.primaryLight,
                color: colors.primary,
                border: `1px solid ${colors.primary}20`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.primary;
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.primaryLight;
                e.currentTarget.style.color = colors.primary;
              }}
            >
              Prioritize
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                }`}
                style={{
                  background: message.type === 'user' 
                    ? colors.primary 
                    : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                  color: message.type === 'user' ? '#fff' : colors.text,
                  border: message.type === 'ai' ? `1px solid ${colors.border}` : 'none'
                }}
              >
                {renderMessageContent(message)}
                <div
                  className="text-xs mt-2 opacity-70"
                  style={{ 
                    color: message.type === 'user' ? '#fff' : colors.textSecondary 
                  }}
                >
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div
                className="p-3 rounded-lg rounded-bl-sm"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ 
                        background: colors.primary,
                        animationDelay: '0ms'
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ 
                        background: colors.primary,
                        animationDelay: '150ms'
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ 
                        background: colors.primary,
                        animationDelay: '300ms'
                      }}
                    ></div>
                  </div>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputValue);
                }
              }}
              placeholder="Ask me anything about your tasks..."
              className="flex-1 p-3 rounded-lg border outline-none transition-all"
              style={{
                background: colors.input,
                border: `1px solid ${colors.border}`,
                color: colors.text
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border;
              }}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: colors.primary,
                color: '#fff'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = colors.primaryHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.background = colors.primary;
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}