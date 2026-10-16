import React from 'react';

export default function WorkflowProcessGrid() {
  return (
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
  );
}
