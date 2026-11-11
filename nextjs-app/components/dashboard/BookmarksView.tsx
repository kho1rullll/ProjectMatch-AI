'use client';

import React, { useState, useEffect } from 'react';
import { JobVacancy } from '@/types/job';
import { api } from '@/lib/api-client';
import { getValidExternalJobUrl, getPlatformDisplayName, getPlatformBadgeStyle } from '@/lib/job-utils';
import JobDetailModal from './JobDetailModal';
import { Bookmark, ExternalLink, Trash2, Building2, Sparkles, Briefcase, RefreshCw } from 'lucide-react';

export default function BookmarksView() {
  const [bookmarks, setBookmarks] = useState<JobVacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeModalJob, setActiveModalJob] = useState<JobVacancy | null>(null);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await api.jobs.getMyBookmarks();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch {
      setBookmarks([]);
      setFetchError('Gagal memuat daftar lowongan tersimpan dari server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.jobs.removeBookmark(jobId);
      setBookmarks((prev) => prev.filter((j) => j.id !== jobId));
    } catch {
      setBookmarks((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-primary-container text-xs font-bold mb-3 border border-purple-200">
          <Bookmark className="w-3.5 h-3.5 fill-purple-600 text-primary-container" />
          <span>Lowongan Tersimpan</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Daftar Lowongan Tersimpan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Seluruh lamaran dialihkan langsung ke platform asal. Lowongan favorit yang Anda simpan akan muncul di sini untuk memudahkan proses melamar.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary-container" />
          <p className="text-xs font-semibold text-slate-500">Memuat bookmark tersimpan...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">
            {fetchError ? 'Gagal Memuat Bookmark' : 'Belum Ada Lowongan yang Disimpan'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {fetchError
              ? fetchError
              : 'Buka menu Eksplorasi Lowongan atau Rekomendasi Radar untuk menemukan pekerjaan riil yang cocok dengan portofolio GitHub Anda dan klik tombol Bookmark.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {bookmarks.map((job) => {
            const matchScore = job.similarity_score ? Math.round(job.similarity_score * 100) : 88;
            return (
              <div
                key={job.id}
                onClick={() => setActiveModalJob(job)}
                className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPlatformBadgeStyle(job.platform_source)}`}>
                        {getPlatformDisplayName(job.platform_source)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {job.job_type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-black text-lime-900 bg-lime-100 border border-lime-300 px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-lime-600" />
                      {matchScore}% Match
                    </span>
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

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs font-extrabold text-slate-900">
                    {job.budget_or_salary || 'Kompetitif'}
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Hapus Bookmark */}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(job.id, e)}
                      className="p-2.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                      title="Hapus dari Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Lamar di Platform Asal (Redirect) */}
                    <a
                      href={getValidExternalJobUrl(job)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full bg-primary-container hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/25"
                    >
                      <span>Lamar di {job.platform_source.toUpperCase()}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail Overlay */}
      {activeModalJob && (
        <JobDetailModal
          job={activeModalJob}
          onClose={() => setActiveModalJob(null)}
          onBookmarkToggle={(jobId, isBookmarked) => {
            if (!isBookmarked) {
              setBookmarks((prev) => prev.filter((j) => j.id !== jobId));
            }
          }}
        />
      )}
    </div>
  );
}
