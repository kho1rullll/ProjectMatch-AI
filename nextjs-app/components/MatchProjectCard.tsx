'use client';

import React from 'react';
import Link from 'next/link';
import { ProjectItem } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MatchProjectCardProps {
  project: ProjectItem;
  onSelect?: (project: ProjectItem) => void;
}

export default function MatchProjectCard({ project, onSelect }: MatchProjectCardProps) {
  const isHighMatch = project.matchScore >= 85;

  return (
    <Card
      variant="interactive"
      padding="none"
      className="bg-surface-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-border-light shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group"
    >
      <div>
        {/* Top Header: Category & Match Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="default" size="sm" className="bg-surface-container-high text-on-surface font-bold rounded-full">
            {project.category}
          </Badge>
          <Badge
            variant={isHighMatch ? 'high' : 'medium'}
            size="sm"
            className="flex items-center gap-1.5 font-bold px-3 py-1 rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>{project.matchScore}% Semantic Match</span>
          </Badge>
        </div>

        {/* Title & Company */}
        <h3 className="font-headline-sm font-bold text-base text-text-heading line-clamp-2 leading-snug group-hover:text-primary-container transition-colors">
          {project.title}
        </h3>
        <p className="text-xs font-semibold text-text-body mt-1.5 flex items-center gap-1.5">
          <span>🏢 {project.company}</span>
          {project.verified && (
            <span className="inline-flex items-center gap-0.5 text-primary text-[10px] bg-primary-light/70 px-2 py-0.5 rounded-full font-bold">
              ✓ Verified
            </span>
          )}
        </p>

        {/* Short Description */}
        <p className="text-xs text-text-muted mt-3 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.skillsRequired.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold text-on-surface bg-surface-container-high px-2.5 py-1 rounded-full flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[12px] text-secondary">check_circle</span>
              {skill}
            </span>
          ))}
          {project.skillsRequired.length > 4 && (
            <span className="text-[10px] font-semibold text-text-muted bg-surface-container-low px-2 py-1 rounded-full">
              +{project.skillsRequired.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Info & Action */}
      <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block font-bold">Stipend / Bulan</span>
          <span className="font-extrabold text-text-heading">{project.stipend}</span>
        </div>

        <div className="flex items-center gap-2">
          {onSelect ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onSelect(project)}
              className="font-bold rounded-full cursor-pointer"
            >
              Lihat Detail
            </Button>
          ) : (
            <Link
              href={`/projects/${project.id}`}
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-primary-container hover:bg-primary-hover shadow-md shadow-purple-500/20 transition-all"
            >
              Lihat Detail
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
