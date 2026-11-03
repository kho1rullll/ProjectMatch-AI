import React from 'react';
import Link from 'next/link';
import { Gamepad2, ArrowRight, ShieldCheck, Trophy } from 'lucide-react';

export default function FeatureGamificationShowcase() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      {/* Left Column (Desktop Order 1): Card Preview */}
      <div className="lg:col-span-6 order-2 lg:order-1 relative">
        {/* Soft Background Accents */}
        <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />
        <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-full border-[5px] border-[#a3e635] opacity-60 pointer-events-none" />

        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-400/10 to-lime-500/10 border border-purple-200/90 shadow-2xl">
          <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5 bg-white/95">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/25">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Lembar Portofolio Mahasiswa</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Status: Talenta Terverifikasi</p>
                </div>
              </div>
              <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Top 5% Talent
              </span>
            </div>

            {/* 4 Stats Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <p className="text-[10px] uppercase font-bold tracking-wider text-purple-600">Proyek Selesai</p>
                <p className="text-xl font-black text-slate-950 font-display">8 Proyek</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-lime-50/50 border border-lime-200/80">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#3f6212]">Reputasi Mitra</p>
                <p className="text-xl font-black text-[#4d7c0f] font-display">4.9 / 5.0 ⭐</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Kontribusi</p>
                <p className="text-xl font-black text-slate-900 font-display">1.420+</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Sertifikat Resmi</p>
                <p className="text-xl font-black text-slate-900 font-display">5 Unit</p>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Terverifikasi Portofolio Kampus &amp; Mitra</span>
              </span>
              <span className="text-purple-600 font-bold hover:underline cursor-pointer">
                Lihat Grafik Kompetensi →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Desktop Order 2): Text & CTAs */}
      <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-purple-600" />
          <span>Visualisasi Portofolio Interaktif</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-display tracking-tight leading-tight">
          Visualisasi Profil Mahasiswa Seperti <span className="text-purple-600">Karakter Modern</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Tinggalkan CV statis yang membosankan. Tampilkan portofolio proyek, riwayat keahlian, dan radar kompetensi secara interaktif yang langsung memikat mitra industri dan lembaga riset terkemuka.
        </p>

        <div className="pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30 transition-all group cursor-pointer"
          >
            <span>Jelajahi Proyek yang Cocok</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
