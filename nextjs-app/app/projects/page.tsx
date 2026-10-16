// app/projects/page.tsx — Server Component Shell (Modul 6 RSC Architecture)
import React from 'react';
import type { Metadata } from 'next';
import ProjectsCatalogClient from '@/components/ProjectsCatalogClient';

export const metadata: Metadata = {
  title: 'Eksplorasi Lowongan Riset & Proyek Industri | ProjectMatch AI',
  description:
    'Gunakan filter multi-kategori dan skor kemiripan AI (Cosine Similarity) untuk meninjau kualifikasi teknismu terhadap kebutuhan mitra.',
};

export default function ProjectsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Info (Server Rendered Shell) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <span>Semantic Match Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight">
            Eksplorasi Lowongan Riset &amp; Proyek Industri
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Gunakan filter multi-kategori dan skor kemiripan AI (Cosine Similarity) untuk meninjau kualifikasi teknismu terhadap kebutuhan mitra.
          </p>
        </div>
      </div>

      {/* Interactive Client Leaf Component */}
      <ProjectsCatalogClient />
    </div>
  );
}
