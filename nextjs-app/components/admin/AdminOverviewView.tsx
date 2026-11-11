'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { AdminStatistics } from '@/types/admin';
import { RefreshCw, Users, Briefcase, Sparkles, Bookmark, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function AdminOverviewView() {
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getStatistics();
      setStats(data);
    } catch {
      setStats(null);
      setSyncFeedback('Gagal memuat statistik langsung dari server backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await api.jobs.syncJobs();
      setSyncFeedback(res.message || 'Sinkronisasi lowongan multi-platform berhasil dijalankan.');
      await fetchStats();
    } catch (e: any) {
      setSyncFeedback(e.message || 'Gagal menyinkronkan data lowongan.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Sync Action */}
      <div className="bg-[#0B0F19] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Ambient glow inside banner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-lime-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-accent-lime-glow text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-accent-lime-glow" />
            <span>Monitoring &amp; Statistik Agregasi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Dasbor Monitoring Agregasi Lowongan &amp; Talenta
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Pantau sebaran lowongan pekerjaan riil dari platform LinkedIn, Freelancer.com, Kalibrr, dan Remotive serta interaksi rekomendasi semantik mahasiswa.
          </p>
        </div>

        {/* Trigger Sync API (FR-10) */}
        <div className="relative z-10 shrink-0">
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="w-full md:w-auto px-6 py-3 rounded-full bg-primary-container hover:bg-primary-hover text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-500/25 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan API...' : 'Sinkronkan Job Feed'}</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-4 rounded-2xl bg-lime-100 border border-lime-300 text-lime-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-lime-700 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Grid Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Mahasiswa</span>
            <Users className="w-4 h-4 text-primary-container" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats?.total_mahasiswa ?? 0}
          </p>
          <p className="text-[11px] text-lime-700 font-bold flex items-center gap-1">
            <span>{stats?.active_users ?? 0} Akun Aktif Terdaftar</span>
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Lowongan Teragregasi</span>
            <Briefcase className="w-4 h-4 text-lime-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats?.total_jobs ?? 0}
          </p>
          <p className="text-[11px] text-slate-500 font-semibold">
            Status Terbuka (Open)
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pencocokan Dihitung</span>
            <Sparkles className="w-4 h-4 text-primary-container" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats?.total_matches_computed ?? 0}
          </p>
          <p className="text-[11px] text-primary-container font-bold">
            Rata-rata Skor: {Math.round((stats?.average_similarity_score ?? 0.8) * 100)}%
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Lowongan Dibookmark</span>
            <Bookmark className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats?.total_bookmarks ?? 0}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold">
            Interaksi Minat Mahasiswa
          </p>
        </div>
      </div>

      {/* Rincian Agregasi Multi-Platform (LinkedIn, Freelancer.com, Kalibrr, Remotive) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
            Sebaran Lowongan per Platform Eksternal
          </h3>
          <p className="text-xs text-slate-500">
            Distribusi jumlah lowongan riil aktif yang berhasil ditarik dari API masing-masing platform.
          </p>

          <div className="space-y-4 pt-2">
            {[
              { key: 'linkedin', label: 'LinkedIn Jobs API', dotClass: 'bg-blue-600', textClass: 'text-blue-700', barClass: 'bg-blue-600' },
              { key: 'freelancer', label: 'Freelancer.com API', dotClass: 'bg-cyan-600', textClass: 'text-cyan-700', barClass: 'bg-cyan-600' },
              { key: 'kalibrr', label: 'Kalibrr Jobs API', dotClass: 'bg-amber-500', textClass: 'text-amber-700', barClass: 'bg-amber-500' },
              { key: 'remotive', label: 'Remotive Remote API', dotClass: 'bg-emerald-600', textClass: 'text-emerald-700', barClass: 'bg-emerald-600' },
            ].map(({ key, label, dotClass, textClass, barClass }) => {
              const count = (stats?.jobs_by_platform as Record<string, number> | undefined)?.[key] ?? 0;
              const pct = stats?.total_jobs ? Math.round((count / stats.total_jobs) * 100) : 0;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-800">
                      <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} /> {label}
                    </span>
                    <span className={`font-mono font-bold ${textClass}`}>{count} Lowongan</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tipe Kontrak */}
        <div className="md:col-span-5 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Kategori Tipe Pekerjaan
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Distribusi lowongan Freelance dan Part-Time untuk mahasiswa vokasi.
            </p>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Freelance (Milestone / Project)</p>
                  <p className="text-[11px] text-slate-500">Fleksibel berbasis hasil akhir</p>
                </div>
                <span className="text-lg font-black text-primary-container font-mono">
                  {stats?.jobs_by_type.freelance ?? 0}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Part-Time (Waktu Paruh)</p>
                  <p className="text-[11px] text-slate-500">Jam kerja terstruktur per minggu</p>
                </div>
                <span className="text-lg font-black text-lime-700 font-mono">
                  {stats?.jobs_by_type.part_time ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-400">
              Infrastruktur Cloud &amp; AI Engine Berkinerja Tinggi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
