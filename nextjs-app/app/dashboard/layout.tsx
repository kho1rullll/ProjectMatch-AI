// app/dashboard/layout.tsx — Sub-Dashboard Nested Layout (Modul 6)
// Menyediakan navigasi bersama (persistent shared UI) antar rute segmen dashboard
import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {/* Sub-Dashboard Shared Persistent Navigation Bar (Modul 6 Nested Layout) */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mr-2 hidden sm:inline">
              Dasbor Kampus:
            </span>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg font-bold text-blue-700 bg-blue-50/80 hover:bg-blue-100 transition-colors"
            >
              📊 Ringkasan &amp; Hero RPG
            </Link>
            <Link
              href="/projects"
              className="px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              🎯 Rekomendasi Proyek
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sesi Mahasiswa Aktif</span>
          </div>
        </div>
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
}
