import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'default' | 'primary';
  className?: string;
}

export function StatCard({ label, value, icon, variant = 'default', className }: StatCardProps) {
  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border transition-colors',
        variant === 'primary'
          ? 'bg-teal-500/10 border-teal-500/20'
          : 'bg-zinc-900/50 border-zinc-800/50',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          <div
            className={cn(
              'text-2xl font-bold',
              variant === 'primary' ? 'text-teal-400' : 'text-zinc-100'
            )}
          >
            {value}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wide">{label}</div>
        </div>
      </div>
    </div>
  );
}
