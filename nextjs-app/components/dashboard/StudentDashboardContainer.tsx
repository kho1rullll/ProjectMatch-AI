'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StudentSidebar, { DashboardTab } from './StudentSidebar';
import UploadCvView from './UploadCvView';
import ProfileView from './ProfileView';
import AvailableProjectsView from './AvailableProjectsView';
import ApplyMitraView from './ApplyMitraView';
import DashboardHeroStats from '@/components/DashboardHeroStats';
import HeroRpg3DChart from '@/components/HeroRpg3DChart';
import DashboardAppStatus from '@/components/DashboardAppStatus';
import { ALL_PROJECTS, ProjectItem } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const initialTab = (searchParams.get('tab') as DashboardTab) || 'overview';
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedApplyProject, setSelectedApplyProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as DashboardTab;
    if (tabFromUrl && ['overview', 'profile', 'upload-cv', 'projects', 'applications'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    router.replace(`/dashboard?tab=${tab}`);
  };

  const handleApplyFromProjectList = (project: ProjectItem) => {
    setSelectedApplyProject(project);
    handleTabChange('applications');
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'profile':
        return 'Profil Mahasiswa';
      case 'upload-cv':
        return 'Upload CV & Portofolio';
      case 'projects':
        return 'Daftar Proyek Tersedia';
      case 'applications':
        return 'Status Lamaran Proyek';
      case 'overview':
      default:
        return 'Ringkasan Dashboard';
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
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-base font-bold text-slate-900">
              {getTabTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Selamat datang, <strong className="text-slate-800">{user?.name || 'Raden Satria'}</strong>
            </span>
            <button
              type="button"
              onClick={() => handleTabChange('profile')}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
              title="Lihat Profil"
            >
              {(user?.name || 'RS')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {activeTab === 'upload-cv' && <UploadCvView />}

          {activeTab === 'profile' && <ProfileView />}

          {activeTab === 'projects' && (
            <AvailableProjectsView onApplyClick={handleApplyFromProjectList} />
          )}

          {activeTab === 'applications' && (
            <ApplyMitraView initialSelectedProject={selectedApplyProject} />
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 1. Profile Summary & Key Stats */}
              <DashboardHeroStats />

              {/* 2. Kompetensi Chart */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Visualisasi Matriks Kompetensi Mahasiswa
                    </h3>
                    <p className="text-xs text-slate-500">
                      Grafik kecocokan 5 dimensi keahlian teknis terhadap kualifikasi proyek industri.
                    </p>
                  </div>
                </div>

                <HeroRpg3DChart />
              </div>

              {/* 3. Top Project Recommendations */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Rekomendasi Proyek Teratas
                    </h3>
                    <p className="text-xs text-slate-500">
                      Proyek mitra industri yang paling cocok dengan portofolio Anda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabChange('projects')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Lihat Semua ({ALL_PROJECTS.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ALL_PROJECTS.slice(0, 3).map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                            {proj.category}
                          </span>
                          <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                            {proj.matchScore}% Cocok
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {proj.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          🏢 {proj.company}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{proj.stipend}</span>
                        <button
                          type="button"
                          onClick={() => handleApplyFromProjectList(proj)}
                          className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer text-xs"
                        >
                          Apply →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Application Status */}
              <DashboardAppStatus />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function StudentDashboardContainer() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Memuat Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
