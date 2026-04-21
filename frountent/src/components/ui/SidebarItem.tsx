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
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer group relative',
        collapsed ? 'justify-center' : '',
        active
          ? 'bg-teal-500/10 text-teal-400 font-medium'
          : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
      )}
    >
      {/* Active Indicator */}
      {active && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-teal-500 rounded-r-full" />
      )}
      
      <span className={cn(
        "flex-shrink-0 transition-transform duration-150",
        active ? "" : "group-hover:scale-110"
      )}>
        {icon}
      </span>
      
      {!collapsed && (
        <>
          <span className="flex-1 text-left text-[13px] font-medium truncate">
            {label}
          </span>
          {badge !== undefined && badge > 0 && (
            <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
      
      {/* Collapsed Badge */}
      {collapsed && badge !== undefined && badge > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-teal-500 text-white border border-zinc-950">
          {badge > 9 ? '9+' : badge}
        </div>
      )}
    </button>
  );
}
