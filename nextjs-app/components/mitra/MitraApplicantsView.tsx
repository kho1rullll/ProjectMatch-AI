'use client';

import React, { useState } from 'react';
import type { MitraApplication } from '@/services/mitraApi';

interface MitraApplicantsViewProps {
  applications: MitraApplication[];
  onUpdateStatus: (applicationId: string, status: 'REVIEW' | 'ACCEPTED' | 'REJECTED') => void;
  isUpdating?: boolean;
}

export default function MitraApplicantsView({
  applications,
  onUpdateStatus,
  isUpdating = false,
}: MitraApplicantsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'REVIEW' | 'ACCEPTED' | 'REJECTED'>('ALL');

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      (app.studentName && app.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.projectTitle && app.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.companyName && app.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const status = app.status?.toUpperCase() || 'REVIEW';
    const matchesStatus = filterStatus === 'ALL' || status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const acceptedCount = applications.filter((a) => a.status === 'ACCEPTED').length;
  const reviewCount = applications.filter((a) => !a.status || a.status === 'REVIEW').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Header Info & Controls */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>👥</span>
              <span>Daftar Pelamar Masuk</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluasi kandidat mahasiswa berdasarkan skor kecocokan AI dan tentukan keputusan penerimaan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Ditinjau: <strong>{reviewCount}</strong>
            </span>
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-lime-100 text-lime-900 border border-lime-300">
              Diterima: <strong>{acceptedCount}</strong>
            </span>
          </div>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama mahasiswa atau proyek..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 text-xs font-semibold overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterStatus('ALL')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'ALL'
                  ? 'bg-primary-container text-white shadow-md shadow-purple-500/25 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({applications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('REVIEW')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'REVIEW'
                  ? 'bg-primary-container text-white shadow-md shadow-purple-500/25 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ditinjau ({reviewCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('ACCEPTED')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'ACCEPTED'
                  ? 'bg-primary-container text-white shadow-md shadow-purple-500/25 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diterima ({acceptedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('REJECTED')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === 'REJECTED'
                  ? 'bg-primary-container text-white shadow-md shadow-purple-500/25 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ditolak ({rejectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
            <div className="text-4xl mb-2">👥</div>
            <p className="font-bold text-slate-700 text-sm">Tidak Ada Pelamar Ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci atau filter status lamaran.</p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const currentStatus = app.status?.toUpperCase() || 'REVIEW';
            return (
              <div
                key={app.id}
                className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-xl hover:border-purple-300 hover:-translate-y-0.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left: Applicant Details */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-primary-container font-black text-sm flex items-center justify-center shrink-0 border border-purple-200/60">
                    {(app.studentName || 'RS')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-primary-container transition-colors">{app.studentName || 'Raden Satria'}</h3>
                      <span className="text-[10px] font-black text-lime-900 bg-lime-100 px-3 py-0.5 rounded-full border border-lime-300">
                        {app.matchScore}% Match AI
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Melamar Lowongan: <strong className="text-slate-900 font-bold">{app.projectTitle}</strong>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span>Diajukan: {app.appliedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status Pill & Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <span
                    className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider ${
                      currentStatus === 'ACCEPTED'
                        ? 'bg-lime-100 text-lime-900 border border-lime-300 font-black'
                        : currentStatus === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {currentStatus === 'ACCEPTED' ? '✓ Diterima' : currentStatus === 'REJECTED' ? '✕ Ditolak' : '⏳ Ditinjau'}
                  </span>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2">
                    {currentStatus !== 'ACCEPTED' && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(app.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-primary-container hover:bg-primary-hover text-white rounded-full text-xs font-bold transition-all shadow-md shadow-purple-500/25 cursor-pointer"
                      >
                        Terima
                      </button>
                    )}

                    {currentStatus !== 'REJECTED' && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(app.id, 'REJECTED')}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        Tolak
                      </button>
                    )}

                    {currentStatus !== 'REVIEW' && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(app.id, 'REVIEW')}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-all cursor-pointer"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
