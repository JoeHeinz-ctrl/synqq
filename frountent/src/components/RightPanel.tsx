import { X, Sparkles, Settings as SettingsIcon, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface RightPanelProps {
  activePanel: 'none' | 'ai' | 'settings';
  onClose: () => void;
}

export function RightPanel({ activePanel, onClose }: RightPanelProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  if (activePanel === 'none') return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 w-96 bg-zinc-900 border-l border-zinc-800 z-50 shadow-2xl transform transition-transform duration-300 flex flex-direction-column"
        style={{ animation: 'slideInRight 300ms ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            {activePanel === 'ai' && (
              <>
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-zinc-100">AI Assistant</h2>
              </>
            )}
            {activePanel === 'settings' && (
              <>
                <SettingsIcon className="w-5 h-5 text-zinc-400" />
                <h2 className="text-lg font-semibold text-zinc-100">Settings</h2>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activePanel === 'ai' && (
            <div className="space-y-4">
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-100 mb-2">AI Assistant</h3>
                <p className="text-sm text-zinc-400">
                  Coming soon! Get intelligent task suggestions and project insights.
                </p>
              </div>
            </div>
          )}

          {activePanel === 'settings' && (
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Appearance
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => theme.mode === 'light' ? null : theme.toggleMode()}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                      theme.mode === 'light'
                        ? 'bg-blue-600/10 border-blue-600 text-blue-500'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => theme.mode === 'dark' ? null : theme.toggleMode()}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                      theme.mode === 'dark'
                        ? 'bg-blue-600/10 border-blue-600 text-blue-500'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Accent Color
                </label>
                <div className="flex gap-2">
                  {['blue', 'purple', 'red'].map((color) => (
                    <button
                      key={color}
                      onClick={() => theme.setColor(color as any)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                        theme.color === color
                          ? 'bg-blue-600/10 border-blue-600'
                          : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${
                          color === 'blue' ? 'bg-blue-500' :
                          color === 'purple' ? 'bg-purple-500' :
                          'bg-red-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-zinc-300 capitalize">
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <div className="pt-4 border-t border-zinc-800">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
