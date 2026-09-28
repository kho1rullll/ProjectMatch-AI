'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';

export default function DashboardHeroStats() {
  const { user } = useAuth();
  const studentName = user?.name || 'Raden Satria';
  const nim = user?.nim || 'V3925028';
  const gpa = user?.gpa || '3.88';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      {/* Top Profile Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
            {studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">
                {studentName}
              </h1>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                NIM: {nim}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              D3 Teknik Informatika — Kampus PSDKU Madiun, Universitas Sebelas Maret
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            KTM RFID Terhubung
          </span>
        </div>
      </div>

      {/* 4 Clean Metric Stat Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-medium text-slate-500">Proyek Cocok</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">24 Proyek</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-medium text-slate-500">Match Tertinggi</p>
          <p className="text-xl font-bold text-blue-600 mt-0.5">94% Cocok</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-medium text-slate-500">Lamaran Aktif</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">3 Lamaran</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-medium text-slate-500">IPK Kumulatif</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{gpa} / 4.00</p>
        </div>
      </div>
    </div>
  );
}
