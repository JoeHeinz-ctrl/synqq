import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  FolderOpen,
  LogOut,
  X
} from 'lucide-react';
import { useSidebarStore } from '../store/sidebarStore';
import { QuickAccessPanel } from './QuickAccessPanel';
import { fetchProjects, fetchTeams, fetchTeamProjects } from '../services/api';

interface Project {
  id: number;
  title: string;
  team_id?: number | null;
}

interface Team {
  id: number;
  name: string;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [personalProjects, setPersonalProjects] = useState<Project[]>([]);
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [quickAccessType, setQuickAccessType] = useState<'chat' | 'teams' | 'newProject' | 'none'>('none');
  
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
        const allProjects = await fetchProjects();
        const personal = allProjects.filter((p: Project) => !p.team_id);
        setPersonalProjects(personal);

        const teams: Team[] = await fetchTeams();
        if (teams.length > 0) {
          const teamProjectsPromises = teams.map((team: Team) => 
            fetchTeamProjects(team.id).catch(() => [])
          );
          const teamProjectsArrays = await Promise.all(teamProjectsPromises);
          const allTeamProjects = teamProjectsArrays.flat();
          setTeamProjects(allTeamProjects);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  const isActive = (path: string) => {
    if (path === '/board') return location.pathname === '/board';
    if (path === '/dashboard' && !location.pathname.includes('/dashboard/')) {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const allProjects = [...personalProjects, ...teamProjects];
  const recentProjects = allProjects
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  const filteredProjects = recentProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProjectCount = personalProjects.length + teamProjects.length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 bg-[#0a0a0a] border-r border-zinc-800/50 
          flex flex-col z-[999] transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[72px]' : 'w-[280px]'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/50 flex-shrink-0">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-zinc-100 truncate">Synq</span>
                  <span className="text-xs text-zinc-500 truncate">{user?.name || 'User'}</span>
                </div>
              </div>
              <button
                onClick={toggleCollapse}
                className="hidden md:flex items-center justify-center w-7 h-7 rounded-md hover:bg-zinc-800/70 text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={toggleCollapse}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 mx-auto"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-3 py-3 border-b border-zinc-800/50 flex-shrink-0">
            {!showSearch ? (
              <button
                onClick={() => setShowSearch(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 transition-all"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search...</span>
              </button>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  autoFocus
                  className="w-full pl-9 pr-8 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm placeholder-zinc-600 focus:outline-none focus:border-teal-500/50"
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-zinc-800 text-zinc-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6">
          {/* Main */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                Main
              </div>
            )}
            <NavItem
              icon={<Home className="w-[18px] h-[18px]" />}
              label="My Day"
              active={isActive('/dashboard') && location.pathname === '/dashboard'}
              onClick={() => navigate('/dashboard')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<Folder className="w-[18px] h-[18px]" />}
              label="All Projects"
              active={isActive('/board')}
              onClick={() => navigate('/board')}
              collapsed={isCollapsed}
              badge={totalProjectCount}
            />
            <NavItem
              icon={<MessageSquare className="w-[18px] h-[18px]" />}
              label="Chat"
              active={isActive('/chat')}
              onClick={() => setQuickAccessType('chat')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<Users className="w-[18px] h-[18px]" />}
              label="Teams"
              onClick={() => setQuickAccessType('teams')}
              collapsed={isCollapsed}
            />
          </div>

          {/* Recent Projects */}
          {!isCollapsed && recentProjects.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                Recent
              </div>
              {(searchQuery ? filteredProjects : recentProjects).map((project) => (
                <NavItem
                  key={project.id}
                  icon={<FolderOpen className="w-[16px] h-[16px]" />}
                  label={project.title}
                  active={location.pathname === `/dashboard/${project.id}`}
                  onClick={() => navigate(`/dashboard/${project.id}`)}
                  collapsed={isCollapsed}
                />
              ))}
              <NavItem
                icon={<Plus className="w-[16px] h-[16px]" />}
                label="New Project"
                onClick={() => setQuickAccessType('newProject')}
                collapsed={isCollapsed}
              />
            </div>
          )}

          {/* Tools */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                Tools
              </div>
            )}
            <NavItem
              icon={<Sparkles className="w-[18px] h-[18px]" />}
              label="AI Assistant"
              onClick={() => setActivePanel('ai')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<BarChart3 className="w-[18px] h-[18px]" />}
              label="Analytics"
              onClick={() => navigate('/board')}
              collapsed={isCollapsed}
            />
            <NavItem
              icon={<Bell className="w-[18px] h-[18px]" />}
              label="Notifications"
              onClick={() => setActivePanel('notifications')}
              collapsed={isCollapsed}
              badge={2}
            />
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-zinc-800/50 flex-shrink-0 space-y-2">
          <NavItem
            icon={<Settings className="w-[18px] h-[18px]" />}
            label="Settings"
            onClick={() => setActivePanel('settings')}
            collapsed={isCollapsed}
          />
          {!isCollapsed && user && (
            <div className="px-3 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs">
                    {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-zinc-200 truncate">{user.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{user.email}</div>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="flex-shrink-0 p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      <QuickAccessPanel 
        type={quickAccessType} 
        onClose={() => setQuickAccessType('none')} 
      />
    </>
  );
}

// NavItem Component
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  badge?: number;
}

function NavItem({ icon, label, active = false, onClick, collapsed = false, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 relative
        ${collapsed ? 'justify-center' : ''}
        ${active
          ? 'bg-teal-500/10 text-teal-400 font-medium'
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
        }
      `}
    >
      {active && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-teal-500 rounded-r-full" />
      )}
      
      <span className="flex-shrink-0">{icon}</span>
      
      {!collapsed && (
        <>
          <span className="flex-1 text-left text-[13px] font-medium truncate">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full bg-teal-500/20 text-teal-400">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
      
      {collapsed && badge !== undefined && badge > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-teal-500 text-white">
          {badge > 9 ? '9+' : badge}
        </div>
      )}
    </button>
  );
}
