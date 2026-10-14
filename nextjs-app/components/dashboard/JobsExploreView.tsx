'use client';

import React, { useState, useEffect } from 'react';
import { JobVacancy } from '@/types/job';
import { api } from '@/lib/api-client';
import JobDetailModal from './JobDetailModal';
import { Search, Filter, ExternalLink, Bookmark, Sparkles, Building2, Briefcase, RefreshCw } from 'lucide-react';

export default function JobsExploreView() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('semua');
  const [selectedType, setSelectedType] = useState('semua');
  const [activeModalJob, setActiveModalJob] = useState<JobVacancy | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await api.jobs.getJobs({
        platform: selectedPlatform !== 'semua' ? selectedPlatform : undefined,
        job_type: selectedType !== 'semua' ? selectedType : undefined,
      });
      setJobs(data);
    } catch {
      // Mock fallback lowongan multi-platform
      setJobs([
        {
          id: 'job-1',
          platform_source: 'linkedin',
          job_type: 'part_time',
          title: 'Junior AI & Python Backend Engineer (Part-Time)',
          company_or_client: 'BioInformatika Nusantara & RS Cipto',
          description: 'Membangun endpoint REST API berbasis FastAPI dan pipeline embedding Sentence Transformers untuk klasifikasi data riil medis. Membutuhkan penguasaan Python, PostgreSQL, dan integrasi LLM.',
          external_url: 'https://www.linkedin.com/jobs/view/bioinformatika-ai-backend-2026',
          budget_or_salary: 'Rp 6.000.000 / bulan',
          status: 'open',
          processing_status: 'done',
          created_at: new Date().toISOString(),
          similarity_score: 0.92,
          is_bookmarked: false,
        },
        {
          id: 'job-2',
          platform_source: 'upwork',
          job_type: 'freelance',
          title: 'FastAPI & pgvector Semantic Search Integration',
          company_or_client: 'CloudScale Global Solutions Inc.',
          description: 'Looking for a talented developer to integrate pgvector HNSW indexing and cosine distance semantic retrieval in an existing FastAPI codebase. High quality GitHub repos preferred.',
          external_url: 'https://www.upwork.com/jobs/fastapi-pgvector-semantic-search_102',
          budget_or_salary: '$800 - $1,500 (Fixed Price)',
          status: 'open',
          processing_status: 'done',
          created_at: new Date().toISOString(),
          similarity_score: 0.88,
          is_bookmarked: true,
        },
        {
          id: 'job-3',
          platform_source: 'fiverr',
          job_type: 'freelance',
          title: 'Fullstack Next.js 15 & Recharts Interactive Radar Dashboard',
          company_or_client: 'EduTech Creative Studio',
          description: 'Need a responsive Next.js frontend with modern Recharts radar visualization and WebSocket live notification alerts. Clean TypeScript code and Tailwind styling required.',
          external_url: 'https://www.fiverr.com/buyer-requests/nextjs-recharts-radar-dashboard-554',
          budget_or_salary: '$450 / Project',
          status: 'open',
          processing_status: 'done',
          created_at: new Date().toISOString(),
          similarity_score: 0.85,
          is_bookmarked: false,
        },
        {
          id: 'job-4',
          platform_source: 'linkedin',
          job_type: 'part_time',
          title: 'Frontend Developer Intern (React / Next.js)',
          company_or_client: 'PT Inovasi Digital Mahasiswa',
          description: 'Membantu pengembangan antarmuka dashboard pengguna, optimasi performa web, dan integrasi API RESTful dengan Next.js App Router.',
          external_url: 'https://www.linkedin.com/jobs/view/frontend-developer-intern-idm-2026',
          budget_or_salary: 'Rp 4.500.000 / bulan',
          status: 'open',
          processing_status: 'done',
          created_at: new Date().toISOString(),
          similarity_score: 0.81,
          is_bookmarked: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedPlatform, selectedType]);

  const handleBookmarkToggle = async (jobId: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (currentStatus) {
        await api.jobs.removeBookmark(jobId);
      } else {
        await api.jobs.bookmarkJob(jobId);
      }
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, is_bookmarked: !currentStatus } : j))
      );
    } catch {
      // Toggle optimis
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, is_bookmarked: !currentStatus } : j))
      );
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      j.title.toLowerCase().includes(q) ||
      (j.company_or_client || '').toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q);
    return matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Eksplorasi Lowongan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Eksplorasi Lowongan Freelance & Part-Time (FR-04, FR-08)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Agregasi multi-platform terpadu dari LinkedIn, Upwork, dan Fiverr. Diurutkan berdasarkan skor kecocokan semantik AI (Cosine Similarity).
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari posisi, kata kunci teknologi, atau perusahaan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="semua">Semua Platform</option>
              <option value="linkedin">LinkedIn</option>
              <option value="upwork">Upwork</option>
              <option value="fiverr">Fiverr</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="semua">Semua Tipe</option>
              <option value="freelance">Freelance</option>
              <option value="part_time">Part-Time</option>
            </select>

            <button
              onClick={fetchJobs}
              className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Refresh Lowongan"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Kartu Lowongan */}
      {isLoading ? (
        <div className="text-center py-12 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          <p className="text-xs font-semibold text-slate-500">Memuat agregasi lowongan pekerjaan...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">Tidak ada lowongan yang sesuai kriteria</h3>
          <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau reset filter platform.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredJobs.map((job) => {
            const matchScore = job.similarity_score ? Math.round(job.similarity_score * 100) : 85;
            const platformColor =
              job.platform_source === 'linkedin'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : job.platform_source === 'upwork'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-green-50 text-green-700 border-green-200';

            return (
              <div
                key={job.id}
                onClick={() => setActiveModalJob(job)}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Bar: Platform & Match Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${platformColor}`}>
                        {job.platform_source}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {job.job_type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>{matchScore}% Match</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {job.title}
                  </h3>

                  {job.company_or_client && (
                    <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.company_or_client}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs font-bold text-emerald-700">
                    {job.budget_or_salary || 'Kompetitif'}
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Tombol Bookmark */}
                    <button
                      type="button"
                      onClick={(e) => handleBookmarkToggle(job.id, Boolean(job.is_bookmarked), e)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        job.is_bookmarked
                          ? 'bg-amber-100 border-amber-300 text-amber-800'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                      title={job.is_bookmarked ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'}
                    >
                      <Bookmark className={`w-4 h-4 ${job.is_bookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                    </button>

                    {/* Tombol Lamar Redirect ke Platform Asal (FR-08) */}
                    <a
                      href={job.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>Lamar</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail & Radar Overlay */}
      {activeModalJob && (
        <JobDetailModal
          job={activeModalJob}
          onClose={() => setActiveModalJob(null)}
          onBookmarkToggle={(jobId, isBookmarked) => {
            setJobs((prev) =>
              prev.map((j) => (j.id === jobId ? { ...j, is_bookmarked: isBookmarked } : j))
            );
          }}
        />
      )}
    </div>
  );
}
