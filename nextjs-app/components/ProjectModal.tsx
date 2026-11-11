'use client';

import React, { useState, useEffect } from 'react';
import { ProjectItem } from '@/lib/data';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-dark/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
        className="bg-surface-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-border-light space-y-6 relative"
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-text-muted hover:text-text-heading hover:bg-surface-container-low transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary bg-primary-light/70 px-3 py-1 rounded-full border border-primary/20">
              {project.category}
            </span>
            <span className="text-xs font-bold text-surface-dark bg-secondary-fixed/40 px-3 py-1 rounded-full border border-secondary-fixed flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              {project.matchScore}% Match Relevansi
            </span>
          </div>

          <h2 id="modal-project-title" className="text-xl sm:text-2xl font-extrabold text-text-heading font-display tracking-tight">
            {project.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-text-body font-semibold">
            <span className="text-text-heading">🏢 {project.company}</span>
            <span>📍 {project.workType}</span>
            <span>⏱️ {project.duration}</span>
            <span className="font-extrabold text-primary-container">💰 {project.stipend}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 border-t border-border-light pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Deskripsi Proyek &amp; Tanggung Jawab
          </h3>
          <p className="text-xs sm:text-sm text-text-body leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Skill Requirements */}
        <div className="space-y-2 border-t border-border-light pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Kebutuhan Skill &amp; Teknologi
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.skillsRequired.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold text-on-surface bg-surface-container-high px-3 py-1.5 rounded-full border border-border-light flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* AI Skill Breakdown Analysis */}
        <div className="space-y-3 border-t border-border-light pt-4 bg-surface-container-low/70 p-4 rounded-2xl border border-border-light">
          <h3 className="text-xs font-bold text-text-heading flex items-center gap-1.5">
            <span>🤖 Analisis Kecocokan AI per Dimensi</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-text-body mb-1 font-semibold">
                <span>Kesesuaian AI / ML:</span>
                <span className="font-bold text-text-heading">{project.requirementsBreakdown.aiml}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary-container rounded-full" style={{ width: `${project.requirementsBreakdown.aiml}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-text-body mb-1 font-semibold">
                <span>Kesesuaian Backend / Cloud:</span>
                <span className="font-bold text-text-heading">{project.requirementsBreakdown.backend}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-secondary-fixed-dim rounded-full" style={{ width: `${project.requirementsBreakdown.backend}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-text-body hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => setApplied(true)}
            disabled={applied}
            className={`px-6 py-2.5 rounded-full text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
              applied ? 'bg-secondary text-surface-white' : 'bg-primary-container hover:bg-primary-hover shadow-purple-500/25'
            }`}
          >
            {applied ? '✓ Lamaran Terkirim!' : 'Kirim Portofolio Hero'}
          </button>
        </div>
      </div>
    </div>
  );
}
