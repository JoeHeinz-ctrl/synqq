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
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group',
        active
          ? 'bg-blue-600/10 text-blue-500'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
        collapsed && 'justify-center'
      )}
    >
      <span className="flex-shrink-0 w-5 h-5">{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 text-left text-sm font-medium truncate">
            {label}
          </span>
          {badge !== undefined && badge > 0 && (
            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
}
