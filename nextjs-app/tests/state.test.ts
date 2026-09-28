import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

describe('Client UI State Management & Zustand Store (SRS & Bab h)', () => {
  beforeEach(() => {
    useUIStore.getState().resetFilters();
    useUIStore.getState().setSidebarOpen(false);
  });

  it('should initialize with default UI state values', () => {
    const state = useUIStore.getState();
    expect(state.isSidebarOpen).toBe(false);
    expect(state.selectedCategory).toBe('Semua Kategori');
    expect(state.activeMatchTier).toBe('Semua Tier');
    expect(state.activeDrillDownProjectId).toBeNull();
  });

  it('should toggle sidebar open and closed correctly', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(true);

    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().isSidebarOpen).toBe(false);

    useUIStore.getState().setSidebarOpen(true);
    expect(useUIStore.getState().isSidebarOpen).toBe(true);
  });

  it('should update selectedCategory filter', () => {
    useUIStore.getState().setSelectedCategory('AI & Machine Learning');
    expect(useUIStore.getState().selectedCategory).toBe('AI & Machine Learning');
  });

  it('should update activeMatchTier filter', () => {
    useUIStore.getState().setActiveMatchTier('Hero Tier S');
    expect(useUIStore.getState().activeMatchTier).toBe('Hero Tier S');
  });

  it('should update and clear activeDrillDownProjectId', () => {
    useUIStore.getState().setActiveDrillDownProjectId('proj-001');
    expect(useUIStore.getState().activeDrillDownProjectId).toBe('proj-001');

    useUIStore.getState().setActiveDrillDownProjectId(null);
    expect(useUIStore.getState().activeDrillDownProjectId).toBeNull();
  });

  it('should reset all filters back to default values', () => {
    useUIStore.getState().setSelectedCategory('Frontend & UI/UX');
    useUIStore.getState().setActiveMatchTier('Tier A');
    useUIStore.getState().setActiveDrillDownProjectId('proj-002');

    useUIStore.getState().resetFilters();

    const state = useUIStore.getState();
    expect(state.selectedCategory).toBe('Semua Kategori');
    expect(state.activeMatchTier).toBe('Semua Tier');
    expect(state.activeDrillDownProjectId).toBeNull();
  });
});

describe('Classname Merger Utility (cn)', () => {
  it('should combine multiple truthy class names', () => {
    expect(cn('btn', 'btn-primary', 'shadow-md')).toBe('btn btn-primary shadow-md');
  });

  it('should filter out falsy, undefined, null, or boolean values', () => {
    expect(cn('btn', false && 'hidden', null, undefined, 0, 'active')).toBe('btn active');
  });
});
