// app/dashboard/page.tsx — Server Component Architecture (Modul 6 RSC Target)
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import DashboardHeroStats from '@/components/DashboardHeroStats';
import HeroRpg3DChart from '@/components/HeroRpg3DChart';
import ProjectListFetcher from '@/components/ProjectListFetcher';
import DashboardAppStatus from '@/components/DashboardAppStatus';
import DashboardLoading from './loading';

export const metadata: Metadata = {
  title: 'Dashboard Mahasiswa & Hero RPG | ProjectMatch AI',
  description:
    'Visualisasi matriks kompetensi 5 dimensi Hero RPG, rekomendasi proyek AI Semantic Match, dan status integrasi Smart Campus Kiosk RFID.',
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      {/* 1. STUDENT HERO PROFILE & SMART CAMPUS KIOSK RFID STATUS (Client Leaf) */}
      <DashboardHeroStats />

      {/* 2. HERO STATUS RADAR & 3D VECTOR VISUALIZATION (Client Leaf WebGL/Canvas) */}
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

      {/* 3. REKOMENDASI PROYEK TERBAIK (Streaming Server Component with Suspense) */}
      <section className="space-y-4">
        <Suspense fallback={<DashboardLoading />}>
          <ProjectListFetcher />
        </Suspense>
      </section>

      {/* 4. STATUS LAMARAN & NOTIFIKASI AKTIF MAHASISWA (Extracted Server Component) */}
      <DashboardAppStatus />
    </div>
  );
}
