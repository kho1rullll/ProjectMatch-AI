import React from 'react';
import Link from 'next/link';

export default function FeatureZigZag() {
  return (
    <div className="space-y-24 py-10">
      
      {/* ========================================================================= */}
      {/* SECTION 1: ZIG-ZAG ALTERNATING FEATURE ROWS                               */}
      {/* ========================================================================= */}

      {/* Row 1: AI Semantic Engine (Text Left, Card Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <span>✨ Teknologi Utama</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight leading-tight">
            Pencocokan Presisi dengan <span className="gradient-text-blue">Cosine Similarity</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Algoritma AI mengekstraksi vektor embedding dari resume, portofolio GitHub, dan silabus akademik mahasiswa, lalu membandingkannya langsung dengan kebutuhan teknis proyek mitra secara matematis.
          </p>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
              <span>Ekstraksi otomatis kualifikasi teknis dan soft skill mahasiswa</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
              <span>Skor relevansi real-time 0-100% dengan breakdown multi-kategori</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">✓</div>
              <span>Rekomendasi kursus/sertifikasi untuk menutup *skill gap*</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-6">
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-tr from-blue-500/10 via-cyan-400/10 to-indigo-500/10 border border-blue-200 shadow-xl relative">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    AI
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Semantic Matching Matrix</h4>
                    <p className="text-[10px] text-slate-500">Vector Embeddings (Dimension: 1536)</p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  94.2% Match
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>NLP / Transformer Tech</span>
                  <span className="font-bold text-slate-900">98% match</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '98%' }} />
                </div>
                <div className="flex justify-between text-slate-600 pt-1">
                  <span>Backend & API Pipeline</span>
                  <span className="font-bold text-slate-900">88% match</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: RPG Stats & Gamifikasi (Card Left, Text Right) */}
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
            Tinggalkan CV konvensional yang membosankan. Tampilkan portofolio, badges prestasi, dan matriks keahlian 5D secara interaktif yang langsung memikat HRD & Principal Investigator mitra riset.
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

      {/* ========================================================================= */}
      {/* SECTION 2: 4-STEP PROCESS GRID (01, 02, 03, 04)                           */}
      {/* ========================================================================= */}
      <div className="pt-10 border-t border-slate-200/80 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            Alur Kerja Sederhana
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
            Bagaimana ProjectMatch AI Bekerja
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Hanya butuh 4 langkah mudah untuk menghubungkan portofoliomu dengan proyek impian.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl p-6 space-y-4 hover:border-blue-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Lengkapi Profil Hero</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unggah riwayat proyek GitHub, sertifikat, dan isi keahlian utama untuk membentuk radar kompetensi.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-4 hover:border-cyan-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI Vector Embedding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem memproses profil menjadi vektor multi-dimensi dan melakukan inferensi kecocokan seketika.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-4 hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Review Skor Kemiripan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pilih lowongan dengan kecocokan tertinggi dan tinjau kebutuhan skill yang spesifik dari mitra.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-4 hover:border-emerald-300 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Kolaborasi Industri</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Terhubung langsung dengan tim industri, mulai pengerjaan proyek, dan dapatkan sertifikat resmi.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: DARK CALL TO ACTION BANNER (HIGH CONTRAST)                     */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-slate-950 p-8 sm:p-14 text-white overflow-hidden shadow-2xl border border-slate-800">
        {/* Glow ambient inside dark banner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs font-bold">
            🚀 Akses Terbuka untuk Kampus & Industri
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
            Siap Temukan Proyek Riset & Industri yang Paling Cocok?
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

    </div>
  );
}
