import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Folder, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Settings,
  Home,
  MessageSquare,
  Users,
  BarChart3,
  Bell,
  Search,
  Plus,
  FolderOpen
} from 'lucide-react';
import { useSidebarStore } from '../store/sidebarStore';
import { SidebarItem } from './ui/SidebarItem';
import { SidebarSection } from './ui/SidebarSection';
import { fetchProjects } from '../services/api';

interface Project {
  id: number;
  title: string;
  team_id?: number;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  
  const { 
    isCollapsed, 
    isMobileOpen, 
    toggleCollapse, 
    closeMobile,
    setActivePanel 
  } = useSidebarStore();

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData.slice(0, 5)); // Show only first 5 projects in sidebar
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };

    loadProjects();
  }, []);

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
    if (path === '/dashboard' && !location.pathname.includes('/dashboard/')) {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const sidebarWidth = isCollapsed ? '80px' : '280px';

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
        className="fixed left-0 top-0 bottom-0 bg-gradient-to-b from-zinc-950 to-zinc-900 border-r border-zinc-800/50 flex flex-col transition-all duration-300 z-[999] sidebar backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-zinc-800/30">
          {!isCollapsed ? (
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/board')}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:shadow-blue-600/40 transition-all duration-300">
                  <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-3 h-3 rounded bg-white"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-950"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">
                  Synq
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  Workspace
                </span>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center cursor-pointer mx-auto shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 group"
              onClick={() => navigate('/board')}
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-3 h-3 rounded bg-white"></div>
              </div>
            </div>
          )}

          {/* Toggle Button - Desktop Only */}
          <button
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/70 text-zinc-400 hover:text-zinc-100 transition-all duration-200 toggle-btn backdrop-blur-sm"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="px-5 py-4 border-b border-zinc-800/30">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/60 text-zinc-300 hover:text-white transition-all duration-200 group">
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Search projects...</span>
              <div className="ml-auto px-2 py-1 rounded-md bg-zinc-700/50 text-xs text-zinc-400">
                ⌘K
              </div>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6">
          {/* Main Navigation */}
          <SidebarSection label="Main" collapsed={isCollapsed}>
            <SidebarItem
              icon={<Home className="w-5 h-5" />}
              label="My Day"
              active={isActive('/dashboard') && location.pathname === '/dashboard'}
              onClick={() => navigate('/dashboard')}
              collapsed={isCollapsed}
            />
            <SidebarItem
              icon={<Folder className="w-5 h-5" />}
              label="All Projects"
              active={isActive('/board')}
              onClick={() => navigate('/board')}
              collapsed={isCollapsed}
              badge={projects.length}
            />
            <SidebarItem
              icon={<MessageSquare className="w-5 h-5" />}
              label="Chat"
              active={isActive('/chat')}
              onClick={() => navigate('/chat')}
              collapsed={isCollapsed}
            />
            <SidebarItem
              icon={<Users className="w-5 h-5" />}
              label="Teams"
              onClick={() => navigate('/teams')}
              collapsed={isCollapsed}
            />
          </SidebarSection>

          {/* Recent Projects */}
          {!isCollapsed && projects.length > 0 && (
            <SidebarSection label="Recent Projects" collapsed={isCollapsed}>
              {projects.map((project) => (
                <SidebarItem
                  key={project.id}
                  icon={<FolderOpen className="w-4 h-4" />}
                  label={project.title}
                  active={location.pathname === `/dashboard/${project.id}`}
                  onClick={() => navigate(`/dashboard/${project.id}`)}
                  collapsed={isCollapsed}
                />
              ))}
              <SidebarItem
                icon={<Plus className="w-4 h-4" />}
                label="New Project"
                onClick={() => navigate('/board')}
                collapsed={isCollapsed}
              />
            </SidebarSection>
          )}

          {/* Tools Section */}
          <SidebarSection label="Tools" collapsed={isCollapsed}>
            <SidebarItem
              icon={<Sparkles className="w-5 h-5" />}
              label="AI Assistant"
              onClick={() => setActivePanel('ai')}
              collapsed={isCollapsed}
            />
            <SidebarItem
              icon={<BarChart3 className="w-5 h-5" />}
              label="Analytics"
              onClick={() => navigate('/analytics')}
              collapsed={isCollapsed}
            />
            <SidebarItem
              icon={<Bell className="w-5 h-5" />}
              label="Notifications"
              onClick={() => setActivePanel('notifications')}
              collapsed={isCollapsed}
              badge={2}
            />
          </SidebarSection>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-zinc-800/30 space-y-2">
          <SidebarItem
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            onClick={() => setActivePanel('settings')}
            collapsed={isCollapsed}
          />
          {!isCollapsed && (
            <div className="px-4 py-3 mt-4 rounded-lg bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-600/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">John Doe</div>
                  <div className="text-xs text-zinc-400">Premium Plan</div>
                </div>
              </div>
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
            width: 280px !important;
            box-shadow: ${isMobileOpen ? '20px 0 40px rgba(0, 0, 0, 0.4)' : 'none'};
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
          width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(63, 63, 70, 0.5);
          border-radius: 2px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(82, 82, 91, 0.7);
        }
      `}</style>
    </>
  );
}
