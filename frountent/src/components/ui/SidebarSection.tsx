import type { ReactNode } from 'react';

interface SidebarSectionProps {
  label: string;
  children: ReactNode;
  collapsed?: boolean;
}

export function SidebarSection({ label, children, collapsed = false }: SidebarSectionProps) {
  return (
    <div className="space-y-1">
      {!collapsed && (
        <h3 className="px-3 py-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </h3>
      )}
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}
