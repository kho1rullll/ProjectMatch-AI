'use client';

import React from 'react';
import type { Student, Project, Application, Kiosk, AdminStats } from '@/services/adminApi';
import AdminMetricsOverview from './AdminMetricsOverview';
import AdminPerformanceIndicators from './AdminPerformanceIndicators';
import AdminCategoryDistribution from './AdminCategoryDistribution';
import type { AdminTab } from './AdminSidebar';

interface AdminOverviewViewProps {
  stats: AdminStats;
  students: Student[];
  projects: Project[];
  applications: Application[];
  kiosks: Kiosk[];
  onNavigateTab: (tab: AdminTab) => void;
}

export default function AdminOverviewView({
  stats,
  students,
  projects,
  applications,
  kiosks,
  onNavigateTab,
}: AdminOverviewViewProps) {
  const pendingStudents = students.filter((s) => !s.academicVerified);
  const onlineKiosksCount = kiosks.filter((k) => k.status === 'ONLINE').length;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner & System Status */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-32 -mb-8 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistem Link &amp; Match Terhubung (v2.4)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
              Dasbor Administrasi &amp; Kontrol Kampus
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Monitoring ekosistem kolaborasi mahasiswa, mitra industri, serta manajemen terminal fisik Smart Campus Kiosk (RFID) secara terpusat.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab('validation')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-xs flex items-center gap-2 cursor-pointer"
            >
              <span>📋</span>
              <span>
                {pendingStudents.length > 0
                  ? `${pendingStudents.length} Menunggu Validasi`
                  : 'Semua Mahasiswa Tervalidasi'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('kiosks')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all backdrop-blur-xs flex items-center gap-2 cursor-pointer"
            >
              <span>📡</span>
              <span>{onlineKiosksCount} / {kiosks.length} Kiosk Aktif</span>
            </button>
          </div>
        </div>

        {/* Stat Metrics Grid Inside Banner */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <p className="text-2xl font-black font-display text-white">{stats.totalStudents}</p>
            <p className="text-xs font-medium text-indigo-200 mt-0.5">Total Mahasiswa</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <p className="text-2xl font-black font-display text-cyan-300">{projects.length}</p>
            <p className="text-xs font-medium text-indigo-200 mt-0.5">Lowongan Mitra Aktif</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <p className="text-2xl font-black font-display text-amber-300">{stats.averageMatchRate}</p>
            <p className="text-xs font-medium text-indigo-200 mt-0.5">Rata-rata Akurasi AI</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <p className="text-2xl font-black font-display text-emerald-300">{onlineKiosksCount} / {kiosks.length}</p>
            <p className="text-xs font-medium text-indigo-200 mt-0.5">Kiosk RFID Online</p>
          </div>
        </div>
      </div>

      {/* 2. Quick Panels: Recent Validation & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antrean Validasi Terbaru */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>📋</span>
                <span>Antrean Verifikasi Mahasiswa</span>
              </h3>
              <p className="text-xs text-slate-500">Mahasiswa yang memerlukan persetujuan status akademik</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('validation')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-2.5">
            {students.slice(0, 3).map((stud) => (
              <div
                key={stud.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {stud.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{stud.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{stud.nim || 'V3925028'} • IPK {stud.gpa || '3.88'}</p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {stud.academicVerified ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Terverifikasi
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ⏳ Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pengajuan Proyek Terbaru */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>📝</span>
                <span>Pengajuan Lamaran Proyek</span>
              </h3>
              <p className="text-xs text-slate-500">Aktivitas rekrutmen terbaru antara mahasiswa dan mitra</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('analytics')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
            >
              Lihat Detail →
            </button>
          </div>

          <div className="space-y-2.5">
            {applications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{app.projectTitle}</p>
                  <p className="text-[11px] text-slate-500 truncate">Oleh: {app.studentName} ({app.companyName})</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    {app.matchScore}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Performance Indicators & Project Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminPerformanceIndicators />
        <AdminCategoryDistribution />
      </div>
    </div>
  );
}
