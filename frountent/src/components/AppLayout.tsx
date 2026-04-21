import type { ReactNode } from 'react';
import { RightPanel } from './RightPanel';
import Sidebar from './Sidebar';
import { useSidebarStore } from '../store/sidebarStore';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed, toggleMobile, activePanel, closePanel } = useSidebarStore();

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        aria-label="Open menu"
        className="fixed top-4 left-4 w-10 h-10 rounded-lg border border-zinc-800/50 bg-zinc-900/90 backdrop-blur-sm text-zinc-100 flex items-center justify-center z-[1000] shadow-lg hover:bg-zinc-800/90 transition-all md:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <main
        className={`
          flex-1 min-h-screen transition-all duration-300 ease-in-out
          ${isCollapsed ? 'md:ml-[72px]' : 'md:ml-[280px]'}
        `}
      >
        {children}
      </main>

      {/* Right Panel */}
      <RightPanel activePanel={activePanel} onClose={closePanel} />
    </div>
  );
}
