import React from 'react';
import type { RequirementsBreakdown } from '@/lib/data';

interface ProjectAiBreakdownProps {
  breakdown: RequirementsBreakdown;
}

export default function ProjectAiBreakdown({ breakdown }: ProjectAiBreakdownProps) {
  return (
    <div className="space-y-4 border-t border-slate-100 pt-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
      <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
        <span>📊 Analisis Kualifikasi Berdasarkan Vektor Portofoliomu</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <div className="flex justify-between text-slate-600 mb-1">
            <span>AI / Machine Learning</span>
            <span className="font-bold text-slate-900">{breakdown.aiml}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${breakdown.aiml}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-600 mb-1">
            <span>Backend &amp; Architecture</span>
            <span className="font-bold text-slate-900">{breakdown.backend}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${breakdown.backend}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
