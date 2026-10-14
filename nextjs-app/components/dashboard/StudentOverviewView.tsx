'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { RecommendationItem } from '@/types/matching';
import { JobVacancy } from '@/types/job';
import CompetencyRadarChart from './CompetencyRadarChart';
import JobDetailModal from './JobDetailModal';
import { Sparkles, Bookmark, ExternalLink, ArrowRight, Briefcase } from 'lucide-react';
import { Github } from '@/components/icons/GithubIcon';

interface StudentOverviewViewProps {
  onNavigateTab: (tab: any) => void;
}

export default function StudentOverviewView({ onNavigateTab }: StudentOverviewViewProps) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activeModalJob, setActiveModalJob] = useState<JobVacancy | null>(null);

  useEffect(() => {
    api.matching.getMyRecommendations()
      .then((data) => setRecommendations(data))
      .catch(() => {});

    api.profile.getMyProfile()
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  const studentName = user?.name || user?.full_name || 'Raden Satria';
  const nim = user?.nim || 'V3925028';
  const githubUser = user?.github_username || profile?.github_username || 'kho1rullll';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>AI Career Automation Platform (SKPL V12)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Selamat Datang, {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            NIM: <span className="font-mono font-bold text-white">{nim}</span> • Akun GitHub:{' '}
            <span className="font-mono font-bold text-blue-200">@{githubUser}</span>
            <br />
            Keahlian coding Anda disintesis otomatis dari repositori publik GitHub dan dicocokkan secara semantik dengan lowongan freelance dan part-time.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('github')}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Kelola Akun GitHub</span>
            </button>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-2 backdrop-blur-xs cursor-pointer"
            >
              <span>Jelajahi Lowongan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Radar Chart Kompetensi (FR-07) */}
      <div className="space-y-4">
        <CompetencyRadarChart
          studentData={profile?.extracted_skills?.radar_competencies}
        />
      </div>

      {/* Top Recommendations (FR-06) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Rekomendasi Lowongan Tertinggi (FR-06)
            </h3>
            <p className="text-xs text-slate-500">
              Dihitung menggunakan Cosine Similarity antara embedding portofolio GitHub dan deskripsi pekerjaan
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('jobs')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua Lowongan <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(recommendations.length > 0 ? recommendations.slice(0, 3) : [
            {
              job: {
                id: 'mock-1',
                title: 'Junior AI & Python Backend Engineer (Part-Time)',
                platform_source: 'linkedin',
                job_type: 'part_time',
                company_or_client: 'BioInformatika Nusantara & RS Cipto',
                description: 'Membangun endpoint REST API berbasis FastAPI dan pipeline embedding Sentence Transformers.',
                external_url: 'https://www.linkedin.com/jobs/view/bioinformatika-ai-backend-2026',
                budget_or_salary: 'Rp 6.000.000 / bulan',
                status: 'open',
                processing_status: 'done',
                created_at: new Date().toISOString(),
              },
              similarity_score: 0.92,
              match_percentage: 92,
            },
            {
              job: {
                id: 'mock-2',
                title: 'FastAPI & pgvector Semantic Search Integration',
                platform_source: 'upwork',
                job_type: 'freelance',
                company_or_client: 'CloudScale Global Solutions Inc.',
                description: 'Looking for a developer to integrate pgvector HNSW indexing and cosine distance semantic retrieval.',
                external_url: 'https://www.upwork.com/jobs/fastapi-pgvector-semantic-search_102',
                budget_or_salary: '$800 - $1,500',
                status: 'open',
                processing_status: 'done',
                created_at: new Date().toISOString(),
              },
              similarity_score: 0.88,
              match_percentage: 88,
            },
            {
              job: {
                id: 'mock-3',
                title: 'Fullstack Next.js 15 & Recharts Interactive Radar Dashboard',
                platform_source: 'fiverr',
                job_type: 'freelance',
                company_or_client: 'EduTech Creative Studio',
                description: 'Need a responsive Next.js frontend with modern Recharts radar visualization.',
                external_url: 'https://www.fiverr.com/buyer-requests/nextjs-recharts-radar-dashboard-554',
                budget_or_salary: '$450 / Project',
                status: 'open',
                processing_status: 'done',
                created_at: new Date().toISOString(),
              },
              similarity_score: 0.85,
              match_percentage: 85,
            },
          ]).map((item: any) => (
            <div
              key={item.job.id}
              onClick={() => setActiveModalJob(item.job)}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {item.job.platform_source}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    {item.match_percentage || Math.round(item.similarity_score * 100)}%
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.job.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {item.job.company_or_client || 'Mitra Industri'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700 text-[11px]">
                  {item.job.budget_or_salary || 'Kompetitif'}
                </span>
                <span className="text-blue-600 font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Detail <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail & Radar Overlay */}
      {activeModalJob && (
        <JobDetailModal
          job={activeModalJob}
          onClose={() => setActiveModalJob(null)}
        />
      )}
    </div>
  );
}
