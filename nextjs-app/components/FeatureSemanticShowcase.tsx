import React from 'react';

export default function FeatureSemanticShowcase() {
  return (
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
                <span>Backend &amp; API Pipeline</span>
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
  );
}
