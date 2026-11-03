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
        <span className="text-xs font-bold text-primary bg-primary-light/70 px-3.5 py-1.5 rounded-full border border-primary/20">
          {category}
        </span>
        <div className="px-4 py-1.5 rounded-full text-xs font-bold bg-secondary-fixed/40 text-surface-dark border border-secondary-fixed flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span>{matchScore}% Semantic Match</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-text-heading font-display tracking-tight">
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-xs text-text-body font-semibold pt-1">
        <span className="text-text-heading">🏢 {company}</span>
        <span>📍 {workType}</span>
        <span>⏱️ Durasi: {duration}</span>
        <span className="font-extrabold text-primary-container">💰 {stipend}</span>
      </div>
    </div>
  );
}
