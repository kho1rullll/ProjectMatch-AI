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
          <h1 className="text-xl font-bold text-slate-900">
            Daftar Proyek yang Tersedia
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih lowongan proyek riset atau magang industri yang sesuai dengan keahlian Anda.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs w-fit">
          {filteredProjects.length} Proyek Aktif
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama proyek, perusahaan, atau skill..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {project.category}
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {project.matchScore}% Cocok
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  🏢 {project.company}
                </p>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                <span className="bg-slate-100 px-2 py-0.5 rounded">📍 {project.workType}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded">⏳ {project.duration}</span>
                <span className="font-semibold text-slate-900">💰 {project.stipend}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedModalProject(project)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer"
              >
                Rincian
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onApplyClick) onApplyClick(project);
                  else alert(`Lamaran untuk "${project.title}" telah disiapkan.`);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all text-center cursor-pointer"
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
