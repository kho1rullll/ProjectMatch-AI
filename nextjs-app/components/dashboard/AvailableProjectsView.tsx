'use client';

import React, { useState } from 'react';
import { ALL_PROJECTS, ProjectItem } from '@/lib/data';
import ProjectModal from '@/components/ProjectModal';

interface AvailableProjectsViewProps {
  onApplyClick?: (project: ProjectItem) => void;
}

export default function AvailableProjectsView({ onApplyClick }: AvailableProjectsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalProject, setSelectedModalProject] = useState<ProjectItem | null>(null);

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'AI & Machine Learning', label: 'AI & ML' },
    { id: 'Frontend & UI/UX', label: 'Frontend & UI/UX' },
    { id: 'Backend & Cloud', label: 'Backend & Cloud' },
  ];

  const filteredProjects = ALL_PROJECTS.filter((project) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      project.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skillsRequired.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Daftar Proyek yang Tersedia
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pilih lowongan proyek riset atau magang industri yang sesuai dengan keahlian Anda.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-xs w-fit">
          {filteredProjects.length} Proyek Aktif
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama proyek, perusahaan, atau skill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50/60 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-primary-container text-white shadow-md shadow-purple-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary-container bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  {project.category}
                </span>
                <span className="font-extrabold text-lime-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-300">
                  {project.matchScore}% Cocok
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-primary-container transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  🏢 {project.company}
                </p>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap pt-1">
                <span className="bg-slate-100 px-3 py-1 rounded-full text-[11px] font-medium">📍 {project.workType}</span>
                <span className="bg-slate-100 px-3 py-1 rounded-full text-[11px] font-medium">⏳ {project.duration}</span>
                <span className="font-extrabold text-slate-900 ml-auto">💰 {project.stipend}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedModalProject(project)}
                className="flex-1 py-2.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer"
              >
                Rincian
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onApplyClick) onApplyClick(project);
                  else alert(`Lamaran untuk "${project.title}" telah disiapkan.`);
                }}
                className="flex-1 py-2.5 rounded-full text-xs font-bold text-white bg-primary-container hover:bg-primary-hover shadow-md shadow-purple-500/25 transition-all text-center cursor-pointer"
              >
                Lamar Proyek
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedModalProject && (
        <ProjectModal
          project={selectedModalProject}
          onClose={() => setSelectedModalProject(null)}
        />
      )}
    </div>
  );
}
