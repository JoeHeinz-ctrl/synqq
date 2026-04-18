import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  badge?: number;
}

export function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
  collapsed = false,
  badge,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer group relative overflow-hidden',
        collapsed ? 'px-3 py-3.5 justify-center' : 'px-4 py-3',
        active
          ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-600/30 shadow-lg shadow-blue-600/10'
          : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100 border border-transparent hover:border-zinc-700/50'
      )}
    >
      {/* Background glow for active state */}
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 blur-sm" />
      )}
      
      <span className={cn(
        "flex-shrink-0 transition-all duration-200 relative z-10",
        collapsed ? "w-5 h-5" : "w-5 h-5",
        active ? "scale-110" : "group-hover:scale-105"
      )}>
        {icon}
      </span>
      
      {!collapsed && (
        <>
          <span className="flex-1 text-left text-sm font-medium truncate relative z-10">
            {label}
          </span>
          {badge !== undefined && badge > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-2 flex items-center justify-center text-xs font-bold rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg relative z-10">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
      
      {/* Active indicator line */}
      {active && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full shadow-lg shadow-blue-500/50" />
      )}
      
      {/* Collapsed active indicator */}
      {active && collapsed && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-full shadow-lg shadow-blue-500/50" />
      )}
    </button>
  );
}
