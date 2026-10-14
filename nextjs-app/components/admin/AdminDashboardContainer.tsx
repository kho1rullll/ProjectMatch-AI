'use client';

import React, { useState, Suspense } from 'react';
import AdminSidebar, { AdminTab } from './AdminSidebar';
import AdminOverviewView from './AdminOverviewView';
import AdminUsersView from './AdminUsersView';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/lib/auth-context';
import { Menu } from 'lucide-react';

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'users':
        return 'Manajemen Akun Pengguna & Hak Akses (FR-11)';
      case 'overview':
      default:
        return 'Monitoring & Statistik Agregasi Lowongan (FR-12)';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
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
        <header className="h-16 sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {getTabTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-500 hidden sm:inline">
                <strong className="text-slate-800">{user?.name || user?.full_name || 'Admin Kampus'}</strong>
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
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
