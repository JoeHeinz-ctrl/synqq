import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useSidebarStore } from '../store/sidebarStore';
import { useTheme } from '../context/ThemeContext';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed, toggleMobile } = useSidebarStore();
  const theme = useTheme();
  const colors = theme.getThemeColors();

  const sidebarWidth = isCollapsed ? '72px' : '240px';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: colors.background,
      }}
    >
      <Sidebar />

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobile}
        aria-label="Open menu"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          background: colors.surface,
          color: colors.text,
          cursor: 'pointer',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          zIndex: 997,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 200ms ease',
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarWidth,
          transition: 'margin-left 300ms cubic-bezier(0, 0, 0.2, 1)',
          minHeight: '100vh',
          width: `calc(100% - ${sidebarWidth})`,
        }}
        className="main-content"
      >
        {children}
      </main>

      <style>{`
        /* Mobile Styles */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
          }

          .mobile-menu-btn {
            display: flex !important;
          }

          .mobile-menu-btn:hover {
            background: ${colors.surfaceHover};
            transform: scale(1.05);
          }

          .mobile-menu-btn:active {
            transform: scale(0.95);
          }
        }

        /* Desktop Styles */
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
