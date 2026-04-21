import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  badge?: number;
}

export function NavItem({
  icon,
  label,
  active = false,
  onClick,
  collapsed = false,
  badge,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative group',
        collapsed ? 'justify-center' : '',
        active
          ? 'bg-teal-500/10 text-teal-400 font-medium'
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
      )}
    >
      {/* Active Indicator */}
      {active && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-teal-500 rounded-r-full" />
      )}

      {/* Icon */}
      <span className="flex-shrink-0">{icon}</span>

      {/* Label and Badge */}
      {!collapsed && (
        <>
          <span className="flex-1 text-left text-sm font-medium truncate">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}

      {/* Collapsed Badge */}
      {collapsed && badge !== undefined && badge > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-teal-500 text-white border border-[#0a0a0a]">
          {badge > 9 ? '9+' : badge}
        </div>
      )}
    </button>
  );
}
