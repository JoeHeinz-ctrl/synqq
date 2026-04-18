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
        <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          {label}
        </h3>
      )}
      {children}
    </div>
  );
}
