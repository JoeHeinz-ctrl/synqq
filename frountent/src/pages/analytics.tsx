import { useTheme } from '../context/ThemeContext';
import { PageContainer } from '../components/layout/PageContainer';
import { cn } from '../lib/utils';
import {
  BarChart3,
  Sparkles,
} from 'lucide-react';

export default function Analytics() {
  const { mode, getThemeColors } = useTheme();
  const isDark = mode === 'dark';
  const colors = getThemeColors();

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

        <div
          className={cn(
            'rounded-2xl border p-8 md:p-12 text-center',
            isDark ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-white border-zinc-200'
          )}
        >
          <div
            className={cn(
              'mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center',
              isDark ? 'bg-zinc-800/70' : 'bg-zinc-100'
            )}
          >
            <Sparkles className="w-8 h-8" style={{ color: colors.primary }} />
          </div>
          <h2 className={cn('text-2xl font-bold mb-2', isDark ? 'text-zinc-100' : 'text-zinc-900')}>
            Analytics coming soon
          </h2>
          <p className={cn('max-w-xl mx-auto text-sm md:text-base', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
            No mock or fake data is shown here. We will plug in real analytics once backend integration is complete.
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
