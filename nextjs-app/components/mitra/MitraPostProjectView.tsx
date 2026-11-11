'use client';

import React from 'react';
import ProjectFormClient from '@/components/ProjectFormClient';

interface MitraPostProjectViewProps {
  onSuccessPost?: () => void;
}

export default function MitraPostProjectView({ onSuccessPost }: MitraPostProjectViewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-primary-container text-xs font-bold mb-2">
          <span>Portal Rekrutmen Mitra Industri &amp; Laboratorium Riset</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Pasang Lowongan Riset &amp; Proyek Industri Baru
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Publikasikan kebutuhan proyek industri, magang bersertifikat, atau capstone riset Anda. Data kualifikasi keahlian akan dicocokkan otomatis secara cerdas terhadap mahasiswa kampus.
        </p>
      </div>

      <ProjectFormClient onSuccess={onSuccessPost} />
    </div>
  );
}
