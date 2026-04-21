/**
 * AppLayout — THE ONLY place that controls sidebar offset.
 *
 * Structure:
 *   <div>                          ← root, full viewport
 *     <Sidebar />                  ← fixed, left-0, never in flow
 *     <main ml-[72|280]px>         ← pushed right by exactly sidebar width
 *       {children}                 ← pages render here, NO extra wrappers
 *     </main>
 *   </div>
 *
 * Rules enforced here:
 *  - Sidebar width constants come from SidebarContext (single source of truth)
 *  - ml-* is ONLY set here — pages must NOT add their own ml/pl
 *  - Mobile: ml-0, sidebar is overlay
 *  - Transition matches sidebar transition (300ms ease-in-out)
 */

import type { ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { NotificationsPanel } from './NotificationsPanel';
import { useSidebar, SIDEBAR_W_COLLAPSED, SIDEBAR_W_EXPANDED } from '../../context/SidebarContext';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isCollapsed } = useSidebar();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sidebar width as a number — must exactly match the sidebar's CSS width
  const sidebarWidth = isCollapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W_EXPANDED;

  return (
    <div className="min-h-screen app-shell-bg">
      {/* ── Sidebar (fixed, never in document flow) ── */}
      <Sidebar onOpenNotifications={() => setNotificationsOpen(true)} />

      {/*
       * ── Main content area ──
       *
       * Desktop: margin-left = exact sidebar pixel width (inline style, not Tailwind,
       *          so it reacts instantly to the same JS value the sidebar uses)
       * Mobile:  margin-left = 0 (sidebar is overlay, not in flow)
       *
       * transition-[margin] matches sidebar width transition duration exactly.
       */}
      <main
        style={{ marginLeft: sidebarWidth }}
        className="relative transition-[margin] duration-300 ease-in-out min-h-screen max-w-full overflow-x-hidden
                   px-2 md:px-3 py-2
                   max-md:!ml-0"
      >
        <div className="pointer-events-none absolute inset-0 app-shell-noise" />
        {children}
      </main>

      {/* ── Notifications (fixed overlay, zero layout impact) ── */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}
