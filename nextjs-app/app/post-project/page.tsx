// app/post-project/page.tsx — Server Component Shell (Modul 6 RSC Architecture)
import React from 'react';
import type { Metadata } from 'next';
import ProjectFormClient from '@/components/ProjectFormClient';

export const metadata: Metadata = {
  title: 'Pasang Lowongan Riset & Proyek Industri | ProjectMatch AI',
  description:
    'Publikasikan kebutuhan proyek riset atau lowongan magang industri Anda untuk dicocokkan otomatis dengan ribuan mahasiswa bertalenta tinggi.',
};

export default function PostProjectPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header (Server Rendered Shell) */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
          <span>Portal Rekrutmen Mitra Industri</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight">
          Pasang Lowongan Riset &amp; Proyek Industri
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Publikasikan kebutuhan proyek riset atau lowongan magang industri Anda untuk dicocokkan otomatis dengan ribuan mahasiswa bertalenta tinggi. Data langsung tersimpan ke SQLite Database.
        </p>
      </div>

      {/* Interactive Client Leaf Component */}
      <ProjectFormClient />
    </div>
  );
}
