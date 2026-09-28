import React from 'react';

export default function DashboardAppStatus() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="pb-2 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">
          Status Lamaran Terbaru
        </h3>
        <p className="text-xs text-slate-500">
          Progres lamaran proyek yang baru saja Anda ajukan ke mitra industri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Sedang Ditinjau Mitra
            </span>
            <h4 className="font-bold text-xs text-slate-900 pt-1 leading-snug">
              Pengembangan Engine NLP Berbasis Transformer
            </h4>
            <p className="text-xs text-slate-500">BioInformatika Nusantara &amp; RS Cipto</p>
            <p className="text-[11px] text-slate-400">Diajukan: 2 hari lalu</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 shrink-0">
            94% Cocok
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Diterima Mitra
            </span>
            <h4 className="font-bold text-xs text-slate-900 pt-1 leading-snug">
              Redesain Sistem Dashboard Telemetri IoT
            </h4>
            <p className="text-xs text-slate-500">Pusat Riset Smart City ITB</p>
            <p className="text-[11px] text-slate-400">Diajukan: 1 minggu lalu</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 shrink-0">
            88% Cocok
          </span>
        </div>
      </div>
    </div>
  );
}
