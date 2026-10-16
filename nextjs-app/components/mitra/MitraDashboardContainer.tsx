'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  useMitraQuery,
  useUpdateApplicantStatusMutation,
  useDeleteProjectMutation,
} from '@/hooks/useMitraQuery';
import { useAuth } from '@/lib/auth-context';
import MitraSidebar, { MitraTab } from './MitraSidebar';
import MitraOverviewView from './MitraOverviewView';
import MitraProjectsView from './MitraProjectsView';
import MitraPostProjectView from './MitraPostProjectView';
import MitraApplicantsView from './MitraApplicantsView';
import MitraTalentsView from './MitraTalentsView';
import type { ProjectItem } from '@/lib/data';

function MitraDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const tabParam = searchParams.get('tab') as MitraTab | null;
  const validTabs: MitraTab[] = ['overview', 'my-projects', 'post-project', 'applicants', 'talents'];
  const activeTab: MitraTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'overview';

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const { data: mitraData, isLoading: loading, error, refetch } = useMitraQuery();
  const updateStatusMutation = useUpdateApplicantStatusMutation();
  const deleteProjMutation = useDeleteProjectMutation();

  const projects = (mitraData?.projects ?? []) as ProjectItem[];
  const applications = mitraData?.applications ?? [];
  const students = mitraData?.students ?? [];
  const stats = mitraData?.stats ?? {
    totalProjects: 6,
    activeProjects: 6,
    totalApplicants: 4,
    acceptedApplicants: 1,
    averageMatchRate: '93.8%',
  };

  const pendingApplicantsCount = applications.filter((a) => !a.status || a.status === 'REVIEW').length;

  const handleTabChange = (tab: MitraTab) => {
    router.replace(`/mitra?tab=${tab}`);
  };

  const handleUpdateStatus = (applicationId: string, status: 'REVIEW' | 'ACCEPTED' | 'REJECTED') => {
    updateStatusMutation.mutate(
      { applicationId, status },
      {
        onSuccess: (data) => {
          setFeedbackMsg(data.message);
          setTimeout(() => setFeedbackMsg(''), 3000);
        },
        onError: (err) => {
          setFeedbackMsg(`Gagal ubah status: ${err.message}`);
          setTimeout(() => setFeedbackMsg(''), 3000);
        },
      }
    );
  };

  const handleDeleteProject = (projectId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lowongan proyek ini?')) return;
    deleteProjMutation.mutate(
      { projectId },
      {
        onSuccess: (data) => {
          setFeedbackMsg(data.message);
          setTimeout(() => setFeedbackMsg(''), 3000);
        },
        onError: (err) => {
          setFeedbackMsg(`Gagal menghapus lowongan: ${err.message}`);
          setTimeout(() => setFeedbackMsg(''), 3000);
        },
      }
    );
  };

  const handleScoutStudent = (studentName: string) => {
    setFeedbackMsg(`🎯 Undangan tawaran proyek berhasil dikirimkan ke talenta ${studentName}!`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'my-projects':
        return 'Lowongan Proyek Saya';
      case 'post-project':
        return 'Pasang Lowongan Riset & Proyek Industri';
      case 'applicants':
        return 'Tinjau & Evaluasi Pelamar Mahasiswa';
      case 'talents':
        return 'Eksplorasi Talent Pool Mahasiswa 5D';
      case 'overview':
      default:
        return 'Ringkasan Dasbor Mitra Industri';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <div className="w-64 bg-white border-r border-slate-200 hidden lg:block" />
        <div className="flex-1 p-6 sm:p-8 space-y-6 animate-pulse">
          <div className="h-16 bg-white rounded-2xl border border-slate-200" />
          <div className="h-44 bg-slate-200/70 rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-24 bg-slate-200/70 rounded-2xl" />
            <div className="h-24 bg-slate-200/70 rounded-2xl" />
            <div className="h-24 bg-slate-200/70 rounded-2xl" />
            <div className="h-24 bg-slate-200/70 rounded-2xl" />
          </div>
          <div className="h-64 bg-slate-200/70 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto font-black">
            !
          </div>
          <h3 className="font-bold text-base text-slate-900">Gagal Memuat Data Mitra</h3>
          <p className="text-xs text-slate-500">{error.message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
          >
            Coba Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar Navigation */}
      <MitraSidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        pendingApplicantsCount={pendingApplicantsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                {getTabTitle()}
              </h1>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block mt-1">
                ProjectMatch AI • {user?.organization || 'BioInformatika Nusantara & RS Cipto'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-[11px] font-bold text-cyan-800">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>AI Cosine Matching Aktif</span>
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  {user?.name || 'Dr. Hendra Gunawan'}
                </span>
                <span className="text-[10px] text-blue-600 block font-semibold truncate max-w-[130px]">
                  {user?.organization || 'Mitra Industri'}
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {(user?.name || 'HG')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Toast Feedback Messages */}
        <div className="px-4 sm:px-8 pt-4 space-y-2">
          {feedbackMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl shadow-xs flex items-center gap-2 animate-in fade-in">
              <span>✓</span>
              <span>{feedbackMsg}</span>
            </div>
          )}
        </div>

        {/* Tab View Contents */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <MitraOverviewView
              stats={stats}
              projects={projects}
              applications={applications}
              students={students}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'my-projects' && (
            <MitraProjectsView
              projects={projects}
              onAddNewProject={() => handleTabChange('post-project')}
              onDeleteProject={handleDeleteProject}
              onViewApplicants={() => handleTabChange('applicants')}
            />
          )}

          {activeTab === 'post-project' && (
            <MitraPostProjectView
              onSuccessPost={() => {
                setFeedbackMsg('🎉 Lowongan proyek baru berhasil dipublikasikan!');
                setTimeout(() => setFeedbackMsg(''), 4000);
                handleTabChange('my-projects');
              }}
            />
          )}

          {activeTab === 'applicants' && (
            <MitraApplicantsView
              applications={applications}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={updateStatusMutation.isPending}
            />
          )}

          {activeTab === 'talents' && (
            <MitraTalentsView
              students={students}
              onScoutStudent={handleScoutStudent}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function MitraDashboardContainer() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-slate-400 text-xs font-bold animate-pulse">
            Memuat Panel Mitra Industri...
          </div>
        </div>
      }
    >
      <MitraDashboardContent />
    </Suspense>
  );
}
