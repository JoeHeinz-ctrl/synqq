import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { PageContainer } from '../components/layout/PageContainer';
import { cn } from '../lib/utils';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Moon,
  Sun,
  Check,
} from 'lucide-react';

export default function Settings() {
  const { mode, color, toggleMode, setColor, getThemeColors } = useTheme();
  const { user } = useAuth();
  const isDark = mode === 'dark';
  const colors = getThemeColors();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const themeColors: Array<{ name: string; value: 'blue' | 'purple' | 'red'; color: string }> = [
    { name: 'Blue', value: 'blue', color: '#0b7de0' },
    { name: 'Purple', value: 'purple', color: '#8b5cf6' },
    { name: 'Red', value: 'red', color: '#ef4444' },
  ];

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'
    )}>
      <PageContainer className="max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: colors.primary }}
            >
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={cn(
                'text-4xl font-bold',
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              )}>
                Settings
              </h1>
              <p className={cn(
                'text-sm mt-1',
                isDark ? 'text-zinc-500' : 'text-zinc-600'
              )}>
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 pb-8">
          {/* Profile Section */}
          <section className={cn(
            'p-6 md:p-7 rounded-2xl border shadow-sm',
            isDark 
              ? 'bg-zinc-900/65 border-zinc-800/70' 
              : 'bg-white border-zinc-200'
          )}>
            <div className="flex items-center gap-3 mb-6">
              <User className={cn(
                'w-5 h-5',
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              )} />
              <h2 className={cn(
                'text-xl font-semibold',
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              )}>
                Profile
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: colors.primary }}
                >
                  {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    'text-lg font-semibold',
                    isDark ? 'text-zinc-100' : 'text-zinc-900'
                  )}>
                    {user?.name || 'User'}
                  </p>
                  <p className={cn(
                    'text-sm',
                    isDark ? 'text-zinc-500' : 'text-zinc-600'
                  )}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-2',
                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                  )}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-colors',
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-zinc-600' 
                        : 'bg-white border-zinc-300 text-zinc-900 focus:border-zinc-400'
                    )}
                  />
                </div>
                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-2',
                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                  )}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border transition-colors',
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-zinc-600' 
                        : 'bg-white border-zinc-300 text-zinc-900 focus:border-zinc-400'
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className={cn(
            'p-6 md:p-7 rounded-2xl border shadow-sm',
            isDark 
              ? 'bg-zinc-900/65 border-zinc-800/70' 
              : 'bg-white border-zinc-200'
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Palette className={cn(
                'w-5 h-5',
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              )} />
              <h2 className={cn(
                'text-xl font-semibold',
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              )}>
                Appearance
              </h2>
            </div>

            <div className="space-y-6">
              {/* Theme Mode */}
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-3',
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                )}>
                  Theme Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => mode === 'dark' && toggleMode()}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-lg border transition-all',
                      mode === 'light'
                        ? isDark
                          ? 'bg-zinc-800 border-zinc-700'
                          : 'bg-white border-zinc-400 shadow-sm'
                        : isDark
                        ? 'bg-zinc-800/50 border-zinc-800 hover:border-zinc-700'
                        : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                    )}
                  >
                    <Sun className="w-5 h-5" />
                    <span className={cn(
                      'font-medium',
                      mode === 'light'
                        ? isDark ? 'text-zinc-100' : 'text-zinc-900'
                        : isDark ? 'text-zinc-500' : 'text-zinc-600'
                    )}>
                      Light
                    </span>
                    {mode === 'light' && (
                      <Check className="w-5 h-5" style={{ color: colors.primary }} />
                    )}
                  </button>
                  <button
                    onClick={() => mode === 'light' && toggleMode()}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-lg border transition-all',
                      mode === 'dark'
                        ? isDark
                          ? 'bg-zinc-800 border-zinc-700 shadow-sm'
                          : 'bg-zinc-100 border-zinc-400'
                        : isDark
                        ? 'bg-zinc-800/50 border-zinc-800 hover:border-zinc-700'
                        : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                    )}
                  >
                    <Moon className="w-5 h-5" />
                    <span className={cn(
                      'font-medium',
                      mode === 'dark'
                        ? isDark ? 'text-zinc-100' : 'text-zinc-900'
                        : isDark ? 'text-zinc-500' : 'text-zinc-600'
                    )}>
                      Dark
                    </span>
                    {mode === 'dark' && (
                      <Check className="w-5 h-5" style={{ color: colors.primary }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-3',
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                )}>
                  Accent Color
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {themeColors.map((themeColor) => (
                    <button
                      key={themeColor.value}
                      onClick={() => setColor(themeColor.value)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all',
                        color === themeColor.value
                          ? isDark
                            ? 'bg-zinc-800 border-zinc-700 shadow-sm'
                            : 'bg-white border-zinc-400 shadow-sm'
                          : isDark
                          ? 'bg-zinc-800/50 border-zinc-800 hover:border-zinc-700'
                          : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                      )}
                    >
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: themeColor.color }}
                      />
                      <span className={cn(
                        'font-medium flex-1 text-left',
                        color === themeColor.value
                          ? isDark ? 'text-zinc-100' : 'text-zinc-900'
                          : isDark ? 'text-zinc-500' : 'text-zinc-600'
                      )}>
                        {themeColor.name}
                      </span>
                      {color === themeColor.value && (
                        <Check className="w-5 h-5" style={{ color: themeColor.color }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className={cn(
            'p-6 md:p-7 rounded-2xl border shadow-sm',
            isDark 
              ? 'bg-zinc-900/65 border-zinc-800/70' 
              : 'bg-white border-zinc-200'
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Bell className={cn(
                'w-5 h-5',
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              )} />
              <h2 className={cn(
                'text-xl font-semibold',
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              )}>
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <ToggleRow
                label="Email Notifications"
                description="Receive email updates about your tasks"
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />
              <ToggleRow
                label="Push Notifications"
                description="Get push notifications on your device"
                checked={pushNotifications}
                onChange={setPushNotifications}
              />
              <ToggleRow
                label="Weekly Report"
                description="Receive a weekly summary of your productivity"
                checked={weeklyReport}
                onChange={setWeeklyReport}
              />
            </div>
          </section>

          {/* Security Section */}
          <section className={cn(
            'p-6 md:p-7 rounded-2xl border shadow-sm',
            isDark 
              ? 'bg-zinc-900/65 border-zinc-800/70' 
              : 'bg-white border-zinc-200'
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className={cn(
                'w-5 h-5',
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              )} />
              <h2 className={cn(
                'text-xl font-semibold',
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              )}>
                Security
              </h2>
            </div>

            <div className="space-y-4">
              <button
                className={cn(
                  'w-full px-4 py-3 rounded-lg border text-left transition-all',
                  isDark 
                    ? 'bg-zinc-800/50 border-zinc-800 hover:border-zinc-700 text-zinc-300' 
                    : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700'
                )}
              >
                <p className="font-medium mb-1">Change Password</p>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-zinc-500' : 'text-zinc-600'
                )}>
                  Update your password to keep your account secure
                </p>
              </button>
              <button
                className={cn(
                  'w-full px-4 py-3 rounded-lg border text-left transition-all',
                  isDark 
                    ? 'bg-zinc-800/50 border-zinc-800 hover:border-zinc-700 text-zinc-300' 
                    : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700'
                )}
              >
                <p className="font-medium mb-1">Two-Factor Authentication</p>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-zinc-500' : 'text-zinc-600'
                )}>
                  Add an extra layer of security to your account
                </p>
              </button>
            </div>
          </section>
        </div>
      </PageContainer>
    </div>
  );
}

// Toggle Row Component
interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  const { mode, getThemeColors } = useTheme();
  const isDark = mode === 'dark';
  const colors = getThemeColors();

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className={cn(
          'font-medium mb-1',
          isDark ? 'text-zinc-200' : 'text-zinc-800'
        )}>
          {label}
        </p>
        <p className={cn(
          'text-sm',
          isDark ? 'text-zinc-500' : 'text-zinc-600'
        )}>
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-12 h-6 rounded-full transition-all flex-shrink-0',
          checked 
            ? '' 
            : isDark 
              ? 'bg-zinc-700' 
              : 'bg-zinc-300'
        )}
        style={checked ? { backgroundColor: colors.primary } : undefined}
      >
        <div
          className={cn(
            'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm',
            checked ? 'left-[26px]' : 'left-0.5'
          )}
        />
      </button>
    </div>
  );
}
