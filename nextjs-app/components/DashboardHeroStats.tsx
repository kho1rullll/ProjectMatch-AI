'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Radio, Sparkles, Briefcase, Award, GraduationCap } from 'lucide-react';

export default function DashboardHeroStats() {
  const { user } = useAuth();
  const studentName = user?.name || 'Raden Satria';
  const nim = user?.nim || 'V3925028';
  const gpa = (user as any)?.gpa || '3.88';

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-6">
      {/* Top Profile Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md shadow-purple-600/25">
            {studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {studentName}
              </h1>
              <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-0.5 rounded-full border border-purple-200">
                NIM: {nim}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              <span>D3 Teknik Informatika — Kampus PSDKU Madiun, Universitas Sebelas Maret</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-lime-900 bg-lime-100 px-3.5 py-1.5 rounded-full border border-lime-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-lime-600 animate-pulse" />
            <span>KTM RFID Terhubung</span>
          </span>
        </div>
      </div>

      {/* 4 Clean Metric Stat Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-slate-100">
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:border-purple-200 transition-all">
          <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-purple-600" />
            <span>Proyek Cocok</span>
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">24 Proyek</p>
        </div>
        <div className="p-4 rounded-2xl bg-lime-50/50 border border-lime-200/60 hover:border-lime-300 transition-all">
          <p className="text-[11px] font-bold text-lime-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lime-600" />
            <span>Match Tertinggi</span>
          </p>
          <p className="text-xl sm:text-2xl font-black text-lime-700 mt-1 tracking-tight">94% Cocok</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:border-purple-200 transition-all">
          <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>Lamaran Aktif</span>
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">3 Lamaran</p>
        </div>
        <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200/60 hover:border-purple-300 transition-all">
          <p className="text-[11px] font-bold text-purple-700 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            <span>IPK Kumulatif</span>
          </p>
          <p className="text-xl sm:text-2xl font-black text-purple-700 mt-1 tracking-tight">{gpa} / 4.00</p>
        </div>
      </div>
    </div>
  );
}
