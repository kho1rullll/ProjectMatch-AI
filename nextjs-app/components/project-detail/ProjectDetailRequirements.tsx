import React from 'react';

interface ProjectDetailRequirementsProps {
  description: string;
  skills: string[];
}

export default function ProjectDetailRequirements({
  description,
  skills,
}: ProjectDetailRequirementsProps) {
  return (
    <>
      {/* Overview */}
      <div className="space-y-3 border-t border-border-light pt-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Deskripsi Pekerjaan &amp; Ruang Lingkup
        </h2>
        <p className="text-xs sm:text-sm text-text-body leading-relaxed">
          {description}
        </p>
      </div>

      {/* Skill Requirements */}
      <div className="space-y-3 border-t border-border-light pt-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Tech Stack &amp; Kualifikasi yang Dibutuhkan
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold text-on-surface bg-surface-container-high px-3.5 py-1.5 rounded-full border border-border-light flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
