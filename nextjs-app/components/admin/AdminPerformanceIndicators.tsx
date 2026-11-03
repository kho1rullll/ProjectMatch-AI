import React from 'react';
import { Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminPerformanceIndicators() {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-5">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600" />
          <span>Indikator Kinerja Sistem</span>
        </h3>
        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
          Metrik Kinerja
        </span>
      </div>

      <div className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-700 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Akurasi AI Semantic Matching</span>
            </span>
            <span className="text-purple-600 font-extrabold">94.2%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: '94.2%' }} />
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-slate-700 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
              <span>Tingkat Keberhasilan Kiosk RFID</span>
            </span>
            <span className="text-lime-700 font-extrabold">98.5%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div className="h-full bg-lime-500 rounded-full transition-all duration-500" style={{ width: '98.5%' }} />
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-slate-700 font-bold">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kepuasan Antarmuka Pengguna</span>
            </span>
            <span className="text-indigo-600 font-extrabold">4.8 / 5.0</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: '96%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
