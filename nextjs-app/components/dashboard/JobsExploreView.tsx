'use client';

import React, { useState, useEffect } from 'react';
import { JobVacancy } from '@/types/job';
import { api } from '@/lib/api-client';
import { getValidExternalJobUrl, getPlatformBadgeStyle, getPlatformDisplayName } from '@/lib/job-utils';
import JobDetailModal from './JobDetailModal';
import { Search, Filter, ExternalLink, Bookmark, Sparkles, Building2, Briefcase, RefreshCw, AlertCircle } from 'lucide-react';

export default function JobsExploreView() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('semua');
  const [selectedType, setSelectedType] = useState('semua');
  const [activeModalJob, setActiveModalJob] = useState<JobVacancy | null>(null);

  const handleLiveRefresh = async () => {
    setIsSyncing(true);
    setFetchError(null);
    try {
      await api.jobs.refreshLiveJobs();
    } catch {
      // Tetap lanjutkan memuat daftar lowongan terbaru jika sync sementara sibuk
    } finally {
      await fetchJobs();
      setIsSyncing(false);
    }
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await api.jobs.getJobs({
        platform: selectedPlatform !== 'semua' ? selectedPlatform : undefined,
        job_type: selectedType !== 'semua' ? selectedType : undefined,
      });
      setJobs(data);
    } catch (err: any) {
      setJobs([]);
      setFetchError(err?.message || 'Gagal mengambil data lowongan riil dari server backend.');
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
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Eksplorasi Lowongan Freelance & Part-Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Agregasi multi-platform riil terpadu dari LinkedIn, Freelancer.com, Kalibrr, dan Remotive. Diurutkan berdasarkan skor kecocokan semantik AI.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari posisi, kata kunci teknologi, atau perusahaan..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 bg-slate-50/60 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
            />
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-3 rounded-full border border-slate-200 bg-slate-50/60 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-container"
            >
              <option value="semua">Semua Platform</option>
              <option value="linkedin">LinkedIn</option>
              <option value="freelancer">Freelancer.com</option>
              <option value="kalibrr">Kalibrr</option>
              <option value="remotive">Remotive</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-full border border-slate-200 bg-slate-50/60 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-container"
            >
              <option value="semua">Semua Tipe</option>
              <option value="freelance">Freelance</option>
              <option value="part_time">Part-Time</option>
            </select>

            <button
              onClick={handleLiveRefresh}
              disabled={isSyncing}
              className="p-3 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer disabled:opacity-60"
              title="Tarik Lowongan Riil Terbaru (LinkedIn, Freelancer.com, Kalibrr, Remotive)"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-primary-container' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-xs font-medium">
          {fetchError}
        </div>
      )}

      {/* Grid Kartu Lowongan */}
      {isLoading ? (
        <div className="text-center py-12 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary-container" />
          <p className="text-xs font-semibold text-slate-500">Memuat agregasi lowongan pekerjaan riil...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">Tidak ada lowongan yang sesuai kriteria</h3>
          <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian, reset filter platform, atau klik tombol muat ulang untuk menarik data terbaru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredJobs.map((job) => {
            const matchScore = job.similarity_score ? Math.round(job.similarity_score * 100) : 85;
            const platformColor = getPlatformBadgeStyle(job.platform_source);

            return (
              <div
                key={job.id}
                onClick={() => setActiveModalJob(job)}
                className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Bar: Platform & Match Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${platformColor}`}>
                        {getPlatformDisplayName(job.platform_source)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {job.job_type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-lime-900 border border-lime-300 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5 text-lime-600" />
                      <span>{matchScore}% Match</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-primary-container transition-colors line-clamp-2">
                    {job.title}
                  </h3>

                  {job.company_or_client && (
                    <p className="text-xs font-semibold text-slate-500 mt-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.company_or_client}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs font-extrabold text-slate-900">
                    {job.budget_or_salary || 'Kompetitif'}
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Tombol Bookmark */}
                    <button
                      type="button"
                      onClick={(e) => handleBookmarkToggle(job.id, Boolean(job.is_bookmarked), e)}
                      className={`p-2.5 rounded-full border transition-all cursor-pointer ${
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
                      href={getValidExternalJobUrl(job)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-5 py-2.5 rounded-full bg-primary-container hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/25"
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
