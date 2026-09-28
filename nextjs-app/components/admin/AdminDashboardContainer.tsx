'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  useAdminQuery,
  useVerifyStudentMutation,
  useUpdateKioskMutation,
} from '@/hooks/useAdminQuery';
import { useAuth } from '@/lib/auth-context';
import AdminSidebar, { AdminTab } from './AdminSidebar';
import AdminOverviewView from './AdminOverviewView';
import AdminValidationView from './AdminValidationView';
import AdminAnalyticsView from './AdminAnalyticsView';
import AdminKioskView from './AdminKioskView';

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const tabParam = searchParams.get('tab') as AdminTab | null;
  const validTabs: AdminTab[] = ['overview', 'validation', 'analytics', 'kiosks'];
  const activeTab: AdminTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'overview';

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [simulatedTapMsg, setSimulatedTapMsg] = useState('');

  const { data: adminData, isLoading: loading, error, refetch } = useAdminQuery();
  const verifyMutation = useVerifyStudentMutation();
  const kioskMutation = useUpdateKioskMutation();

  const students = adminData?.students ?? [];
  const projects = adminData?.projects ?? [];
  const applications = adminData?.applications ?? [];
  const kiosks = adminData?.kiosks ?? [];
  const stats = adminData?.stats ?? {
    totalStudents: 1240,
    registeredStudents: 0,
    totalProjects: 6,
    totalMatches: 890,
    activeKiosks: 2,
    averageMatchRate: '92.4%',
  };

  const pendingStudentsCount = students.filter((s) => !s.academicVerified).length;

  const handleTabChange = (tab: AdminTab) => {
    router.replace(`/admin?tab=${tab}`);
  };

  const handleVerifyStudent = (studentId: string, currentStatus: boolean) => {
    verifyMutation.mutate(
      { studentId, verified: !currentStatus },
      {
        onSuccess: (data) => {
          setFeedbackMsg(data.message);
          setTimeout(() => setFeedbackMsg(''), 3000);
        },
        onError: (err) => {
          setFeedbackMsg(`Gagal verifikasi: ${err.message}`);
          setTimeout(() => setFeedbackMsg(''), 3000);
        },
      }
    );
  };

  const handleKioskToggle = (kioskId: string, newStatus: string) => {
    kioskMutation.mutate(
      { kioskId, kioskStatus: newStatus },
      {
        onSuccess: (data) => {
          setFeedbackMsg(data.message);
          setTimeout(() => setFeedbackMsg(''), 3000);
        },
        onError: (err) => {
          setFeedbackMsg(`Gagal ubah status kiosk: ${err.message}`);
          setTimeout(() => setFeedbackMsg(''), 3000);
        },
      }
    );
  };

  const handleSimulateRfidTap = (kioskName: string) => {
    setSimulatedTapMsg(
      `⚡ [WS Broadcast] Kartu KTM Raden Satria (UID: 0x8F3A29B1) berhasil di-tap pada ${kioskName}! Response Time: 420ms (< 1 detik).`
    );
    setTimeout(() => setSimulatedTapMsg(''), 5000);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'validation':
        return 'Validasi Data Akademik Mahasiswa';
      case 'analytics':
        return 'Monitoring Link & Match Rekrutmen';
      case 'kiosks':
        return 'Konfigurasi Smart Campus Kiosk (IoT)';
      case 'overview':
      default:
        return 'Ringkasan & Metrik Administrasi';
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
          <h3 className="font-bold text-base text-slate-900">Gagal Memuat Data Administrasi</h3>
          <p className="text-xs text-slate-500">{error.message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-xs"
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
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        pendingValidationCount={pendingStudentsCount}
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
                ProjectMatch AI • Biro Kemahasiswaan &amp; Kerjasama Industri
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Backend Operasional</span>
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  Super Admin
                </span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ADM
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

          {simulatedTapMsg && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono rounded-2xl shadow-sm flex items-center gap-2 animate-in slide-in-from-top-2">
              <span>{simulatedTapMsg}</span>
            </div>
          )}
        </div>

        {/* Tab View Contents */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <AdminOverviewView
              stats={stats}
              students={students}
              projects={projects}
              applications={applications}
              kiosks={kiosks}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'validation' && (
            <AdminValidationView
              students={students}
              onVerifyStudent={handleVerifyStudent}
              isUpdating={verifyMutation.isPending}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalyticsView applications={applications} />
          )}

          {activeTab === 'kiosks' && (
            <AdminKioskView
              kiosks={kiosks}
              onSimulateRfidTap={handleSimulateRfidTap}
              onKioskToggle={handleKioskToggle}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboardContainer() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-slate-400 text-xs font-bold animate-pulse">
            Memuat Panel Administrasi...
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
