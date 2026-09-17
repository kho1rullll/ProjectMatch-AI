'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

export default function PostProjectPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'AI & Machine Learning',
    workType: 'Hybrid (Jakarta)',
    duration: '3 Bulan',
    stipend: 'Rp 4.000.000 / bln',
    skills: 'Python, PyTorch, FastAPI',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          company: formData.company,
          category: formData.category,
          workType: formData.workType,
          duration: formData.duration,
          stipend: formData.stipend,
          skillsRequired: formData.skills,
          description: formData.description,
          reqAiml: formData.category.includes('AI') ? 95 : 60,
          reqFrontend: formData.category.includes('Frontend') ? 95 : 60,
          reqUiux: formData.category.includes('UI') ? 90 : 50,
          reqBackend: formData.category.includes('Backend') ? 95 : 65,
          reqArchitecture: 80,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      } else {
        setErrorMsg(data.error || 'Gagal menyimpan proyek');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const skillsList = formData.skills
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
          <span>Portal Rekrutmen Mitra Industri</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight">
          Pasang Lowongan Riset & Proyek Industri
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Publikasikan kebutuhan proyek riset atau lowongan magang industri Anda untuk dicocokkan otomatis dengan ribuan mahasiswa bertalenta tinggi. Data langsung tersimpan ke SQLite Database.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl space-y-6">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-xs">
                ✓
              </div>
              <h2 className="text-xl font-bold text-slate-900">Lowongan Berhasil Disimpan ke Database!</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Proyek telah masuk ke SQLite database (<code>projectmatch.db</code>) dan siap untuk pencocokan AI dengan mahasiswa.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      title: '',
                      company: '',
                      category: 'AI & Machine Learning',
                      workType: 'Hybrid (Jakarta)',
                      duration: '3 Bulan',
                      stipend: 'Rp 4.000.000 / bln',
                      skills: 'Python, PyTorch, FastAPI',
                      description: '',
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  Pasang Lowongan Lain
                </button>
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
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  ⚠️ {errorMsg}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
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
                  Keahlian & Teknologi Dibutuhkan (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Python, PyTorch, Docker, PostgreSQL"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Deskripsi Lengkap & Deliverables <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  placeholder="Jelaskan tujuan riset, tanggung jawab mahasiswa, dan hasil yang diharapkan..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-xs font-bold text-white btn-primary-shimmer shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan ke SQLite Database...</span>
                  </>
                ) : (
                  'Publikasikan Lowongan Proyek & Simpan ke Database'
                )}
              </button>
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

    </div>
  );
}
