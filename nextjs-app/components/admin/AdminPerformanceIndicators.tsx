import React from 'react';

export default function AdminPerformanceIndicators() {
  return (
    <div className="glass-card rounded-3xl p-6 border border-blue-100 shadow-md space-y-4">
      <h3 className="text-base font-bold text-slate-900 font-display">
        Indikator Kinerja Sistem (SKPL §1.3)
      </h3>
      <div className="space-y-3 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between text-slate-700 font-bold">
            <span>Akurasi AI Semantic Matching</span>
            <span className="text-blue-600">94.2% (Target: &ge; 85%)</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '94.2%' }} />
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-slate-700 font-bold">
            <span>Tingkat Keberhasilan Kiosk RFID</span>
            <span className="text-emerald-600">98.5% (Target: &ge; 95%)</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '98.5%' }} />
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-slate-700 font-bold">
            <span>Kepuasan Antarmuka (User Rating)</span>
            <span className="text-indigo-600">4.8 / 5.0 (Target: &ge; 4.0)</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '96%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
