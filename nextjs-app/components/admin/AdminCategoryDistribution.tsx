import React from 'react';
import { Layers } from 'lucide-react';

export default function AdminCategoryDistribution() {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-purple-600" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Ringkasan Kategori Proyek Terbuka
        </h4>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-purple-50 text-purple-700 font-bold px-3.5 py-1.5 rounded-full border border-purple-200 shadow-xs">
          AI &amp; Machine Learning (2 Proyek)
        </span>
        <span className="bg-lime-100 text-lime-900 font-bold px-3.5 py-1.5 rounded-full border border-lime-300 shadow-xs">
          Frontend &amp; UI/UX (1 Proyek)
        </span>
        <span className="bg-indigo-50 text-indigo-700 font-bold px-3.5 py-1.5 rounded-full border border-indigo-100 shadow-xs">
          Backend &amp; Cloud (1 Proyek)
        </span>
        <span className="bg-slate-100 text-slate-800 font-bold px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
          Blockchain &amp; Web3 (1 Proyek)
        </span>
      </div>
    </div>
  );
}
