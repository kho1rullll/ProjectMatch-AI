import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_PROJECTS } from '@/lib/data';
import { getProjectById, getAllProjects } from '@/lib/db';

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
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
              {project.category}
            </span>
            <div className="px-4 py-1.5 rounded-full text-xs font-black badge-match-high">
              🎯 {project.matchScore}% Kecocokan AI
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
            <span className="font-bold text-slate-900">🏢 {project.company}</span>
            <span>📍 {project.workType}</span>
            <span>⏱️ Durasi: {project.duration}</span>
            <span className="font-bold text-blue-600">💰 {project.stipend}</span>
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Deskripsi Pekerjaan & Ruang Lingkup
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Skill Requirements */}
        <div className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tech Stack & Kualifikasi yang Dibutuhkan
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

        {/* AI Breakdown Matrix */}
        <div className="space-y-4 border-t border-slate-100 pt-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <span>📊 Analisis Kualifikasi Berdasarkan Vektor Portofoliomu</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>AI / Machine Learning</span>
                <span className="font-bold text-slate-900">{breakdown.aiml}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${breakdown.aiml}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Backend & Architecture</span>
                <span className="font-bold text-slate-900">{breakdown.backend}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${breakdown.backend}%` }} />
              </div>
            </div>
          </div>
        </div>

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
