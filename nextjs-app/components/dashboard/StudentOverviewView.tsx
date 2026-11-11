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
      <div className="bg-[#0B0F19] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl relative overflow-hidden">
        {/* Ambient glow inside banner */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-lime-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-accent-lime-glow border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-accent-lime-glow" />
            <span>AI Career Automation Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Selamat Datang, {studentName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            NIM: <span className="font-mono font-bold text-white">{nim}</span> • Akun GitHub:{' '}
            <span className="font-mono font-bold text-accent-lime-glow">@{githubUser}</span>
            <br />
            Keahlian coding Anda disintesis otomatis dari repositori publik GitHub dan dicocokkan secara semantik dengan lowongan freelance dan part-time.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab('github')}
              className="px-5 py-2.5 rounded-full bg-primary-container text-white font-bold text-xs hover:bg-primary-hover transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Kelola Akun GitHub</span>
            </button>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 backdrop-blur-md border border-white/10 cursor-pointer"
            >
              <span>Jelajahi Lowongan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Radar Chart Kompetensi */}
      <div className="space-y-4">
        <CompetencyRadarChart
          studentData={profile?.extracted_skills?.radar_competencies}
        />
      </div>

      {/* Top Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Rekomendasi Lowongan Tertinggi
            </h3>
            <p className="text-xs text-slate-500">
              Rekomendasi presisi berdasarkan sintesis portofolio GitHub dan kebutuhan lowongan
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('jobs')}
            className="text-xs font-bold text-primary-container hover:text-purple-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            Lihat Semua Lowongan <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {item.job.platform_source}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-black text-lime-900 bg-lime-100 border border-lime-300/80 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-lime-600" />
                    {item.match_percentage || Math.round(item.similarity_score * 100)}% Match
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-primary-container transition-colors line-clamp-2">
                  {item.job.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {item.job.company_or_client || 'Mitra Industri'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 text-xs">
                  {item.job.budget_or_salary || 'Kompetitif'}
                </span>
                <span className="text-primary-container font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Detail <ExternalLink className="w-3.5 h-3.5" />
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
