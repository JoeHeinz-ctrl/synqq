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

  const sidebarWidth = isCollapsed ? '72px' : '240px';

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        aria-label="Open menu"
        className="fixed top-5 left-5 w-11 h-11 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 flex items-center justify-center z-[1000] shadow-lg hover:bg-zinc-800 transition-all md:hidden mobile-menu-btn"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <main
        style={{ marginLeft: sidebarWidth }}
        className="flex-1 transition-all duration-300 min-h-screen main-content"
      >
        {children}
      </main>

      {/* Right Panel */}
      <RightPanel activePanel={activePanel} onClose={closePanel} />

      <style>{`
        /* Mobile Styles */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
