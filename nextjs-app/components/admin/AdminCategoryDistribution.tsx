import React from 'react';

export default function AdminCategoryDistribution() {
  return (
    <div className="glass-card rounded-3xl p-6 border border-blue-100 shadow-md space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Ringkasan Kategori Proyek Terbuka
      </h4>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-xl border border-blue-100">
          AI &amp; Machine Learning (2 Proyek)
        </span>
        <span className="bg-cyan-50 text-cyan-700 font-bold px-3 py-1.5 rounded-xl border border-cyan-100">
          Frontend &amp; UI/UX (1 Proyek)
        </span>
        <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-100">
          Backend &amp; Cloud (1 Proyek)
        </span>
        <span className="bg-purple-50 text-purple-700 font-bold px-3 py-1.5 rounded-xl border border-purple-100">
          Blockchain &amp; Web3 (1 Proyek)
        </span>
      </div>
    </div>
  );
}
