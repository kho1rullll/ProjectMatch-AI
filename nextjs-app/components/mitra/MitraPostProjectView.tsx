'use client';

import React from 'react';
import ProjectFormClient from '@/components/ProjectFormClient';

interface MitraPostProjectViewProps {
  onSuccessPost?: () => void;
}

export default function MitraPostProjectView({ onSuccessPost }: MitraPostProjectViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
          <span>Portal Rekrutmen Mitra Industri &amp; Laboratorium Riset</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
          Pasang Lowongan Riset &amp; Proyek Industri Baru
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          Publikasikan kebutuhan proyek industri, magang bersertifikat, atau capstone riset Anda. Data kualifikasi 5 dimensi keahlian akan dicocokkan otomatis secara matematis dengan algoritma Cosine Similarity terhadap mahasiswa kampus.
        </p>
      </div>

      <ProjectFormClient onSuccess={onSuccessPost} />
    </div>
  );
}
