// app/projects/page.tsx — Server Component Shell (Modul 6 RSC Architecture)
import React from 'react';
import type { Metadata } from 'next';
import ProjectsCatalogClient from '@/components/ProjectsCatalogClient';

export const metadata: Metadata = {
  title: 'Eksplorasi Lowongan Riset & Proyek Industri | ProjectMatch AI',
  description:
    'Gunakan filter multi-kategori dan skor kemiripan AI untuk meninjau kualifikasi teknismu terhadap kebutuhan mitra.',
};

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative">
      {/* Subtle ambient light aura */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 bg-primary-light/50 rounded-full blur-3xl opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute top-40 -right-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl opacity-40" aria-hidden="true" />

      {/* Header Info (Server Rendered Shell) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-light/70 border border-primary/20 text-primary text-xs font-bold mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            <span className="uppercase tracking-wider">Semantic Match Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-heading font-display tracking-tight">
            Eksplorasi Lowongan Riset &amp; Proyek Industri
          </h1>
          <p className="text-sm sm:text-base text-text-body mt-2 max-w-2xl leading-relaxed">
            Gunakan filter multi-kategori dan skor kemiripan AI untuk meninjau kualifikasi teknismu terhadap kebutuhan mitra secara presisi.
          </p>
        </div>
      </div>

      {/* Interactive Client Leaf Component */}
      <ProjectsCatalogClient />
    </div>
  );
}
