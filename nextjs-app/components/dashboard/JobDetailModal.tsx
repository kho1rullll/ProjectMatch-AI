'use client';

import React, { useState, useEffect } from 'react';
import { JobVacancy } from '@/types/job';
import { api } from '@/lib/api-client';
import CompetencyRadarChart from './CompetencyRadarChart';
import { ExternalLink, Bookmark, Check, X, Building2, Briefcase, DollarSign, Sparkles } from 'lucide-react';

interface JobDetailModalProps {
  job: JobVacancy | null;
  onClose: () => void;
  onBookmarkToggle?: (jobId: string, isBookmarked: boolean) => void;
}

export default function JobDetailModal({
  job,
  onClose,
  onBookmarkToggle,
}: JobDetailModalProps) {
  const [matchDetail, setMatchDetail] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(job?.is_bookmarked ?? false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    if (job) {
      setIsBookmarked(job.is_bookmarked ?? false);
      api.matching.getMatchDetail(job.id)
        .then((data) => setMatchDetail(data))
        .catch(() => {});
    }
  }, [job]);

  if (!job) return null;

  const handleToggleBookmark = async () => {
    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        await api.jobs.removeBookmark(job.id);
        setIsBookmarked(false);
        onBookmarkToggle?.(job.id, false);
      } else {
        await api.jobs.bookmarkJob(job.id);
        setIsBookmarked(true);
        onBookmarkToggle?.(job.id, true);
      }
    } catch {
      // Toggle optimis
      setIsBookmarked(!isBookmarked);
      onBookmarkToggle?.(job.id, !isBookmarked);
    } finally {
      setIsBookmarking(false);
    }
  };

  const platformBadgeColor =
    job.platform_source === 'linkedin'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : job.platform_source === 'upwork'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-green-100 text-green-800 border-green-200';

  const matchPct = matchDetail?.match_percentage || (job.similarity_score ? Math.round(job.similarity_score * 100) : 85);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/80 shadow-[0_25px_60px_rgba(15,23,42,0.15)] relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${platformBadgeColor}`}>
              {job.platform_source}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
              {job.job_type.replace('_', ' ')}
            </span>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 border border-lime-300 text-lime-900 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-lime-600" />
              <span>AI Match: {matchPct}%</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {job.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm text-slate-600 font-medium">
            {job.company_or_client && (
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                {job.company_or_client}
              </span>
            )}
            {job.budget_or_salary && (
              <span className="flex items-center gap-1.5 text-slate-900 font-extrabold">
                <DollarSign className="w-4 h-4 text-primary-container" />
                {job.budget_or_salary}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              Status: <span className="font-bold text-slate-900 uppercase text-xs">{job.status}</span>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Radar Chart Overlay & Drill-Down (FR-07) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Visualisasi Radar Overlay
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Kesesuaian Portofolio vs Syarat Lowongan
              </span>
            </div>

            <CompetencyRadarChart
              comparisonTitle={`Syarat ${job.title.slice(0, 20)}...`}
              comparisonData={job.extracted_skills?.radar_requirements}
              scoreBreakdown={matchDetail?.score_breakdown}
            />
          </div>

          {/* Section 2: Deskripsi Lowongan & Kualifikasi */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Deskripsi Lengkap Lowongan
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/70 p-5 rounded-3xl border border-slate-100">
                {job.description}
              </p>
            </div>

            <div className="md:col-span-4 space-y-4">
              <div className="p-5 bg-purple-50/70 border border-purple-200/60 rounded-3xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary-container flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ringkasan AI Match
                </h4>
                <p className="text-xs text-purple-900 leading-relaxed font-medium">
                  {matchDetail?.summary_reason ||
                    `Kemiripan semantik ${matchPct}% menunjukkan kesesuaian kuat repositori GitHub Anda dengan kebutuhan proyek ini.`}
                </p>
                {job.extracted_skills?.estimated_duration && (
                  <div className="pt-2 border-t border-purple-200/60 text-xs">
                    <span className="text-slate-500 block text-[10px]">Estimasi Durasi:</span>
                    <span className="font-bold text-slate-900">{job.extracted_skills.estimated_duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/70 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleToggleBookmark}
            disabled={isBookmarking}
            className={`w-full sm:w-auto px-5 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              isBookmarked
                ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
            <span>{isBookmarked ? 'Tersimpan di Bookmark' : 'Simpan ke Bookmark'}</span>
          </button>

          <a
            href={job.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary-container hover:bg-primary-hover text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-500/25 cursor-pointer group"
          >
            <span>Lamar di {job.platform_source.toUpperCase()}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
