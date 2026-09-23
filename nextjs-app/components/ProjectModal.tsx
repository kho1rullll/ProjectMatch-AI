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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-blue-100 space-y-6 relative"
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {project.category}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {project.matchScore}% Match Relevansi
            </span>
          </div>

          <h2 id="modal-project-title" className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            {project.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="font-bold text-slate-800">🏢 {project.company}</span>
            <span>📍 {project.workType}</span>
            <span>⏱️ {project.duration}</span>
            <span className="font-bold text-blue-600">💰 {project.stipend}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Deskripsi Proyek & Tanggung Jawab
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Skill Requirements */}
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Kebutuhan Skill & Teknologi
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.skillsRequired.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* AI Skill Breakdown Analysis */}
        <div className="space-y-3 border-t border-slate-100 pt-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>🤖 Analisis Kecocokan AI per Dimensi</span>
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Kesesuaian AI / ML:</span>
                <span className="font-bold text-slate-900">{project.requirementsBreakdown.aiml}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.requirementsBreakdown.aiml}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Kesesuaian Backend / Cloud:</span>
                <span className="font-bold text-slate-900">{project.requirementsBreakdown.backend}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${project.requirementsBreakdown.backend}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => setApplied(true)}
            disabled={applied}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
              applied ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {applied ? '✓ Lamaran Terkirim!' : 'Kirim Portofolio Hero'}
          </button>
        </div>
      </div>
    </div>
  );
}
