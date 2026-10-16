'use client';

import React, { useState } from 'react';
import type { Application } from '@/services/adminApi';
import AdminPerformanceIndicators from './AdminPerformanceIndicators';
import AdminCategoryDistribution from './AdminCategoryDistribution';

interface AdminAnalyticsViewProps {
  applications: Application[];
}

export default function AdminAnalyticsView({
  applications,
}: AdminAnalyticsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = applications.filter(
    (app) =>
      (app.studentName && app.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.projectTitle && app.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.companyName && app.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header Summary */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>📈</span>
            <span>Monitoring Link &amp; Match dan Rekrutmen Proyek</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log interaksi pencocokan cerdas Cosine Similarity antara profil keahlian mahasiswa dengan proyek mitra industri.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
          Total Rekam Jejak: <strong>{applications.length} Pengajuan</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (7): Applications Log Table/Cards */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900">
              Log Rekam Jejak Lamaran Mahasiswa
            </h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pelamar / proyek..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {filteredApps.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <p className="text-xs font-medium">Tidak ada log lamaran yang cocok</p>
              </div>
            ) : (
              filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70 space-y-2 hover:bg-slate-50 hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {app.studentName || 'Raden Satria (V3925028)'}
                    </span>
                    <span className="font-black text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      {app.matchScore}% Match
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">{app.projectTitle}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Mitra Industri: {app.companyName}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-medium">
                    <span>Diajukan: {app.appliedAt}</span>
                    <span className="font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col (5): Charts & Distribution */}
        <div className="lg:col-span-5 space-y-6">
          <AdminPerformanceIndicators />
          <AdminCategoryDistribution />
        </div>
      </div>
    </div>
  );
}
