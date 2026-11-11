'use client';

import React, { useState } from 'react';
import type { Application } from '@/services/adminApi';
import AdminPerformanceIndicators from './AdminPerformanceIndicators';
import AdminCategoryDistribution from './AdminCategoryDistribution';
import { Search, TrendingUp, Sparkles, Building2, User } from 'lucide-react';

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
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            <span>Monitoring Link &amp; Match dan Rekrutmen Proyek</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Analitik Kecocokan AI &amp; Aktivitas Mahasiswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Log interaksi pencocokan cerdas AI antara profil keahlian mahasiswa dengan proyek mitra industri.
          </p>
        </div>
        <span className="text-xs font-bold px-4 py-2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 shadow-xs shrink-0 self-start sm:self-auto">
          Total Rekam Jejak: <strong>{applications.length} Pengajuan</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (7): Applications Log Table/Cards */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Log Rekam Jejak Lamaran Mahasiswa
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pelamar / proyek..."
                className="pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredApps.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p className="text-xs font-medium">Tidak ada log lamaran yang cocok</p>
              </div>
            ) : (
              filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2.5 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                        {app.studentName || 'Raden Satria'}
                      </span>
                    </div>
                    <span className="font-black text-xs text-lime-900 bg-lime-100 px-3 py-0.5 rounded-full border border-lime-300 shrink-0 shadow-xs">
                      {app.matchScore}% Match
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 pl-8">
                    <p className="font-bold text-slate-900 text-sm">{app.projectTitle}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>Mitra Industri: {app.companyName}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium pl-8">
                    <span>Diajukan: {app.appliedAt}</span>
                    <span className="font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-3 py-0.5 rounded-full border border-purple-100">
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
