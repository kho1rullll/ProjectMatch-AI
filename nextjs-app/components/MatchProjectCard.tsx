'use client';

import React from 'react';
import Link from 'next/link';
import { ProjectItem } from '@/lib/data';

interface MatchProjectCardProps {
  project: ProjectItem;
  onSelect?: (project: ProjectItem) => void;
}

export default function MatchProjectCard({ project, onSelect }: MatchProjectCardProps) {
  const isHighMatch = project.matchScore >= 85;

  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between border border-blue-100 shadow-sm relative group">
      <div>
        {/* Top Header: Category & Match Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {project.category}
          </span>
          <div
            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
              isHighMatch ? 'badge-match-high' : 'badge-match-medium'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{project.matchScore}% Match</span>
          </div>
        </div>

        {/* Title & Company */}
        <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1.5">
          <span>🏢 {project.company}</span>
          {project.verified && (
            <span className="text-blue-600 text-[11px]" title="Mitra Terverifikasi">
              ✓
            </span>
          )}
        </p>

        {/* Short Description */}
        <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.skillsRequired.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100/70"
            >
              {skill}
            </span>
          ))}
          {project.skillsRequired.length > 4 && (
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
              +{project.skillsRequired.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Info & Action */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">Stipend / Bulan</span>
          <span className="font-bold text-slate-800">{project.stipend}</span>
        </div>

        <div className="flex items-center gap-2">
          {onSelect ? (
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Lihat Detail
            </button>
          ) : (
            <Link
              href={`/projects/${project.id}`}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              Lihat Detail
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
