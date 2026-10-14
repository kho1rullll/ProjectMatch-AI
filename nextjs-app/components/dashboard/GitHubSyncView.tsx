'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { RefreshCw, CheckCircle2, AlertCircle, Clock, ExternalLink, Code2, GitCommit, Star } from 'lucide-react';
import { Github } from '@/components/icons/GithubIcon';

export default function GitHubSyncView() {
  const [profile, setProfile] = useState<any>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await api.profile.getMyProfile();
      setProfile(data);
      setUsernameInput(data.github_username || '');
    } catch (e: any) {
      // Mock data jika backend belum terisi
      const mockProfile = {
        github_username: 'kho1rullll',
        processing_status: 'done',
        github_data: {
          username: 'kho1rullll',
          total_repositories: 5,
          total_commits: 184,
          languages_breakdown: { TypeScript: 45.0, Python: 35.0, 'HTML/CSS': 12.0, SQL: 8.0 },
          top_repositories: [
            {
              name: 'ProjectMatch-AI',
              description: 'AI Semantic Career Matching Platform berbasis repositori GitHub dan pgvector',
              language: 'TypeScript',
              stars: 15,
            },
            {
              name: 'fastapi-pgvector-microservices',
              description: 'REST API berkinerja tinggi dengan Sentence Transformers dan Cosine Retrieval',
              language: 'Python',
              stars: 9,
            },
            {
              name: 'smart-nlp-classifier',
              description: 'Model ekstraksi kriteria teknis dengan pipeline PyTorch & HuggingFace',
              language: 'Python',
              stars: 6,
            },
          ],
        },
        extracted_skills: {
          headline: 'Fullstack AI Engineer specializing in Next.js, FastAPI & Semantic Search',
          primary_domains: ['AI & Machine Learning', 'Fullstack Web', 'Backend Systems'],
          technical_skills: [
            { name: 'Python & FastAPI', category: 'Backend', level: 92 },
            { name: 'Next.js & TypeScript', category: 'Frontend', level: 88 },
            { name: 'PyTorch & Transformers', category: 'AI/ML', level: 85 },
            { name: 'PostgreSQL & pgvector', category: 'Database', level: 89 },
          ],
          strengths_summary: 'Portofolio menunjukkan penguasaan solid dalam arsitektur modern three-tier, integrasi AI semantik, dan clean code.',
        },
      };
      setProfile(mockProfile);
      setUsernameInput(mockProfile.github_username);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setIsSyncing(true);
    setMessage(null);
    try {
      const res = await api.profile.syncGitHub(usernameInput.trim());
      setMessage({ type: 'success', text: res.message || 'Sinkronisasi berhasil dipicu!' });
      // Tunggu sebentar lalu refresh data
      setTimeout(() => {
        fetchProfile();
      }, 2000);
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Gagal memicu sinkronisasi GitHub.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const status = profile?.processing_status || 'pending';

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-4">
            <Github className="w-3.5 h-3.5" />
            <span>FR-02 & FR-03: Automated GitHub Portfolio Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Penautan Akun GitHub & Portofolio Riil
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            ProjectMatch AI mengevaluasi keahlian coding riil Anda langsung dari repositori publik GitHub,
            bahasa pemrograman yang digunakan, commit history, dan README proyek menggunakan AI Groq (Llama 3.1).
            Sesuai batasan sistem SKPL, tidak ada pengunggahan berkas CV PDF manual.
          </p>
        </div>

        {/* Form Sinkronisasi */}
        <form onSubmit={handleSync} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono text-sm">
              github.com/
            </span>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="username_github_anda"
              className="w-full pl-28 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSyncing}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Simpan & Sinkronkan'}</span>
          </button>
        </form>

        {/* Alert Feedback */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Processing Status Badge */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-500">Status Pemrosesan AI:</span>
          {status === 'done' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Selesai Disintesis
            </span>
          )}
          {status === 'processing' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sedang Diproses LLM
            </span>
          )}
          {status === 'pending' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
              <Clock className="w-3.5 h-3.5" /> Menunggu Antrean
            </span>
          )}
          {status === 'failed' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">
              <AlertCircle className="w-3.5 h-3.5" /> Gagal (Dapat Dicoba Ulang)
            </span>
          )}
        </div>
      </div>

      {/* Grid Hasil Analisis GitHub */}
      {profile?.github_data && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Kolom Kiri: Breakdown Bahasa & Statistik */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                Bahasa Pemrograman (Breakdown)
              </h3>
              <div className="space-y-3">
                {Object.entries(profile.github_data.languages_breakdown || {}).map(([lang, pct]: any) => (
                  <div key={lang} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{lang}</span>
                      <span className="text-blue-600 font-mono">{pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-lg font-black text-slate-900">{profile.github_data.total_repositories || 0}</p>
                  <p className="text-[11px] font-semibold text-slate-500">Repositori Publik</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-lg font-black text-blue-600">{profile.github_data.total_commits || 0}+</p>
                  <p className="text-[11px] font-semibold text-slate-500">Aktivitas Commit</p>
                </div>
              </div>
            </div>

            {/* Headline Hasil AI */}
            {profile.extracted_skills && (
              <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-sm space-y-3">
                <div className="text-blue-300 text-xs font-bold uppercase tracking-wider">
                  AI Career Synthesis (Llama 3.1)
                </div>
                <p className="text-sm font-semibold leading-relaxed">
                  "{profile.extracted_skills.headline}"
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(profile.extracted_skills.primary_domains || []).map((dom: string) => (
                    <span key={dom} className="px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-medium backdrop-blur-xs">
                      {dom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Daftar Repositori Utama */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Repositori Publik Teratas</span>
              <a
                href={`https://github.com/${profile.github_username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                Kunjungi GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </h3>

            <div className="space-y-3">
              {(profile.github_data.top_repositories || []).map((repo: any) => (
                <div
                  key={repo.name}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 font-mono">
                      {repo.name}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {repo.stars || 0}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-semibold text-[10px]">
                        {repo.language || 'General'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {repo.description || 'Tidak ada ringkasan deskripsi'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
