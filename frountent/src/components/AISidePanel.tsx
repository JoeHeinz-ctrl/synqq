import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  data?: any;
  timestamp: Date;
}

interface AISidePanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AISidePanel({ isOpen, onToggle }: AISidePanelProps) {
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
      // Mock response for now - replace with actual API call
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "I understand you want help with that. Let me analyze your tasks and provide suggestions.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={onToggle}
        className="fixed top-1/2 right-0 z-40 transform -translate-y-1/2"
        style={{
          background: colors.primary,
          color: '#fff',
          border: 'none',
          borderRadius: '8px 0 0 8px',
          padding: '12px 8px',
          cursor: 'pointer',
          boxShadow: isDark 
            ? '-2px 0 10px rgba(0,0,0,0.3)' 
            : '-2px 0 10px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          transform: isOpen 
            ? 'translateY(-50%) translateX(-320px)' 
            : 'translateY(-50%) translateX(0)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = colors.primaryHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = colors.primary;
        }}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        >
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* AI Panel */}
      <div
        className="fixed top-0 right-0 h-full z-30"
        style={{
          width: '320px',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: colors.surface,
          borderLeft: `1px solid ${colors.border}`,
          boxShadow: isDark 
            ? '-4px 0 20px rgba(0,0,0,0.3)' 
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
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: colors.text }}>
                AI Assistant
              </h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Productivity companion
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b" style={{ borderColor: colors.border }}>
          <div className="space-y-2">
            <button
              onClick={() => handleQuickAction('Plan my day')}
              className="w-full p-3 rounded-lg text-left text-sm font-medium transition-all"
              style={{
                background: colors.surfaceHover,
                color: colors.text,
                border: `1px solid ${colors.border}`,
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
              className="w-full p-3 rounded-lg text-left text-sm font-medium transition-all"
              style={{
                background: colors.surfaceHover,
                color: colors.text,
                border: `1px solid ${colors.border}`,
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
              className="w-full p-3 rounded-lg text-left text-sm font-medium transition-all"
              style={{
                background: colors.surfaceHover,
                color: colors.text,
                border: `1px solid ${colors.border}`,
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  message.type === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                }`}
                style={{
                  background: message.type === 'user' 
                    ? colors.primary 
                    : colors.surfaceHover,
                  color: message.type === 'user' ? '#fff' : colors.text,
                }}
              >
                {message.content}
                <div
                  className="text-xs mt-2 opacity-70"
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
                  background: colors.surfaceHover,
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
              placeholder="Ask me anything..."
              className="flex-1 p-3 rounded-lg border outline-none transition-all text-sm"
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

      {/* Mobile Backdrop */}
      {isOpen && window.innerWidth <= 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onToggle}
        />
      )}
    </>
  );
}