import React from 'react';
import { Users, Briefcase, Sparkles, Radio } from 'lucide-react';

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
      <div className="p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all space-y-2">
        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{totalStudents}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Total Mahasiswa Terdaftar</p>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all space-y-2">
        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
          <Briefcase className="w-4 h-4" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-purple-600 tracking-tight">{totalProjects}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Lowongan Mitra Aktif</p>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all space-y-2">
        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">{averageMatchRate}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Rata-rata Akurasi AI</p>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-lg transition-all space-y-2">
        <div className="w-8 h-8 rounded-full bg-lime-50 text-lime-700 flex items-center justify-center">
          <Radio className="w-4 h-4" />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-black text-lime-700 tracking-tight">
            {onlineKiosks} / {totalKiosks} Online
          </p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Terminal Smart Kiosk</p>
        </div>
      </div>
    </div>
  );
}
