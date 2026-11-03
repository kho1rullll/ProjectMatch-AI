import React from 'react';
import { Clock, CheckCircle2, Building2 } from 'lucide-react';

export default function DashboardAppStatus() {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-5">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
          Status Lamaran Proyek Terbaru
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Progres lamaran proyek yang baru saja Anda ajukan ke mitra industri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-200 hover:shadow-md transition-all flex items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Sedang Ditinjau Mitra</span>
            </span>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 pt-0.5 leading-snug">
              Pengembangan Engine NLP Berbasis Transformer
            </h4>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>BioInformatika Nusantara &amp; RS Cipto</span>
            </p>
            <p className="text-[11px] text-slate-400">Diajukan: 2 hari lalu</p>
          </div>
          <span className="text-xs font-black text-lime-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-300 shrink-0 shadow-xs">
            94% Cocok
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-200 hover:shadow-md transition-all flex items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-lime-900 bg-lime-100 px-3 py-0.5 rounded-full border border-lime-300">
              <CheckCircle2 className="w-3 h-3 text-lime-700" />
              <span>Diterima Mitra</span>
            </span>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 pt-0.5 leading-snug">
              Redesain Sistem Dashboard Telemetri IoT
            </h4>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>Pusat Riset Smart City ITB</span>
            </p>
            <p className="text-[11px] text-slate-400">Diajukan: 1 minggu lalu</p>
          </div>
          <span className="text-xs font-black text-lime-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-300 shrink-0 shadow-xs">
            88% Cocok
          </span>
        </div>
      </div>
    </div>
  );
}
