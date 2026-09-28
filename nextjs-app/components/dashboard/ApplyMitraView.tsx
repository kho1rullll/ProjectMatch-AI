'use client';

import React, { useState } from 'react';
import { ALL_PROJECTS, ProjectItem } from '@/lib/data';

interface ApplicationItem {
  id: string;
  projectTitle: string;
  companyName: string;
  matchScore: number;
  status: 'SUBMITTED' | 'REVIEWING' | 'ACCEPTED';
  appliedDate: string;
  notes: string;
}

export default function ApplyMitraView({
  initialSelectedProject,
}: {
  initialSelectedProject?: ProjectItem | null;
}) {
  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: 'app-001',
      projectTitle: 'Pengembangan Engine NLP Berbasis Transformer untuk Riset Medis',
      companyName: 'BioInformatika Nusantara & RS Cipto',
      matchScore: 94,
      status: 'REVIEWING',
      appliedDate: '2 hari lalu',
      notes: 'Berkas portofolio dan CV sedang ditinjau oleh tim teknis mitra.',
    },
    {
      id: 'app-002',
      projectTitle: 'Redesain Sistem Dashboard Telemetri IoT & Smart Campus',
      companyName: 'Pusat Riset Smart City ITB',
      matchScore: 88,
      status: 'ACCEPTED',
      appliedDate: '1 minggu lalu',
      notes: 'Selamat! Anda diterima untuk posisi magang riset.',
    },
    {
      id: 'app-003',
      projectTitle: 'Computer Vision untuk Deteksi Cacat Mutu Produk Manufaktur Otomotif',
      companyName: 'PT Rekayasa Industri Presisi',
      matchScore: 91,
      status: 'SUBMITTED',
      appliedDate: 'Kemarin',
      notes: 'Lamaran terkirim dan menunggu antrian review.',
    },
  ]);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(Boolean(initialSelectedProject));
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialSelectedProject?.id || ALL_PROJECTS[0]?.id || ''
  );
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const targetProject = ALL_PROJECTS.find((p) => p.id === selectedProjectId);
    if (!targetProject) {
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      const newApp: ApplicationItem = {
        id: `app-${Date.now().toString(36)}`,
        projectTitle: targetProject.title,
        companyName: targetProject.company,
        matchScore: targetProject.matchScore,
        status: 'SUBMITTED',
        appliedDate: 'Hari ini',
        notes: coverNote || 'Lamaran diajukan dengan portofolio terverifikasi.',
      };

      setApplications([newApp, ...applications]);
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      setCoverNote('');
      setSuccessMessage(`Berhasil mengajukan lamaran ke "${targetProject.title}".`);

      setTimeout(() => setSuccessMessage(null), 4000);
    }, 400);
  };

  const getStatusBadge = (status: ApplicationItem['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Diterima
          </span>
        );
      case 'REVIEWING':
        return (
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Sedang Ditinjau
          </span>
        );
      case 'SUBMITTED':
      default:
        return (
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            Terkirim
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Status Lamaran Proyek
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau perkembangan proses lamaran proyek mitra industri Anda di sini.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsApplyModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer w-fit"
        >
          + Ajukan Lamaran Baru
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span>✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Application List */}
      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{app.appliedDate}</span>
                  <span>•</span>
                  <span className="font-semibold text-blue-600">{app.matchScore}% Match</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {app.projectTitle}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  🏢 {app.companyName}
                </p>
              </div>

              <div className="shrink-0">
                {getStatusBadge(app.status)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Catatan: </span>
              <span>{app.notes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Ajukan Lamaran ke Mitra
              </h3>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Pilih Proyek Mitra</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ALL_PROJECTS.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title} ({proj.company})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Pesan Pengantar (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Tuliskan pengalaman atau motivasi Anda..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Lamaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
