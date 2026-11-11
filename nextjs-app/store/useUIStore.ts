// store/useUIStore.ts — Client UI State Management menggunakan Zustand (Modul 7)
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  selectedCategory: string;
  activeMatchTier: string;
  activeDrillDownProjectId: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSelectedCategory: (category: string) => void;
  setActiveMatchTier: (tier: string) => void;
  setActiveDrillDownProjectId: (projectId: string | null) => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  selectedCategory: 'Semua Kategori',
  activeMatchTier: 'Semua Tier',
  activeDrillDownProjectId: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setActiveMatchTier: (tier) => set({ activeMatchTier: tier }),
  setActiveDrillDownProjectId: (projectId) => set({ activeDrillDownProjectId: projectId }),
  resetFilters: () =>
    set({
      selectedCategory: 'Semua Kategori',
      activeMatchTier: 'Semua Tier',
      activeDrillDownProjectId: null,
    }),
}));
