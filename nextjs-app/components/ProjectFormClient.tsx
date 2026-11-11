'use client';

// components/ProjectFormClient.tsx — Client Leaf Component ("use client") (Modul 6)
// Menangani interaktivitas event form & validasi skema Zod di browser (SKPL-F-09, SKPL-F-10)
import React, { useState } from 'react';
import Link from 'next/link';
import { CreateProjectSchema, CreateProjectInput, AsyncState, ProjectId, toProjectId } from '@/types/project';
import { useCreateProjectMutation } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';

interface Props {
  onSuccess?: () => void;
}

export default function ProjectFormClient({ onSuccess }: Props) {
  const [formData, setFormData] = useState<CreateProjectInput>({
    title: '',
    company: '',
    category: 'AI & Machine Learning',
    workType: 'Hybrid (Jakarta)',
    duration: '3 Bulan',
    stipend: 'Rp 4.000.000 / bln',
    skillsRequired: 'Python, PyTorch, FastAPI',
    description: '',
    reqAiml: 90,
    reqFrontend: 60,
    reqUiux: 50,
    reqBackend: 85,
    reqArchitecture: 75,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionState, setSubmissionState] = useState<AsyncState<{ id: ProjectId; title: string }>>({
    status: 'idle',
  });

  const createMutation = useCreateProjectMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validasi Zod (SKPL-F-10: Judul min. 8 karakter dsb)
    const result = CreateProjectSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmissionState({ status: 'loading' });

    createMutation.mutate(result.data, {
      onSuccess: (savedProject) => {
        setSubmissionState({
          status: 'success',
          data: {
            id: toProjectId(savedProject.id),
            title: savedProject.title,
          },
        });
        if (onSuccess) onSuccess();
      },
      onError: (err) => {
        setSubmissionState({
          status: 'error',
          errorMessage: err.message || 'Gagal mempublikasikan proyek.',
        });
      },
    });
  };

  const skillsList = (formData.skillsRequired || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Column */}
      <div className="lg:col-span-7 bg-surface-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-border-light shadow-[0_20px_50px_rgba(15,23,42,0.08)] space-y-6">
        {submissionState.status === 'success' ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary-fixed text-surface-dark flex items-center justify-center text-2xl mx-auto shadow-sm font-bold">
              ✓
            </div>
            <h2 className="text-xl font-headline-md font-extrabold text-text-heading">Lowongan Berhasil Disimpan ke Database!</h2>
            <p className="text-xs text-text-body max-w-md mx-auto leading-relaxed">
              Proyek <strong>&quot;{submissionState.data.title}&quot;</strong> (ID: <code className="bg-surface-container-high px-2 py-0.5 rounded font-mono text-primary">{submissionState.data.id}</code>) telah masuk ke database dan siap untuk pencocokan AI dengan mahasiswa.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setSubmissionState({ status: 'idle' });
                  setFormData({
                    title: '',
                    company: '',
                    category: 'AI & Machine Learning',
                    workType: 'Hybrid (Jakarta)',
                    duration: '3 Bulan',
                    stipend: 'Rp 4.000.000 / bln',
                    skillsRequired: 'Python, PyTorch, FastAPI',
                    description: '',
                    reqAiml: 90,
                    reqFrontend: 60,
                    reqUiux: 50,
                    reqBackend: 85,
                    reqArchitecture: 75,
                  });
                }}
                className="rounded-full font-bold"
              >
                Pasang Lowongan Lain
              </Button>
              <Link
                href="/projects"
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-primary-container hover:bg-primary-hover shadow-md shadow-purple-500/20 transition-all"
              >
                Lihat di Katalog Proyek
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {submissionState.status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium">
                ⚠️ {submissionState.errorMessage}
              </div>
            )}

            {/* Judul Proyek */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-heading">
                Judul Proyek / Posisi Riset <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Contoh: Implementasi Transformer untuk Rekam Medis"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-2xl bg-surface-container-low/60 border text-xs text-text-heading focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container focus:bg-white transition-all ${
                  errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-border-light'
                }`}
              />
              {errors.title && <p className="text-[11px] text-rose-600 font-semibold">{errors.title}</p>}
            </div>

            {/* Perusahaan / Lab & Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-heading">
                  Nama Mitra / Lembaga <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="Contoh: PT Riset Digital Nusantara"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-2xl bg-surface-container-low/60 border text-xs text-text-heading focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container focus:bg-white transition-all ${
                    errors.company ? 'border-rose-400 bg-rose-50/30' : 'border-border-light'
                  }`}
                />
                {errors.company && <p className="text-[11px] text-rose-600 font-semibold">{errors.company}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-heading">
                  Bidang / Kategori Proyek
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low/60 border border-border-light text-xs text-text-heading focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container focus:bg-white transition-all"
                >
                  <option>AI & Machine Learning</option>
                  <option>Frontend & UI/UX</option>
                  <option>Backend & Cloud</option>
                  <option>Fullstack Web</option>
                  <option>Blockchain & Web3</option>
                </select>
              </div>
            </div>

            {/* Tipe Kerja, Durasi, Stipend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-heading">Model Kerja</label>
                <input
                  type="text"
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low/60 border border-border-light text-xs text-text-heading focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-heading">Durasi</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low/60 border border-border-light text-xs text-text-heading focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-heading">Insentif / Stipend</label>
                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low/60 border border-border-light text-xs text-text-heading focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Kebutuhan Skill Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-heading">
                Keahlian &amp; Teknologi Dibutuhkan (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                placeholder="Python, PyTorch, Docker, PostgreSQL"
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-container-low/60 border border-border-light text-xs text-text-heading focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container focus:bg-white transition-all"
              />
              {errors.skillsRequired && <p className="text-[11px] text-rose-600 font-semibold">{errors.skillsRequired}</p>}
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-heading">
                Deskripsi Lengkap &amp; Deliverables <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Jelaskan tujuan riset, tanggung jawab mahasiswa, dan hasil yang diharapkan..."
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-2xl bg-surface-container-low/60 border text-xs text-text-heading focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container focus:bg-white transition-all ${
                  errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-border-light'
                }`}
              />
              {errors.description && <p className="text-[11px] text-rose-600 font-semibold">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={createMutation.isPending || submissionState.status === 'loading'}
              className="w-full py-4 rounded-full shadow-lg shadow-purple-500/25 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {createMutation.isPending || submissionState.status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                'Publikasikan Lowongan Proyek & Simpan ke Database'
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Live Preview Column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            👁️ Pratinjau Tampilan untuk Mahasiswa
          </h3>
          <span className="text-[10px] font-bold text-surface-dark bg-secondary-fixed/40 px-2.5 py-0.5 rounded-full border border-secondary-fixed flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Live Preview
          </span>
        </div>

        <div className="bg-surface-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-border-light shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-primary bg-primary-light/70 px-3 py-1 rounded-full border border-primary/20">
              {formData.category}
            </span>
            <span className="bg-secondary-fixed/30 text-surface-dark border border-secondary-fixed px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              92% Semantic Match
            </span>
          </div>

          <h4 className="font-bold text-base text-text-heading font-display leading-snug">
            {formData.title || 'Judul Proyek Riset Industri'}
          </h4>

          <p className="text-xs font-semibold text-text-body">
            🏢 {formData.company || 'Nama Perusahaan / Laboratorium'}
          </p>

          <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
            {formData.description ||
              'Deskripsi proyek akan tampil di sini secara real-time saat Anda mengetik di formulir samping.'}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {skillsList.length > 0 ? (
              skillsList.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold text-on-surface bg-surface-container-high px-2.5 py-1 rounded-full flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[12px] text-secondary">check_circle</span>
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-text-muted">Belum ada skill yang ditambahkan</span>
            )}
          </div>

          <div className="pt-4 border-t border-border-light flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-text-muted block font-bold uppercase tracking-wider">Stipend</span>
              <span className="font-extrabold text-text-heading">{formData.stipend}</span>
            </div>
            <span className="text-[11px] text-text-body font-medium">
              {formData.workType} • {formData.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
