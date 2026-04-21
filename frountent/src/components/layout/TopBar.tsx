import type { ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { cn } from '../../lib/utils';

interface TopBarProps {
  title: string;
  actions?: ReactNode;
  className?: string;
}

export function TopBar({ title, actions, className }: TopBarProps) {
  const { toggleMobile } = useSidebar();

  return (
    <div
      className={cn(
        'sticky top-0 z-50 h-14 px-6 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-zinc-800/50',
        className
      )}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        className="md:hidden p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold text-zinc-100">{title}</h1>

      {/* Actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
