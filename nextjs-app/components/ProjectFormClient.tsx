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
      <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl space-y-6">
        {submissionState.status === 'success' ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-xs font-bold">
              ✓
            </div>
            <h2 className="text-xl font-bold text-slate-900">Lowongan Berhasil Disimpan ke Database!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Proyek <strong>&quot;{submissionState.data.title}&quot;</strong> (ID: <code>{submissionState.data.id}</code>) telah masuk ke SQLite database (<code>projectmatch.db</code>) dan siap untuk pencocokan AI dengan mahasiswa.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
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
              >
                Pasang Lowongan Lain
              </Button>
              <Link
                href="/projects"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Lihat di Katalog Proyek
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {submissionState.status === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                ⚠️ {submissionState.errorMessage}
              </div>
            )}

            {/* Judul Proyek */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Judul Proyek / Posisi Riset <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Contoh: Implementasi Transformer untuk Rekam Medis"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                  errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.title && <p className="text-[11px] text-rose-600 font-semibold">{errors.title}</p>}
            </div>

            {/* Perusahaan / Lab & Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nama Mitra / Lembaga <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  placeholder="Contoh: PT Riset Digital Nusantara"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                    errors.company ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.company && <p className="text-[11px] text-rose-600 font-semibold">{errors.company}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Bidang / Kategori Proyek
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                <label className="text-xs font-bold text-slate-700">Model Kerja</label>
                <input
                  type="text"
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Durasi</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Insentif / Stipend</label>
                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Kebutuhan Skill Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Keahlian &amp; Teknologi Dibutuhkan (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                placeholder="Python, PyTorch, Docker, PostgreSQL"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              {errors.skillsRequired && <p className="text-[11px] text-rose-600 font-semibold">{errors.skillsRequired}</p>}
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Deskripsi Lengkap &amp; Deliverables <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                required
                placeholder="Jelaskan tujuan riset, tanggung jawab mahasiswa, dan hasil yang diharapkan..."
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                  errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.description && <p className="text-[11px] text-rose-600 font-semibold">{errors.description}</p>}
            </div>

            {/* Submit Button using CVA Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={createMutation.isPending || submissionState.status === 'loading'}
              className="w-full py-3.5 btn-primary-shimmer shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {createMutation.isPending || submissionState.status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan ke SQLite Database...</span>
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            👁️ Pratinjau Tampilan untuk Mahasiswa
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Live Preview
          </span>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-blue-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {formData.category}
            </span>
            <span className="badge-match-high px-3 py-1 rounded-full text-xs font-black">
              92% Est. Match
            </span>
          </div>

          <h4 className="font-bold text-base text-slate-900 font-display leading-snug">
            {formData.title || 'Judul Proyek Riset Industri'}
          </h4>

          <p className="text-xs font-medium text-slate-600">
            🏢 {formData.company || 'Nama Perusahaan / Laboratorium'}
          </p>

          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
            {formData.description ||
              'Deskripsi proyek akan tampil di sini secara real-time saat Anda mengetik di formulir samping.'}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {skillsList.length > 0 ? (
              skillsList.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">Belum ada skill yang ditambahkan</span>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Stipend</span>
              <span className="font-bold text-slate-800">{formData.stipend}</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {formData.workType} • {formData.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
