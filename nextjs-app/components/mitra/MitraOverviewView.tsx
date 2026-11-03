'use client';

import React from 'react';
import type { ProjectItem } from '@/lib/data';
import type { MitraApplication, MitraStats } from '@/services/mitraApi';
import type { Student } from '@/services/adminApi';
import type { MitraTab } from './MitraSidebar';

interface MitraOverviewViewProps {
  stats: MitraStats;
  projects: ProjectItem[];
  applications: MitraApplication[];
  students: Student[];
  onNavigateTab: (tab: MitraTab) => void;
}

export default function MitraOverviewView({
  stats,
  projects,
  applications,
  students,
  onNavigateTab,
}: MitraOverviewViewProps) {
  const pendingApps = applications.filter((a) => !a.status || a.status === 'REVIEW');
  const acceptedApps = applications.filter((a) => a.status === 'ACCEPTED');

  return (
    <div className="space-y-6">
      {/* 1. Clean Welcome Banner */}
      <div className="bg-[#0B0F19] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Ambient glow inside banner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-lime-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-accent-lime-glow text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-accent-lime-glow animate-pulse" />
            <span>Portal Kemitraan Industri &amp; Riset Terverifikasi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Selamat Datang di Dasbor Rekrutmen Mitra
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Kelola lowongan proyek, tinjau skor kecocokan mahasiswa dengan kecerdasan buatan, dan pilih kandidat terbaik untuk proyek Anda.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => onNavigateTab('post-project')}
            className="px-5 py-2.5 rounded-full bg-primary-container hover:bg-primary-hover text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>➕</span>
            <span>Pasang Lowongan Baru</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('applicants')}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/10 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>👥</span>
            <span>Tinjau Pelamar ({pendingApps.length})</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Lowongan</span>
            <span className="text-base p-2 bg-purple-50 text-primary-container rounded-2xl">💼</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{stats.totalProjects}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Lowongan terdaftar</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Lowongan Aktif</span>
            <span className="text-base p-2 bg-lime-100 text-lime-900 rounded-2xl">●</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-lime-700 mt-2">{stats.activeProjects}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sedang membuka pendaftaran</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pelamar Masuk</span>
            <span className="text-base p-2 bg-amber-50 text-amber-700 rounded-2xl">👥</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">{stats.totalApplicants}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{pendingApps.length} perlu ditinjau</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Lamaran Diterima</span>
            <span className="text-base p-2 bg-purple-50 text-primary-container rounded-2xl">✓</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-primary-container mt-2">{acceptedApps.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Kandidat lolos seleksi</p>
        </div>
      </div>

      {/* 3. Side-by-Side: Recent Applicants & My Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applicants */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>👥</span>
                <span>Pelamar Masuk Terbaru</span>
              </h3>
              <p className="text-xs text-slate-500">Kandidat mahasiswa yang baru saja melamar</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('applicants')}
              className="text-xs font-bold text-primary-container hover:text-purple-700 cursor-pointer transition-colors"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-2.5">
            {applications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-white hover:border-purple-200 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-primary-container font-black text-xs flex items-center justify-center shrink-0 border border-purple-200/60">
                    {(app.studentName || 'RS')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{app.studentName || 'Raden Satria'}</p>
                    <p className="text-[11px] text-slate-500 truncate">Melamar: {app.projectTitle}</p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] font-black text-lime-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-300 block">
                    {app.matchScore}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Active Projects */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>💼</span>
                <span>Lowongan Proyek Anda</span>
              </h3>
              <p className="text-xs text-slate-500">Daftar lowongan yang sedang aktif dipublikasikan</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('my-projects')}
              className="text-xs font-bold text-primary-container hover:text-purple-700 cursor-pointer transition-colors"
            >
              Kelola Lowongan →
            </button>
          </div>

          <div className="space-y-2.5">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 hover:bg-white hover:border-purple-200 transition-all"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{proj.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {proj.category} • {proj.stipend || 'Rp 4.000.000 / bln'}
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="text-[10px] font-bold text-lime-900 bg-lime-100 px-2.5 py-0.5 rounded-full border border-lime-300">
                    Aktif
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Clean Talents Preview */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>🎯</span>
              <span>Talenta Mahasiswa Unggulan</span>
            </h3>
            <p className="text-xs text-slate-500">Eksplorasi mahasiswa bertalenta tinggi yang siap direkrut</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('talents')}
            className="text-xs font-bold text-primary-container hover:text-purple-700 cursor-pointer transition-colors"
          >
            Lihat Semua Talenta →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {students.slice(0, 3).map((stud) => (
            <div
              key={stud.id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-container to-indigo-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
                  {stud.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{stud.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{stud.university}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600 border-t border-slate-200/60">
                <span>IPK: <strong className="text-slate-900">{stud.gpa || '3.88'}</strong></span>
                <span className="text-lime-700 font-bold text-[10px]">✓ Terverifikasi</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
