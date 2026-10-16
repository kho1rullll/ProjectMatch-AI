import React from 'react';
import Link from 'next/link';

export default function FeatureGamificationShowcase() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-6 order-2 lg:order-1">
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-400/10 to-blue-500/10 border border-indigo-200 shadow-xl">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  ⚔️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Hero RPG Character Sheet</h4>
                  <p className="text-[10px] text-slate-500">Tier: Master Engineer Level 4</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                Top 5% Talent
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] text-slate-500">Total Proyek Selesai</p>
                <p className="text-base font-black text-slate-900">8 Proyek</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] text-slate-500">Reputasi Mitra</p>
                <p className="text-base font-black text-emerald-600">4.9 / 5.0 ⭐</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <span>🎮 Gamifikasi Talenta</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight leading-tight">
          Visualisasi Profil Mahasiswa Seperti <span className="gradient-text-purple">Karakter RPG</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Tinggalkan CV konvensional yang membosankan. Tampilkan portofolio, badges prestasi, dan matriks keahlian 5D secara interaktif yang langsung memikat HRD &amp; Principal Investigator mitra riset.
        </p>
        <div className="pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            <span>Jelajahi Proyek yang Cocok</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
