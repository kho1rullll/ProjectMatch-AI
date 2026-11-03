'use client';

import React, { useState, Suspense } from 'react';
import AdminSidebar, { AdminTab } from './AdminSidebar';
import AdminOverviewView from './AdminOverviewView';
import AdminUsersView from './AdminUsersView';
import NotificationBell from '@/components/NotificationBell';
import { ThemeSwitcher } from '@/components/ui/apple-liquid-glass-switcher';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { Menu } from 'lucide-react';

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const isDim = theme === 'dim';

  const getTabTitle = () => {
    switch (activeTab) {
      case 'users':
        return 'Manajemen Akun Pengguna & Hak Akses';
      case 'overview':
      default:
        return 'Monitoring & Statistik Agregasi Lowongan';
    }
  };

  return (
    <div data-theme={theme} className={`min-h-screen relative overflow-hidden flex transition-colors duration-300 ${
    isDark ? 'bg-[#0B0F19] text-white' : isDim ? 'bg-[#120B22] text-purple-50' : 'bg-[#FAFAFC] text-slate-900'
  }`}>
      {/* Ambient background glow */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-lime-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className={`h-20 sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-8 flex items-center justify-between transition-colors duration-300 ${
    isDark
      ? 'bg-[#0F172A]/85 border-white/10 text-white'
      : isDim
      ? 'bg-[#1E1038]/85 border-purple-500/20 text-purple-50'
      : 'bg-white/85 border-slate-200/80 text-slate-900'
  }`}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className={`text-sm sm:text-base font-extrabold tracking-tight truncate ${isDark ? 'text-white' : isDim ? 'text-purple-50' : 'text-slate-900'}`}>
              {getTabTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Apple Liquid Glass Theme Switcher */}
            <ThemeSwitcher value={theme} onValueChange={setTheme} />

            <NotificationBell />

            <div className={`h-6 w-px hidden sm:block ${isDark ? 'bg-white/10' : isDim ? 'bg-purple-500/20' : 'bg-slate-200'}`} />

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-500 hidden sm:inline">
                <strong className={`font-bold ${isDark ? 'text-white' : isDim ? 'text-purple-50' : 'text-slate-900'}`}>{user?.name || user?.full_name || 'Admin Kampus'}</strong>
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-container to-indigo-700 text-white flex items-center justify-center font-black text-xs shadow-md shadow-purple-500/20 cursor-pointer">
                ADM
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && <AdminOverviewView />}
          {activeTab === 'users' && <AdminUsersView />}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardContainer() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Memuat Portal Administrator...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
