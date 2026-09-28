import React from 'react';

interface ProjectDetailHeaderProps {
  category: string;
  matchScore: number;
  title: string;
  company: string;
  workType: string;
  duration: string;
  stipend: string;
}

export default function ProjectDetailHeader({
  category,
  matchScore,
  title,
  company,
  workType,
  duration,
  stipend,
}: ProjectDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
          {category}
        </span>
        <div className="px-4 py-1.5 rounded-full text-xs font-black badge-match-high">
          🎯 {matchScore}% Kecocokan AI
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
        <span className="font-bold text-slate-900">🏢 {company}</span>
        <span>📍 {workType}</span>
        <span>⏱️ Durasi: {duration}</span>
        <span className="font-bold text-blue-600">💰 {stipend}</span>
      </div>
    </div>
  );
}
