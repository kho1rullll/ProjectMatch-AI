import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import FeatureZigZag from '@/components/FeatureZigZag';
import { Particles } from '@/components/ui/particles';
import HeroOrbitalSystem from '@/components/landing/HeroOrbitalSystem';
import FloatingProductCards from '@/components/landing/FloatingProductCards';
import ProjectMatchHeroStack from '@/components/landing/ProjectMatchHeroStack';
import EcosystemStrip from '@/components/landing/EcosystemStrip';
import HeroMetricsBar from '@/components/landing/HeroMetricsBar';
import HeroFeaturesGrid from '@/components/landing/HeroFeaturesGrid';

export const metadata: Metadata = {
  title: 'ProjectMatch AI — Hubungkan Potensi Mahasiswa dengan Proyek Industri',
  description:
    'Platform rekomendasi cerdas berbasis Cosine Similarity, visualisasi kompetensi interaktif Hero RPG, serta terminal Smart Campus Kiosk (RFID).',
};

export default function RootHomePage() {
  return (
    <div className="w-full space-y-16 sm:space-y-20 pb-20">
      
      {/* ========================================================================= */}
      {/* HERO SECTION: DEFLEXAI REFERENCE ARCHITECTURE CANVAS                     */}
      {/* ========================================================================= */}
      <section className="px-3 sm:px-6 lg:px-8 pt-1 sm:pt-2">
        <div className="hero-canvas max-w-6xl mx-auto relative overflow-hidden p-6 sm:p-10 lg:p-12 min-h-[860px] lg:min-h-[920px] flex flex-col justify-between">
          
          {/* Layer 0: Subtle Particle System */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <Particles
              className="w-full h-full"
              quantity={40}
              staticity={30}
              ease={60}
              size={0.7}
              color="#3b82f6"
            />
          </div>

          {/* Layer 1: Orbital Geometry Graphic System */}
          <HeroOrbitalSystem />

          {/* Layer 2: Floating Product Cards */}
          <FloatingProductCards />

          {/* Layer 3: Central Hero Typography & CTAs */}
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5 pt-8 sm:pt-12">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200 text-blue-700 text-xs font-bold tracking-tight shadow-xs backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Sistem Pencocokan Otomatis AI &amp; Smart Campus Kiosk v1.0</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-display">
              Hubungkan Potensi Mahasiswa dengan{' '}
              <span className="gradient-text-blue">Proyek Industri</span> Nyata.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
              Platform inferensi cerdas berbasis <strong className="text-slate-800 font-semibold">Cosine Similarity</strong>, visualisasi kompetensi interaktif <strong className="text-slate-800 font-semibold">Hero RPG</strong>, serta integrasi fisik terminal kampus <strong className="text-slate-800 font-semibold">Smart Kiosk RFID</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/projects"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Eksplorasi Proyek AI</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>

              <Link
                href="/auth"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Masuk dengan KTM / Akun</span>
              </Link>
            </div>

          </div>

          {/* Layer 4: Interactive Stack Mockup */}
          <div className="relative z-10 my-6 sm:my-8 max-w-xl mx-auto w-full">
            <ProjectMatchHeroStack />
          </div>

          {/* Layer 5: Ecosystem & Trust Row at Bottom of Canvas */}
          <div className="relative z-10">
            <EcosystemStrip />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* LIVE METRICS BAR (EXTRACTED SERVER COMPONENT)                             */}
      {/* ========================================================================= */}
      <HeroMetricsBar />

      {/* ========================================================================= */}
      {/* LIST FITUR UNGGULAN SISTEM (EXTRACTED SERVER COMPONENT)                   */}
      {/* ========================================================================= */}
      <HeroFeaturesGrid />

      {/* ========================================================================= */}
      {/* FEATURE ZIG-ZAG COMPONENT (PRESERVED)                                     */}
      {/* ========================================================================= */}
      <section id="workflow" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <FeatureZigZag />
      </section>

    </div>
  );
}