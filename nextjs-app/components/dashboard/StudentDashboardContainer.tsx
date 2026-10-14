'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StudentSidebar, { DashboardTab } from './StudentSidebar';
import StudentOverviewView from './StudentOverviewView';
import GitHubSyncView from './GitHubSyncView';
import JobsExploreView from './JobsExploreView';
import BookmarksView from './BookmarksView';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/lib/auth-context';
import { Menu } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const initialTab = (searchParams.get('tab') as DashboardTab) || 'overview';
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as DashboardTab;
    if (tabFromUrl && ['overview', 'github', 'jobs', 'bookmarks'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    router.replace(`/dashboard?tab=${tab}`);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'github':
        return 'Tautkan Akun GitHub & Portofolio (FR-02, FR-03)';
      case 'jobs':
        return 'Eksplorasi Lowongan Multi-Platform (FR-04, FR-08)';
      case 'bookmarks':
        return 'Lowongan Tersimpan / Bookmarks (FR-08)';
      case 'overview':
      default:
        return 'Ringkasan Dashboard & Radar Kompetensi (FR-07)';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <StudentSidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
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
            {/* Real-time Notification Bell (FR-09) */}
            <NotificationBell />

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-500 hidden sm:inline">
                <strong className="text-slate-800">{user?.name || user?.full_name || 'Raden Satria'}</strong>
              </span>
              <div
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                title={user?.email || 'Mahasiswa'}
              >
                {(user?.name || user?.full_name || 'RS')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {activeTab === 'github' && <GitHubSyncView />}
          {activeTab === 'jobs' && <JobsExploreView />}
          {activeTab === 'bookmarks' && <BookmarksView />}
          {activeTab === 'overview' && (
            <StudentOverviewView onNavigateTab={handleTabChange} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function StudentDashboardContainer() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Memuat Dashboard Mahasiswa...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
