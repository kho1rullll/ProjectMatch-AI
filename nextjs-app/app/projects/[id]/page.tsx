import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_PROJECTS } from '@/lib/data';
import { getProjectById, getAllProjects } from '@/lib/db';
import ProjectDetailHeader from '@/components/project-detail/ProjectDetailHeader';
import ProjectDetailRequirements from '@/components/project-detail/ProjectDetailRequirements';
import ProjectAiBreakdown from '@/components/project-detail/ProjectAiBreakdown';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const seedList = ALL_PROJECTS.map((p) => ({ id: p.id }));
  try {
    const dbList = getAllProjects().map((p) => ({ id: p.id }));
    const merged = [...seedList];
    dbList.forEach((p) => {
      if (!merged.some((m) => m.id === p.id)) {
        merged.push(p);
      }
    });
    return merged;
  } catch {
    return seedList;
  }
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id) || ALL_PROJECTS.find((p) => p.id === id);
  if (!project) {
    return {
      title: 'Proyek Tidak Ditemukan | ProjectMatch AI',
    };
  }
  return {
    title: `${project.title} | ProjectMatch AI`,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id) || ALL_PROJECTS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const breakdown = project.requirementsBreakdown || {
    aiml: 85,
    backend: 80,
    frontend: 70,
    uiux: 65,
    architecture: 75,
  };

  const skills = Array.isArray(project.skillsRequired)
    ? project.skillsRequired
    : (project.skillsRequired as string).split(',').map((s) => s.trim());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <span>← Kembali ke Eksplorasi Proyek</span>
      </Link>

      {/* Main Detail Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-blue-100 shadow-xl space-y-8">
        
        {/* Header (Extracted Server Component) */}
        <ProjectDetailHeader
          category={project.category}
          matchScore={project.matchScore}
          title={project.title}
          company={project.company}
          workType={project.workType}
          duration={project.duration}
          stipend={project.stipend}
        />

        {/* Overview & Skill Requirements (Extracted Server Component) */}
        <ProjectDetailRequirements
          description={project.description}
          skills={skills}
        />

        {/* AI Breakdown Matrix (Extracted Server Component) */}
        <ProjectAiBreakdown breakdown={breakdown} />

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Diposting {project.postedAt} • Mitra Riset Terverifikasi
          </p>
          <button
            type="button"
            className="px-6 py-3 rounded-xl text-xs font-bold text-white btn-primary-shimmer shadow-lg hover:opacity-95 transition-all cursor-pointer"
          >
            Kirim Portofolio Hero Sekarang
          </button>
        </div>

      </div>
    </div>
  );
}
