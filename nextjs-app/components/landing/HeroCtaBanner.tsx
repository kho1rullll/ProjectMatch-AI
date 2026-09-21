import React from 'react';
import Link from 'next/link';

export default function HeroCtaBanner() {
  return (
    <div className="relative rounded-3xl bg-slate-950 p-8 sm:p-14 text-white overflow-hidden shadow-2xl border border-slate-800">
      {/* Glow ambient inside dark banner */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs font-bold">
          🚀 Akses Terbuka untuk Kampus &amp; Industri
        </span>
        <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
          Siap Temukan Proyek Riset &amp; Industri yang Paling Cocok?
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
          Bergabunglah dengan ribuan mahasiswa dan ratusan mitra industri terkemuka. Mulai analisis kecocokan profilmu hari ini secara gratis.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/projects"
            className="px-6 py-3 rounded-xl text-xs font-bold text-white btn-primary-shimmer shadow-lg hover:opacity-95 transition-all"
          >
            Mulai Eksplorasi Sekarang
          </Link>
          <Link
            href="/post-project"
            className="px-6 py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all"
          >
            Pasang Lowongan Proyek Mitra
          </Link>
        </div>
      </div>
    </div>
  );
}
