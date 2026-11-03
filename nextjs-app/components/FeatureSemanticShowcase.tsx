import React from 'react';
import Link from 'next/link';
import { Bot, ArrowRight, Sparkles } from 'lucide-react';

export default function FeatureSemanticShowcase() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      {/* Left Column: Heading with Purple Highlights & CTAs */}
      <div className="lg:col-span-6 space-y-6 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Evaluasi Portofolio Cerdas</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-display tracking-tight leading-tight">
          Pencocokan Presisi dengan <span className="text-purple-600">Analisis Kebutuhan Industri</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Sistem cerdas menganalisis portofolio coding, riwayat repositori, dan keterampilan teknis mahasiswa, lalu mencocokkannya secara presisi dengan kualifikasi proyek yang dibutuhkan mitra industri.
        </p>

        <ul className="space-y-3 text-xs text-slate-700 font-medium">
          <li className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </div>
            <span>Ekstraksi keahlian teknis otomatis dari repositori riil mahasiswa</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </div>
            <span>Skor relevansi real-time 0–100% berdasarkan penilaian kompetensi transparan</span>
          </li>
          <li className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </div>
            <span>Rekomendasi penutupan skill gap untuk meningkatkan peluang lolos seleksi proyek</span>
          </li>
        </ul>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/projects"
            className="px-6 py-3 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Buka Eksplorasi Lowongan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard?tab=github"
            className="px-5 py-3 rounded-full text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            Tautkan Repositori GitHub
          </Link>
        </div>
      </div>

      {/* Right Column: Glassmorphism Card with 3D Ribbon & Lime Accents */}
      <div className="lg:col-span-6 relative">
        {/* Decorative 3D colored ribbon swirl & lime accents */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border-[6px] border-[#a3e635] opacity-70 pointer-events-none -z-10 animate-float-2" />
        <div className="absolute -bottom-6 -left-6 w-48 h-10 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full blur-xs opacity-80 pointer-events-none -z-10 -rotate-6" />

        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-tr from-purple-500/10 via-cyan-400/10 to-lime-400/10 border border-purple-200/90 shadow-2xl relative">
          <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5 bg-white/95">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/25">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Matriks Evaluasi Kompetensi</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Analisis Kecocokan Proyek Multi-Faktor</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                94.2% Match
              </span>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 font-medium pb-1">
                  <span>Frontend &amp; Rekayasa Antarmuka</span>
                  <span className="font-bold text-slate-900">98% match</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium pb-1">
                  <span>Backend &amp; Integrasi Layanan API</span>
                  <span className="font-bold text-slate-900">88% match</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-medium pb-1">
                  <span>Pengujian &amp; Arsitektur Cloud</span>
                  <span className="font-bold text-slate-900">82% match</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#65a30d] rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>

            {/* Footer Badge */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1 text-[#65a30d] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-ping" />
                Status: Portofolio Siap Direkomendasikan
              </span>
              <span className="text-purple-600 font-bold hover:underline cursor-pointer">
                Lihat Detail Kecocokan →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
