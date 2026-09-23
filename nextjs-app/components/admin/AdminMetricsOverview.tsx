import React from 'react';

interface AdminMetricsOverviewProps {
  totalStudents: number;
  totalProjects: number;
  averageMatchRate: string;
  onlineKiosks: number;
  totalKiosks: number;
}

export default function AdminMetricsOverview({
  totalStudents,
  totalProjects,
  averageMatchRate,
  onlineKiosks,
  totalKiosks,
}: AdminMetricsOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
      <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
        <p className="text-2xl font-black text-slate-900 font-display">{totalStudents}</p>
        <p className="text-xs font-bold text-slate-500 mt-0.5">Total Mahasiswa Terdaftar</p>
      </div>
      <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
        <p className="text-2xl font-black text-blue-600 font-display">{totalProjects}</p>
        <p className="text-xs font-bold text-slate-500 mt-0.5">Lowongan Mitra Aktif</p>
      </div>
      <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
        <p className="text-2xl font-black text-indigo-600 font-display">{averageMatchRate}</p>
        <p className="text-xs font-bold text-slate-500 mt-0.5">Rata-rata Akurasi AI (UAT)</p>
      </div>
      <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs">
        <p className="text-2xl font-black text-emerald-600 font-display">
          {onlineKiosks} / {totalKiosks} Online
        </p>
        <p className="text-xs font-bold text-slate-500 mt-0.5">Terminal Smart Kiosk</p>
      </div>
    </div>
  );
}
