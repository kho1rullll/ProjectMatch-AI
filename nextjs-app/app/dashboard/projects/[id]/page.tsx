// app/dashboard/projects/[id]/page.tsx — Dynamic Route Server Component (Modul 6)
// Menampilkan detail proyek terintegrasi di dalam segmen dashboard dengan dynamic generateMetadata() untuk SEO
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProjects, getProjectById } from '@/lib/db';
import { ALL_PROJECTS } from '@/lib/data';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id) || ALL_PROJECTS.find((p) => p.id === id);

  if (!project) {
    return {
      title: 'Proyek Tidak Ditemukan — ProjectMatch AI',
    };
  }

  return {
    title: `${project.title} — ${project.company} | ProjectMatch AI`,
    description: project.description.slice(0, 160),
  };
}

export default async function DashboardProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = getProjectById(id) || ALL_PROJECTS.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const skills = Array.isArray(project.skillsRequired)
    ? project.skillsRequired
    : (project.skillsRequired as string).split(',').map((s) => s.trim());

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600"
        >
          <span>← Kembali ke Dashboard Hero</span>
        </Link>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          🎯 {project.matchScore}% Match Rate (Cosine Similarity)
        </span>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-blue-100 shadow-xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            {project.category}
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

        <div className="border-t border-slate-100 pt-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Deskripsi Pekerjaan
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Kualifikasi Keahlian
          </h3>
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
      </div>
    </div>
  );
}
