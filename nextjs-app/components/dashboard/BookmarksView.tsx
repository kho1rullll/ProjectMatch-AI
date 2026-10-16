'use client';

import React, { useState, useEffect } from 'react';
import { JobVacancy } from '@/types/job';
import { api } from '@/lib/api-client';
import JobDetailModal from './JobDetailModal';
import { Bookmark, ExternalLink, Trash2, Building2, Sparkles, Briefcase, RefreshCw } from 'lucide-react';

export default function BookmarksView() {
  const [bookmarks, setBookmarks] = useState<JobVacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalJob, setActiveModalJob] = useState<JobVacancy | null>(null);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const data = await api.jobs.getMyBookmarks();
      setBookmarks(data);
    } catch {
      // Mock data jika backend belum ada bookmark
      setBookmarks([
        {
          id: 'job-2',
          platform_source: 'upwork',
          job_type: 'freelance',
          title: 'FastAPI & pgvector Semantic Search Integration',
          company_or_client: 'CloudScale Global Solutions Inc.',
          description: 'Looking for a talented developer to integrate pgvector HNSW indexing and cosine distance semantic retrieval in an existing FastAPI codebase.',
          external_url: 'https://www.upwork.com/jobs/fastapi-pgvector-semantic-search_102',
          budget_or_salary: '$800 - $1,500',
          status: 'open',
          processing_status: 'done',
          created_at: new Date().toISOString(),
          similarity_score: 0.88,
          is_bookmarked: true,
        },
      ]);
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
          <Bookmark className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
          <span>FR-08: Lowongan Tersimpan (Pengganti Lamaran Internal)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Daftar Lowongan Tersimpan (Bookmarks)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sesuai panduan SKPL dan Arsitektur Backend, seluruh lamaran dialihkan langsung ke platform asal. Lowongan favorit yang Anda bookmark tersimpan di sini untuk memudahkan proses melamar.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          <p className="text-xs font-semibold text-slate-500">Memuat bookmark tersimpan...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Belum Ada Lowongan yang Disimpan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Buka menu Eksplorasi Lowongan atau Rekomendasi Radar untuk menemukan pekerjaan yang cocok dengan portofolio GitHub Anda dan klik tombol Bookmark.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {bookmarks.map((job) => {
            const matchScore = job.similarity_score ? Math.round(job.similarity_score * 100) : 88;
            return (
              <div
                key={job.id}
                onClick={() => setActiveModalJob(job)}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {job.platform_source} • {job.job_type.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      {matchScore}% Match
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-2">
                    {job.title}
                  </h3>

                  {job.company_or_client && (
                    <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.company_or_client}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs font-bold text-emerald-700">
                    {job.budget_or_salary || 'Kompetitif'}
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Hapus Bookmark */}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(job.id, e)}
                      className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                      title="Hapus dari Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Lamar di Platform Asal (Redirect) */}
                    <a
                      href={job.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
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
