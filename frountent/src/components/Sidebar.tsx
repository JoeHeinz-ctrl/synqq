import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSidebarStore } from '../store/sidebarStore';
import { useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const colors = theme.getThemeColors();
  const isDark = theme.mode === 'dark';
  
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebarStore();

  const navItems: NavItem[] = [
    { id: 'board', label: 'Projects', icon: '📂', path: '/board' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'chat', label: 'Chat', icon: '💬', path: '/chat' },
  ];

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
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            animation: 'fadeIn 200ms ease',
          }}
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: sidebarWidth,
          background: colors.surface,
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 999,
          boxShadow: isDark ? 'none' : '2px 0 8px rgba(0, 0, 0, 0.05)',
        }}
        className="sidebar"
      >
        {/* Header */}
        <div
          style={{
            padding: isCollapsed ? '20px 12px' : '20px 24px',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          {!isCollapsed && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/board')}
            >
              <span style={{ fontSize: '24px' }}>📋</span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SYNQ
              </span>
            </div>
          )}

          {isCollapsed && (
            <span
              style={{ fontSize: '24px', cursor: 'pointer', margin: '0 auto' }}
              onClick={() => navigate('/board')}
            >
              📋
            </span>
          )}

          {/* Toggle Button - Desktop Only */}
          <button
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: colors.primaryLight,
              color: colors.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              transition: 'all 200ms ease',
              flexShrink: 0,
            }}
            className="toggle-btn"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: isCollapsed ? '16px 8px' : '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <div
                key={item.id}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '12px' : '12px 16px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  background: active ? colors.primaryLight : 'transparent',
                  color: active ? colors.primary : colors.textSecondary,
                  fontWeight: active ? '600' : '500',
                  fontSize: '14px',
                  position: 'relative',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                }}
                className="nav-item"
              >
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                {!isCollapsed && (
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      background: colors.primary,
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      minWidth: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: isCollapsed ? '16px 12px' : '16px 24px',
            borderTop: `1px solid ${colors.border}`,
            fontSize: '11px',
            color: colors.textSecondary,
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          {!isCollapsed && <div>© 2026 SYNQ</div>}
          {isCollapsed && <div>©</div>}
        </div>
      </aside>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .nav-item:hover {
          background: ${colors.primaryLight} !important;
          color: ${colors.primary} !important;
          transform: translateX(2px);
        }

        .toggle-btn:hover {
          background: ${colors.primary} !important;
          color: white !important;
          transform: scale(1.05);
        }

        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 3px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: ${colors.textSecondary};
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
      `}</style>
    </>
  );
}
