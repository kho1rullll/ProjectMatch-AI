import React from 'react';
import Link from 'next/link';
import { STUDENT_PROFILE } from '@/lib/data';
import SyncCvButton from './SyncCvButton';

export default function DashboardHeroStats() {
  const studentName = STUDENT_PROFILE.name;
  const nim = 'V3925028';
  const gpa = '3.88';
  const rfid = '0x8F3A29B1';

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Avatar & Identitas Akademis */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20 shrink-0 ring-4 ring-white">
            {studentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                {studentName}
              </h1>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                NIM: {nim}
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Hero Tier S (Lv. 4)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              D3 Teknik Informatika — Kampus PSDKU Madiun, Universitas Sebelas Maret
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span>Semester 6</span>
              <span>•</span>
              <span>
                IPK Kumulatif: <strong className="text-slate-900">{gpa} / 4.00</strong>
              </span>
              <span>•</span>
              <span className="text-blue-600 font-semibold">24 Proyek Cocok</span>
            </div>
          </div>
        </div>

        {/* Smart Campus Kiosk RFID & Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
          {/* IoT RFID Tag Pill (SKPL §1.2 & §3) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Smart Kiosk RFID: {rfid} (KTM Terhubung)</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/projects"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              Eksplorasi Proyek
            </Link>
            <SyncCvButton />
          </div>
        </div>
      </div>
    </div>
  );
}
