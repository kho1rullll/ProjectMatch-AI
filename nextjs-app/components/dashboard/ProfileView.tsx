'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { STUDENT_PROFILE } from '@/lib/data';

export default function ProfileView() {
  const { user } = useAuth();

  const name = user?.name || STUDENT_PROFILE.name;
  const nim = user?.nim || 'V3925028';
  const university = (user as any)?.organization || 'D3 Teknik Informatika PSDKU Madiun, Universitas Sebelas Maret (UNS)';
  const gpa = (user as any)?.gpa || '3.88 / 4.00';
  const rfid = (user as any)?.rfidUid || '0x8F3A29B1';

  const skillVectors = [
    { label: 'AI & Machine Learning', detail: 'PyTorch, Transformers, Computer Vision', score: 92 },
    { label: 'Backend Development', detail: 'Go, Python, PostgreSQL, Kafka, REST API', score: 90 },
    { label: 'Frontend Engineering', detail: 'Next.js, React 19, TypeScript, TailwindCSS', score: 85 },
    { label: 'Software Architecture & Cloud', detail: 'Docker, CI/CD, Microservices', score: 84 },
    { label: 'UI/UX Design & Prototyping', detail: 'Figma, User Research, Accessibility', score: 78 },
  ];

  const portfolioProjects = [
    {
      title: 'Deep Learning NER for Clinical Medical Records',
      tech: 'Python, PyTorch, HuggingFace, FastAPI',
      metric: 'F1-Score 94.2%',
    },
    {
      title: 'Real-Time Smart Campus Telemetry IoT Dashboard',
      tech: 'Next.js, WebSocket, Canvas API, TailwindCSS',
      metric: 'Latency < 45ms',
    },
    {
      title: 'High-Throughput Payment Ledger Microservice',
      tech: 'Golang, Redis, PostgreSQL, Docker',
      metric: '3,500 QPS Benchmark',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-indigo-700 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-lg shadow-purple-500/25">
              {name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {name}
                </h1>
                <span className="text-xs font-bold text-primary-container bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  NIM: {nim}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {university}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span>Semester 6</span>
                <span>•</span>
                <span>IPK: <strong className="text-slate-900 font-bold">{gpa}</strong></span>
                <span>•</span>
                <span className="text-lime-700 font-bold">Status: Aktif</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs shrink-0 space-y-1">
            <p className="font-bold text-slate-700">Kartu Mahasiswa (KTM RFID)</p>
            <p className="font-mono text-[11px] text-primary-container font-extrabold">{rfid} (Terverifikasi)</p>
          </div>
        </div>
      </div>

      {/* Grid: 5-D Competency Breakdown & Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5-D Competency Vectors */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Keahlian &amp; Kompetensi Teknis (5 Dimensi)
            </h3>
            <p className="text-xs text-slate-500">
              Skor keahlian yang dievaluasi dari transkrip akademik dan portofolio proyek.
            </p>
          </div>

          <div className="space-y-4">
            {skillVectors.map((vec, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">{vec.label}</span>
                  <span className="font-extrabold text-primary-container">{vec.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-container transition-all duration-300"
                    style={{ width: `${vec.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{vec.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Verified Portfolios */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Proyek Portofolio
            </h3>
            <p className="text-xs text-slate-500">
              Daftar proyek mandiri &amp; riset yang telah terverifikasi.
            </p>
          </div>

          <div className="space-y-3">
            {portfolioProjects.map((p, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1.5 hover:border-purple-200 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                  <span className="text-[10px] font-bold text-lime-900 bg-lime-100 px-2.5 py-0.5 rounded-full border border-lime-300 shrink-0">
                    Lolos
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{p.tech}</p>
                <p className="text-[10px] font-mono text-primary-container font-bold">{p.metric}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
