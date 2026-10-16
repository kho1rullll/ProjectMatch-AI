'use client';

import React, { useState } from 'react';
import type { ProjectItem } from '@/lib/data';

interface MitraProjectsViewProps {
  projects: ProjectItem[];
  onAddNewProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onViewApplicants: (projectTitle: string) => void;
}

export default function MitraProjectsView({
  projects,
  onAddNewProject,
  onDeleteProject,
  onViewApplicants,
}: MitraProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'AI & Machine Learning', 'Frontend & UI/UX', 'Backend & Cloud', 'Blockchain & Web3'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>💼</span>
              <span>Lowongan Proyek Saya</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar lowongan magang &amp; proyek riset yang dipublikasikan oleh instansi Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddNewProject}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>➕</span>
            <span>Pasang Lowongan Baru</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lowongan proyek atau teknologi..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
            <div className="text-4xl mb-2">📂</div>
            <p className="font-bold text-slate-700 text-sm">Tidak Ada Lowongan Ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau tambah lowongan baru.</p>
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {proj.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {proj.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    ● Aktif
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                {/* Details Pills */}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                    📍 {proj.workType || 'Hybrid'}
                  </span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                    ⏱️ {proj.duration || '3 Bulan'}
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                    💰 {proj.stipend || 'Rp 4.000.000 / bln'}
                  </span>
                </div>

                {/* Skills tags */}
                {proj.skillsRequired && proj.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.skillsRequired.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onViewApplicants(proj.title)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <span>👥</span>
                  <span>Tinjau Pelamar</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteProject(proj.id)}
                  className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 font-bold text-xs transition-colors cursor-pointer border border-slate-200 hover:border-rose-200"
                  title="Hapus Lowongan"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
