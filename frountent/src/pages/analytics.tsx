import { useTheme } from '../context/ThemeContext';
import { PageContainer } from '../components/layout/PageContainer';
import { cn } from '../lib/utils';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  Users,
  Calendar,
  Activity,
} from 'lucide-react';

export default function Analytics() {
  const { mode, getThemeColors } = useTheme();
  const isDark = mode === 'dark';
  const colors = getThemeColors();

  // Mock data
  const stats = [
    { label: 'Total Tasks', value: '156', change: '+12%', icon: Target, trend: 'up' },
    { label: 'Completed', value: '89', change: '+8%', icon: CheckCircle2, trend: 'up' },
    { label: 'In Progress', value: '42', change: '-3%', icon: Clock, trend: 'down' },
    { label: 'Productivity', value: '87%', change: '+5%', icon: TrendingUp, trend: 'up' },
  ];

  const weeklyData = [
    { day: 'Mon', completed: 12, total: 15 },
    { day: 'Tue', completed: 15, total: 18 },
    { day: 'Wed', completed: 10, total: 14 },
    { day: 'Thu', completed: 18, total: 20 },
    { day: 'Fri', completed: 14, total: 16 },
    { day: 'Sat', completed: 8, total: 10 },
    { day: 'Sun', completed: 6, total: 8 },
  ];

  const maxTotal = Math.max(...weeklyData.map(d => d.total));

  return (
    <div className={cn(
      'min-h-screen',
      isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'
    )}>
      <PageContainer>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: colors.primary }}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={cn(
                'text-4xl font-bold',
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              )}>
                Analytics
              </h1>
              <p className={cn(
                'text-sm mt-1',
                isDark ? 'text-zinc-500' : 'text-zinc-600'
              )}>
                Track your productivity and progress
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                'p-6 rounded-xl border transition-all hover:shadow-lg',
                isDark 
                  ? 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700' 
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primaryLight }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                <span className={cn(
                  'text-xs font-semibold px-2 py-1 rounded-full',
                  stat.trend === 'up'
                    ? isDark 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'bg-green-50 text-green-600'
                    : isDark 
                      ? 'bg-red-500/10 text-red-400' 
                      : 'bg-red-50 text-red-600'
                )}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className={cn(
                  'text-3xl font-bold mb-1',
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                )}>
                  {stat.value}
                </p>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-zinc-500' : 'text-zinc-600'
                )}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress Chart */}
          <div className={cn(
            'p-6 rounded-xl border',
            isDark 
              ? 'bg-zinc-900/50 border-zinc-800/50' 
              : 'bg-white border-zinc-200'
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className={cn(
                'w-5 h-5',
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold',
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              )}>
                Weekly Progress
              </h3>
            </div>

            {/* Bar Chart */}
            <div className="space-y-4">
              {weeklyData.map((data) => (
                <div key={data.day} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={cn(
                      'font-medium',
                      isDark ? 'text-zinc-400' : 'text-zinc-600'
                    )}>
                      {data.day}
                    </span>
                    <span className={cn(
                      'text-xs',
                      isDark ? 'text-zinc-500' : 'text-zinc-500'
                    )}>
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <div className={cn(
                    'h-2 rounded-full overflow-hidden',
                    isDark ? 'bg-zinc-800' : 'bg-zinc-200'
                  )}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(data.completed / maxTotal) * 100}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Rate */}
          <div className={cn(
            'p-6 rounded-xl border',
            isDark 
              ? 'bg-zinc-900/50 border-zinc-800/50' 
              : 'bg-white border-zinc-200'
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Activity className={cn(
                'w-5 h-5',
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              )} />
              <h3 className={cn(
                'text-lg font-semibold',
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              )}>
                Completion Rate
              </h3>
            </div>

            {/* Circular Progress */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={isDark ? '#27272a' : '#e4e4e7'}
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={colors.primary}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - 0.87)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn(
                    'text-5xl font-bold',
                    isDark ? 'text-zinc-100' : 'text-zinc-900'
                  )}>
                    87%
                  </span>
                  <span className={cn(
                    'text-sm mt-1',
                    isDark ? 'text-zinc-500' : 'text-zinc-600'
                  )}>
                    This Week
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className={cn(
                'p-4 rounded-lg text-center',
                isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'
              )}>
                <p className={cn(
                  'text-2xl font-bold mb-1',
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                )}>
                  89
                </p>
                <p className={cn(
                  'text-xs',
                  isDark ? 'text-zinc-500' : 'text-zinc-600'
                )}>
                  Completed
                </p>
              </div>
              <div className={cn(
                'p-4 rounded-lg text-center',
                isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'
              )}>
                <p className={cn(
                  'text-2xl font-bold mb-1',
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                )}>
                  13
                </p>
                <p className={cn(
                  'text-xs',
                  isDark ? 'text-zinc-500' : 'text-zinc-600'
                )}>
                  Remaining
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className={cn(
          'p-6 rounded-xl border',
          isDark 
            ? 'bg-zinc-900/50 border-zinc-800/50' 
            : 'bg-white border-zinc-200'
        )}>
          <div className="flex items-center gap-3 mb-6">
            <Users className={cn(
              'w-5 h-5',
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            )} />
            <h3 className={cn(
              'text-lg font-semibold',
              isDark ? 'text-zinc-100' : 'text-zinc-900'
            )}>
              Team Performance
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Design Team', completed: 45, total: 50, color: colors.primary },
              { name: 'Development', completed: 38, total: 45, color: '#10b981' },
              { name: 'Marketing', completed: 28, total: 35, color: '#f59e0b' },
            ].map((team) => (
              <div key={team.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'font-medium',
                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                  )}>
                    {team.name}
                  </span>
                  <span className={cn(
                    'text-sm',
                    isDark ? 'text-zinc-500' : 'text-zinc-600'
                  )}>
                    {team.completed}/{team.total} tasks
                  </span>
                </div>
                <div className={cn(
                  'h-3 rounded-full overflow-hidden',
                  isDark ? 'bg-zinc-800' : 'bg-zinc-200'
                )}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(team.completed / team.total) * 100}%`,
                      backgroundColor: team.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
