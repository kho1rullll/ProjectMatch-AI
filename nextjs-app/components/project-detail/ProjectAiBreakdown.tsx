import React from 'react';
import type { RequirementsBreakdown } from '@/lib/data';

interface ProjectAiBreakdownProps {
  breakdown: RequirementsBreakdown;
}

export default function ProjectAiBreakdown({ breakdown }: ProjectAiBreakdownProps) {
  return (
    <div className="space-y-4 border-t border-border-light pt-6 bg-surface-container-low/70 p-5 rounded-2xl border border-border-light">
      <h3 className="text-xs font-bold text-text-heading flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
        <span>Analisis Kualifikasi Berdasarkan Vektor Portofoliomu</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <div className="flex justify-between text-text-body mb-1.5 font-semibold">
            <span>AI / Machine Learning</span>
            <span className="font-bold text-text-heading">{breakdown.aiml}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary-container rounded-full" style={{ width: `${breakdown.aiml}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-text-body mb-1.5 font-semibold">
            <span>Backend &amp; Architecture</span>
            <span className="font-bold text-text-heading">{breakdown.backend}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-secondary-fixed-dim rounded-full" style={{ width: `${breakdown.backend}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
