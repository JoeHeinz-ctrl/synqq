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
        'w-full flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer group relative',
        collapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2.5',
        active
          ? 'bg-blue-600/10 text-blue-500'
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
      )}
    >
      <span className={cn(
        "flex-shrink-0 transition-transform group-hover:scale-110",
        collapsed ? "w-5 h-5" : "w-5 h-5"
      )}>
        {icon}
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 text-left text-sm font-medium truncate">
            {label}
          </span>
          {badge !== undefined && badge > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-semibold rounded-full bg-blue-600 text-white">
              {badge}
            </span>
          )}
        </>
      )}
      
      {/* Active indicator */}
      {active && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
      )}
    </button>
  );
}
