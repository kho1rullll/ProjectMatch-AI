import React from 'react';

export default function HeroMetricsBar() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="block text-2xl sm:text-3xl font-black text-slate-900 font-display">1.240+</span>
          <span className="text-xs text-slate-500 font-medium">Mahasiswa Terdaftar</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="block text-2xl sm:text-3xl font-black text-blue-600 font-display">890+</span>
          <span className="text-xs text-slate-500 font-medium">Proyek Cocok Selesai</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="block text-2xl sm:text-3xl font-black text-emerald-600 font-display">94.2%</span>
          <span className="text-xs text-slate-500 font-medium">Akurasi AI Cosine Match</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="block text-2xl sm:text-3xl font-black text-indigo-600 font-display">3 Unit</span>
          <span className="text-xs text-slate-500 font-medium">Smart Kiosk RFID IoT</span>
        </div>
      </div>
    </section>
  );
}
