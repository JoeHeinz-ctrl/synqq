import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { Sparkles, Send, Lightbulb, Zap, Target } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const { mode, getThemeColors } = useTheme();
  const isDark = mode === 'dark';
  const colors = getThemeColors();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI assistant. I can help you organize tasks, suggest priorities, and boost your productivity. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    { icon: Lightbulb, text: 'Suggest tasks for today', color: '#f59e0b' },
    { icon: Target, text: 'Prioritize my backlog', color: colors.primary },
    { icon: Zap, text: 'Quick productivity tips', color: '#8b5cf6' },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I understand you need help with that. Let me analyze your tasks and provide some recommendations...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className={cn(
      'h-screen flex flex-col',
      isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'
    )}>
      {/* Header */}
      <div className={cn(
        'border-b px-8 py-6 flex-shrink-0',
        isDark ? 'border-zinc-800/50' : 'border-zinc-200'
      )}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: colors.primary }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={cn(
                'text-3xl font-bold',
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              )}>
                AI Assistant
              </h1>
              <p className={cn(
                'text-sm mt-1',
                isDark ? 'text-zinc-500' : 'text-zinc-600'
              )}>
                Your intelligent productivity companion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-4',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.primary }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={cn(
                  'max-w-[70%] px-5 py-4 rounded-2xl',
                  message.role === 'user'
                    ? isDark
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'bg-zinc-100 text-zinc-900'
                    : isDark
                    ? 'bg-zinc-900/50 border border-zinc-800/50 text-zinc-200'
                    : 'bg-white border border-zinc-200 text-zinc-800'
                )}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className={cn(
                  'text-xs mt-2',
                  isDark ? 'text-zinc-600' : 'text-zinc-500'
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold text-sm',
                  isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                )}>
                  You
                </div>
              )}
            </div>
          ))}

          {/* Suggestions (show when no user messages yet) */}
          {messages.length === 1 && (
            <div className="pt-8">
              <p className={cn(
                'text-sm font-medium mb-4',
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              )}>
                Try asking:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(suggestion.text)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all hover:scale-[1.02]',
                      isDark 
                        ? 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700' 
                        : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-md'
                    )}
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: suggestion.color + '20' }}
                    >
                      <suggestion.icon className="w-5 h-5" style={{ color: suggestion.color }} />
                    </div>
                    <p className={cn(
                      'text-sm font-medium',
                      isDark ? 'text-zinc-200' : 'text-zinc-800'
                    )}>
                      {suggestion.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className={cn(
        'border-t px-8 py-6 flex-shrink-0',
        isDark ? 'border-zinc-800/50 bg-[#0a0a0a]' : 'border-zinc-200 bg-white'
      )}>
        <div className="max-w-[1200px] mx-auto">
          <div className={cn(
            'flex items-end gap-3 p-4 rounded-2xl border transition-all',
            isDark 
              ? 'bg-zinc-900/50 border-zinc-800/50 focus-within:border-zinc-700' 
              : 'bg-zinc-50 border-zinc-200 focus-within:border-zinc-300'
          )}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything about your tasks..."
              rows={1}
              className={cn(
                'flex-1 bg-transparent outline-none resize-none text-base',
                isDark 
                  ? 'text-zinc-100 placeholder-zinc-600' 
                  : 'text-zinc-900 placeholder-zinc-400'
              )}
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              style={{ 
                backgroundColor: input.trim() ? colors.primary : isDark ? '#27272a' : '#e4e4e7' 
              }}
            >
              <Send className={cn(
                'w-5 h-5',
                input.trim() ? 'text-white' : isDark ? 'text-zinc-600' : 'text-zinc-400'
              )} />
            </button>
          </div>
          <p className={cn(
            'text-xs mt-3 text-center',
            isDark ? 'text-zinc-600' : 'text-zinc-500'
          )}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
