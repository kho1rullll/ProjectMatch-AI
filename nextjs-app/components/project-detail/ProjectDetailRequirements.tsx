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
      <div className="space-y-3 border-t border-slate-100 pt-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Deskripsi Pekerjaan &amp; Ruang Lingkup
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Skill Requirements */}
      <div className="space-y-3 border-t border-slate-100 pt-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Tech Stack &amp; Kualifikasi yang Dibutuhkan
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
