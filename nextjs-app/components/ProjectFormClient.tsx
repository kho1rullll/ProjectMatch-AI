'use client';

// components/ProjectFormClient.tsx — Client Leaf Component ("use client") (Modul 6)
// Menangani interaktivitas event form & validasi skema Zod di browser (SKPL-F-09, SKPL-F-10)
import React, { useState } from 'react';
import { CreateProjectSchema, CreateProjectInput } from '@/types/project';
import { useCreateProjectMutation } from '@/hooks/useProjects';

interface Props {
  onSuccess?: () => void;
}

export default function ProjectFormClient({ onSuccess }: Props) {
  const [formData, setFormData] = useState<CreateProjectInput>({
    title: '',
    company: 'BioInformatika Nusantara & RS Cipto',
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
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

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

    createMutation.mutate(result.data, {
      onSuccess: () => {
        setSubmittedSuccess(true);
        if (onSuccess) onSuccess();
      },
    });
  };

  if (submittedSuccess) {
    return (
      <div className="text-center py-10 space-y-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-xs font-bold">
          ✓
        </div>
        <h3 className="text-lg font-black text-slate-900">Lowongan Berhasil Dipublikasikan!</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Data tersimpan ke database dan cache TanStack Query telah di-invalidate secara real-time. Proyek sudah dapat dilihat oleh mahasiswa.
        </p>
        <button
          type="button"
          onClick={() => setSubmittedSuccess(false)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          + Pasang Lowongan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs">
      <div className="space-y-1">
        <label className="font-bold text-slate-700">
          Judul Proyek / Lowongan Riset <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Contoh: Pengembangan Pipeline NLP Transformer Medis"
          className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white ${
            errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
          }`}
        />
        {errors.title && <p className="text-[11px] text-rose-600 font-semibold">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="font-bold text-slate-700">
            Nama Mitra / Perusahaan <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.company ? 'border-rose-400' : 'border-slate-200'
            }`}
          />
          {errors.company && <p className="text-[11px] text-rose-600 font-semibold">{errors.company}</p>}
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-700">Kategori Bidang</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>AI & Machine Learning</option>
            <option>Frontend & UI/UX</option>
            <option>Backend & Cloud</option>
            <option>Fullstack Web</option>
            <option>Blockchain & Web3</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Tipe Kerja</label>
          <input
            type="text"
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Durasi</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Uang Saku / Honor</label>
          <input
            type="text"
            name="stipend"
            value={formData.stipend}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-bold text-slate-700">
          Kebutuhan Keahlian (Pisahkan dengan koma)
        </label>
        <input
          type="text"
          name="skillsRequired"
          value={formData.skillsRequired}
          onChange={handleChange}
          placeholder="Python, PyTorch, Docker, FastAPI"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
        />
      </div>

      <div className="space-y-1">
        <label className="font-bold text-slate-700">
          Deskripsi Pekerjaan & Kualifikasi <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Jelaskan ruang lingkup proyek, target capaian, dan peran mahasiswa..."
          className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
          }`}
        />
        {errors.description && (
          <p className="text-[11px] text-rose-600 font-semibold">{errors.description}</p>
        )}
      </div>

      {createMutation.isError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          Error: {createMutation.error.message}
        </div>
      )}

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full py-3.5 rounded-xl font-bold text-white btn-primary-shimmer shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        {createMutation.isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Memvalidasi & Menyimpan ke Database...</span>
          </>
        ) : (
          'Publikasikan Lowongan Proyek Sekarang'
        )}
      </button>
    </form>
  );
}
