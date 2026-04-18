import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  activePanel: 'none' | 'ai' | 'settings' | 'notifications';
  toggleCollapse: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
  setActivePanel: (panel: 'none' | 'ai' | 'settings' | 'notifications') => void;
  closePanel: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,       // always starts expanded
      isMobileOpen: false,
      activePanel: 'none',
      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
      closeMobile: () => set({ isMobileOpen: false }),
      setActivePanel: (panel) => set({ activePanel: panel }),
      closePanel: () => set({ activePanel: 'none' }),
    }),
    {
      name: 'sidebar-storage',
      // Only persist activePanel — NOT isCollapsed, so sidebar is always expanded on load
      partialize: (state) => ({ activePanel: state.activePanel }),
    }
  )
);
