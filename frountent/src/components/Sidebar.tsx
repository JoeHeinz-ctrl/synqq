import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Folder, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Settings
} from 'lucide-react';
import { useSidebarStore } from '../store/sidebarStore';
import { SidebarItem } from './ui/SidebarItem';
import { SidebarSection } from './ui/SidebarSection';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    isCollapsed, 
    isMobileOpen, 
    toggleCollapse, 
    closeMobile,
    setActivePanel 
  } = useSidebarStore();

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        closeMobile();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen, closeMobile]);

  const isActive = (path: string) => {
    if (path === '/board') return location.pathname === '/board';
    return location.pathname.startsWith(path);
  };

  const sidebarWidth = isCollapsed ? '72px' : '240px';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] animate-fadeIn"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: sidebarWidth }}
        className="fixed left-0 top-0 bottom-0 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 z-[999] sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          {!isCollapsed && (
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate('/board')}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                SYNQ
              </span>
            </div>
          )}

          {isCollapsed && (
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center cursor-pointer mx-auto"
              onClick={() => navigate('/board')}
            >
              <span className="text-white font-bold text-sm">S</span>
            </div>
          )}

          {/* Toggle Button - Desktop Only */}
          <button
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-all toggle-btn"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6">
          {/* Projects Section */}
          <SidebarSection label="Navigation" collapsed={isCollapsed}>
            <SidebarItem
              icon={<Folder className="w-5 h-5" />}
              label="Projects"
              active={isActive('/board')}
              onClick={() => navigate('/board')}
              collapsed={isCollapsed}
            />
          </SidebarSection>

          {/* Tools Section */}
          <SidebarSection label="Tools" collapsed={isCollapsed}>
            <SidebarItem
              icon={<Sparkles className="w-5 h-5" />}
              label="AI Assistant"
              onClick={() => setActivePanel('ai')}
              collapsed={isCollapsed}
            />
          </SidebarSection>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 space-y-1">
          <SidebarItem
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            onClick={() => setActivePanel('settings')}
            collapsed={isCollapsed}
          />
          {!isCollapsed && (
            <div className="px-3 py-2 text-xs text-zinc-500">
              © 2026 SYNQ
            </div>
          )}
        </div>
      </aside>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 200ms ease;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .sidebar {
            transform: ${isMobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
            width: 240px !important;
            box-shadow: ${isMobileOpen ? '4px 0 12px rgba(0, 0, 0, 0.3)' : 'none'};
          }

          .toggle-btn {
            display: none !important;
          }
        }

        /* Desktop Styles */
        @media (min-width: 769px) {
          .sidebar {
            transform: translateX(0) !important;
          }
        }

        /* Scrollbar Styles */
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 3px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }
      `}</style>
    </>
  );
}
