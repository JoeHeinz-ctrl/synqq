import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  data?: any;
  timestamp: Date;
}

export function AISidePanel({ isOpen }: { isOpen: boolean }) {
  const { mode, getThemeColors } = useTheme();
  const colors = getThemeColors();
  const isDark = mode === 'dark';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI productivity assistant. I can help you plan your day, break down tasks, and prioritize your work.",
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
      // Try to connect to actual backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://api.dozzl.xyz"}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        const aiResponse = await response.json();
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: formatAIResponse(aiResponse),
          data: aiResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Backend API not available');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // Fallback to mock responses when backend is not available
      const mockResponses = {
        'plan my day': "Based on your current tasks, I recommend starting with the most urgent items first. Focus on completing 2-3 key tasks today.",
        'break down tasks': "I can help you break down complex tasks into smaller, manageable steps. Which task would you like me to analyze?",
        'prioritize tasks': "I've analyzed your tasks and ranked them by priority. Focus on the top items first!",
        'default': "I understand you need help with that. While I'm working on connecting to the full AI system, I can still provide basic guidance on task management."
      };
      
      const lowerMessage = message.toLowerCase();
      let response = mockResponses.default;
      
      for (const [key, value] of Object.entries(mockResponses)) {
        if (lowerMessage.includes(key.replace(' ', ''))) {
          response = value;
          break;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        height: '100vh',
        background: colors.surface,
        borderLeft: `1px solid ${colors.border}`,
        boxShadow: isDark 
          ? '-4px 0 20px rgba(0,0,0,0.4)' 
          : '-2px 0 15px rgba(0,0,0,0.1)',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: `1px solid ${colors.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: colors.text, margin: 0 }}>
              AI Assistant
            </h3>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
              Productivity companion
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => handleQuickAction('Plan my day')}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: '500',
              background: colors.surfaceHover,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.surfaceHover;
              e.currentTarget.style.color = colors.text;
            }}
          >
            📅 Plan my day
          </button>
          <button
            onClick={() => handleQuickAction('Break down tasks')}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: '500',
              background: colors.surfaceHover,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.surfaceHover;
              e.currentTarget.style.color = colors.text;
            }}
          >
            🔨 Break down tasks
          </button>
          <button
            onClick={() => handleQuickAction('Prioritize tasks')}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: '500',
              background: colors.surfaceHover,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.surfaceHover;
              e.currentTarget.style.color = colors.text;
            }}
          >
            ⚡ Prioritize tasks
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                lineHeight: '1.5',
                background: message.type === 'user' 
                  ? colors.primary 
                  : colors.surfaceHover,
                color: message.type === 'user' ? '#fff' : colors.text,
                wordWrap: 'break-word',
              }}
            >
              {message.content}
              <div
                style={{
                  fontSize: '11px',
                  marginTop: '8px',
                  opacity: 0.7,
                  color: message.type === 'user' ? '#fff' : colors.textSecondary,
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
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: colors.surfaceHover,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: colors.primary,
                      animation: 'bounce 1.4s ease-in-out infinite both',
                      animationDelay: '0ms'
                    }}
                  ></div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: colors.primary,
                      animation: 'bounce 1.4s ease-in-out infinite both',
                      animationDelay: '160ms'
                    }}
                  ></div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: colors.primary,
                      animation: 'bounce 1.4s ease-in-out infinite both',
                      animationDelay: '320ms'
                    }}
                  ></div>
                </div>
                <span style={{ fontSize: '14px', color: colors.textSecondary }}>
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
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
            placeholder="Ask me anything..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              outline: 'none',
              transition: 'all 0.2s ease',
              fontSize: '14px',
              background: colors.input,
              color: colors.text,
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
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: colors.primary,
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: (!inputValue.trim() || isLoading) ? 0.5 : 1,
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

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}