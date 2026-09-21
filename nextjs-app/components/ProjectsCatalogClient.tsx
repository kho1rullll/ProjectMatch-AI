'use client';

import React, { useState, useMemo } from 'react';
import ProjectFilterBar from '@/components/ProjectFilterBar';
import MatchProjectCard from '@/components/MatchProjectCard';
import ProjectModal from '@/components/ProjectModal';
import { ALL_PROJECTS, ProjectItem } from '@/lib/data';
import { useProjectsQuery } from '@/hooks/useProjects';
import { useUIStore } from '@/store/useUIStore';

export default function ProjectsCatalogClient() {
  const { selectedCategory, setSelectedCategory } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [minMatchScore, setMinMatchScore] = useState(50);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // TanStack Query v5 Hook (Modul 7 Server State)
  const { data: serverProjects, isLoading, isError, refetch } = useProjectsQuery();

  const categories = [
    'Semua Kategori',
    'AI & Machine Learning',
    'Frontend & UI/UX',
    'Backend & Cloud',
    'Fullstack Web',
    'Blockchain & Web3',
  ];

  // Merge server data with fallback seed data
  const combinedProjects: ProjectItem[] = useMemo(() => {
    if (!serverProjects || serverProjects.length === 0) {
      return ALL_PROJECTS;
    }

    const list: ProjectItem[] = serverProjects.map((p) => {
      const skills = Array.isArray(p.skillsRequired)
        ? p.skillsRequired
        : typeof p.skillsRequired === 'string'
        ? (p.skillsRequired as string).split(',').map((s) => s.trim())
        : [];

      return {
        id: p.id,
        title: p.title,
        company: p.company,
        category: p.category,
        matchScore: p.matchScore || 90,
        similarityMetric: (p.matchScore || 90) / 100,
        workType: p.workType,
        duration: p.duration || '3 Bulan',
        stipend: p.stipend || 'Rp 4.000.000 / bln',
        description: p.description || '',
        skillsRequired: skills,
        requirementsBreakdown: p.requirementsBreakdown || {
          aiml: 85,
          frontend: 70,
          uiux: 65,
          backend: 80,
          architecture: 75,
        },
        verified: p.verified ?? true,
        postedAt: p.postedAt || 'Baru saja',
      };
    });

    // Ensure all seed projects are also included if not already present
    ALL_PROJECTS.forEach((seed) => {
      if (!list.some((item) => item.id === seed.id)) {
        list.push(seed);
      }
    });

    return list;
  }, [serverProjects]);

  // Filter logic (Modul 5 SKPL-F-06)
  const filteredProjects = useMemo(() => {
    return combinedProjects.filter((proj) => {
      if (selectedCategory !== 'Semua Kategori' && proj.category !== selectedCategory) {
        return false;
      }
      if (proj.matchScore < minMatchScore) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTitle = proj.title.toLowerCase().includes(query);
        const matchCompany = proj.company.toLowerCase().includes(query);
        const matchSkills = proj.skillsRequired.some((s) => s.toLowerCase().includes(query));
        if (!matchTitle && !matchCompany && !matchSkills) {
          return false;
        }
      }
      return true;
    });
  }, [combinedProjects, selectedCategory, minMatchScore, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Dynamic Status Counter Bar */}
      <div className="flex items-center justify-end gap-2">
        {isLoading && (
          <span className="text-xs font-semibold text-blue-600 animate-pulse bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
            Sinkronisasi data server...
          </span>
        )}
        <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
          Ditemukan: <strong className="text-blue-600">{filteredProjects.length} Lowongan</strong>
        </span>
      </div>

      {/* Filter Component */}
      <ProjectFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        minMatchScore={minMatchScore}
        onMinMatchScoreChange={setMinMatchScore}
      />

      {/* Async Error State (SKPL-NF-02) */}
      {isError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800">
          <span>Menampilkan data cadangan lokal karena sinkronisasi background server tertunda.</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="font-bold underline cursor-pointer hover:text-amber-900"
          >
            Coba Sinkronkan Lagi
          </button>
        </div>
      )}

      {/* Project Cards Grid (SKPL-F-05) */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <MatchProjectCard
              key={project.id}
              project={project}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/80 rounded-3xl border border-slate-200 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-bold text-slate-800">Tidak ada proyek yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Coba turunkan batas minimum Match Score atau ubah kata kunci pencarian.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Semua Kategori');
              setSearchQuery('');
              setMinMatchScore(50);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 cursor-pointer"
          >
            Reset Seluruh Filter
          </button>
        </div>
      )}

      {/* Detail Drill-Down Modal (Modul 7 activeDrillDownProjectId) */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
