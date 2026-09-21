import React from 'react';

export default function DashboardAppStatus() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-black text-slate-900 font-display">
        Status Lamaran &amp; Rekam Jejak Proyek Mahasiswa
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-blue-100 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Sedang Ditinjau Mitra (In Review)
            </span>
            <h4 className="font-bold text-sm text-slate-900 pt-1">
              Pengembangan Engine NLP Berbasis Transformer
            </h4>
            <p className="text-xs text-slate-500">BioInformatika Nusantara &amp; RS Cipto</p>
            <p className="text-[11px] text-slate-400">Diajukan: 2 hari yang lalu • Cosine Score: 94.2%</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
            94% Match
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-blue-100 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Portofolio Terverifikasi (Accepted)
            </span>
            <h4 className="font-bold text-sm text-slate-900 pt-1">
              Redesain Sistem Dashboard Telemetri IoT
            </h4>
            <p className="text-xs text-slate-500">Pusat Riset Smart City ITB</p>
            <p className="text-[11px] text-slate-400">Diajukan: 1 minggu yang lalu • Cosine Score: 88.5%</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
            88% Match
          </span>
        </div>
      </div>
    </section>
  );
}
