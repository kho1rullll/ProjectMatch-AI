'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HeroRpg3DChart from '@/components/HeroRpg3DChart';
import MatchProjectCard from '@/components/MatchProjectCard';
import { ALL_PROJECTS, STUDENT_PROFILE } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { useProjectsQuery } from '@/hooks/useProjects';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: serverProjects } = useProjectsQuery();

  const [synced, setSynced] = useState(false);

  const topMatches = React.useMemo(() => {
    if (!serverProjects || serverProjects.length === 0) {
      return ALL_PROJECTS.slice(0, 3);
    }
    return serverProjects.slice(0, 3).map((p) => ({
      id: p.id,
      title: p.title,
      company: p.company,
      category: p.category,
      matchScore: p.matchScore || 90,
      similarityMetric: (p.matchScore || 90) / 100,
      workType: p.workType,
      duration: p.duration || '3 Bulan',
      stipend: p.stipend || 'Rp 4.000.000 / bln',
      description: p.description || '',
      skillsRequired: Array.isArray(p.skillsRequired)
        ? p.skillsRequired
        : typeof p.skillsRequired === 'string'
        ? (p.skillsRequired as string).split(',').map((s) => s.trim())
        : [],
      requirementsBreakdown: p.requirementsBreakdown || {
        aiml: 85,
        frontend: 70,
        uiux: 65,
        backend: 80,
        architecture: 75,
      },
      verified: p.verified ?? true,
      postedAt: p.postedAt || 'Baru saja',
    }));
  }, [serverProjects]);

  const handleSync = () => {
    setSynced(true);
    setTimeout(() => setSynced(false), 3500);
  };

  const studentName = user?.role === 'MAHASISWA' ? (user.name || STUDENT_PROFILE.name) : STUDENT_PROFILE.name;
  const nim = user?.nim || 'V3925028';
  const gpa = user?.gpa || '3.88';
  const rfid = user?.rfidUid || '0x8F3A29B1';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. STUDENT HERO PROFILE & SMART CAMPUS KIOSK RFID STATUS (SKPL §2 & §3)    */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Avatar & Identitas Akademis */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20 shrink-0 ring-4 ring-white">
              {studentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
                  {studentName}
                </h1>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  NIM: {nim}
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Hero Tier S (Lv. 4)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                D3 Teknik Informatika — Kampus PSDKU Madiun, Universitas Sebelas Maret
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span>Semester 6</span>
                <span>•</span>
                <span>IPK Kumulatif: <strong className="text-slate-900">{gpa} / 4.00</strong></span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">24 Proyek Cocok</span>
              </div>
            </div>
          </div>

          {/* Smart Campus Kiosk RFID & Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            {/* IoT RFID Tag Pill (SKPL §1.2 & §3) */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Smart Kiosk RFID: {rfid} (KTM Terhubung)</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/projects"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                Eksplorasi Proyek
              </Link>
              <button
                type="button"
                onClick={handleSync}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                {synced ? '✓ GitHub & CV Tersinkron' : '📁 Upload CV / Sync GitHub'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO STATUS RADAR & 3D VECTOR VISUALIZATION (SKPL §4)                  */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
              <span>Spesifikasi Desain Multimedia Interaktif (SKPL §4)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              Visualisasi Matriks Kompetensi Hero Mahasiswa
            </h2>
            <p className="text-xs text-slate-500">
              Uji penumpukan grafik (overlay) terhadap kualifikasi proyek mitra dan klik dimensi untuk melihat bukti portofolio.
            </p>
          </div>
        </div>

        {/* 3D WebGL / Canvas Radar Chart Component */}
        <HeroRpg3DChart />
      </section>

      {/* ========================================================================= */}
      {/* 3. REKOMENDASI PROYEK TERBAIK (SEMANTIC MATCHING SKPL-F-05)              */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-display">
              Top Rekomendasi Proyek Berbasis AI
            </h2>
            <p className="text-xs text-slate-500">
              Kecocokan semantik tertinggi dihitung langsung dari vektor resume &amp; proyek riset aktif.
            </p>
          </div>
          <Link
            href="/projects"
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Lihat Semua Proyek →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topMatches.map((proj) => (
            <MatchProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STATUS LAMARAN & NOTIFIKASI AKTIF MAHASISWA (SKPL §3)                   */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 font-display">
          Status Lamaran &amp; Rekam Jejak Proyek Mahasiswa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-blue-100 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Sedang Ditinjau Mitra (In Review)
              </span>
              <h4 className="font-bold text-sm text-slate-900 pt-1">
                Pengembangan Engine NLP Berbasis Transformer
              </h4>
              <p className="text-xs text-slate-500">BioInformatika Nusantara &amp; RS Cipto</p>
              <p className="text-[11px] text-slate-400">Diajukan: 2 hari yang lalu • Cosine Score: 94.2%</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
              94% Match
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-blue-100 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Portofolio Terverifikasi (Accepted)
              </span>
              <h4 className="font-bold text-sm text-slate-900 pt-1">
                Redesain Sistem Dashboard Telemetri IoT
              </h4>
              <p className="text-xs text-slate-500">Pusat Riset Smart City ITB</p>
              <p className="text-[11px] text-slate-400">Diajukan: 1 minggu yang lalu • Cosine Score: 88.5%</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
              88% Match
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
