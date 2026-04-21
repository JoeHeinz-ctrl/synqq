import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { NotificationsPanel } from './NotificationsPanel';
import { useSidebar } from '../../context/SidebarContext';
import { cn } from '../../lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed } = useSidebar();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <Sidebar onOpenNotifications={() => setNotificationsOpen(true)} />

      {/* Main Content — shifts on desktop, no shift on mobile */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out min-h-screen',
          isCollapsed ? 'md:ml-[72px]' : 'md:ml-[280px]'
        )}
      >
        {children}
      </div>

      {/* Notifications Panel — fixed overlay, never shifts layout */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}
