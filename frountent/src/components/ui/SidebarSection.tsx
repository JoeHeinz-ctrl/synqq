import type { ReactNode } from 'react';

interface SidebarSectionProps {
  label: string;
  children: ReactNode;
  collapsed?: boolean;
}

export function SidebarSection({ label, children, collapsed = false }: SidebarSectionProps) {
  return (
    <div className="space-y-2">
      {!collapsed && (
        <h3 className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[2px] flex items-center gap-2">
          <div className="w-4 h-px bg-gradient-to-r from-zinc-600 to-transparent"></div>
          {label}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
