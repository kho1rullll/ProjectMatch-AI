'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { type Theme } from '@/components/ui/apple-liquid-glass-switcher';

interface ComparisonSliderSectionProps {
  theme?: Theme;
}

export default function ComparisonSliderSection({ theme = 'light' }: ComparisonSliderSectionProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging || e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <section id="comparison" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-24">
      
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs transition-colors ${
            theme === 'light'
              ? 'bg-lime-100 border-lime-300 text-lime-950'
              : theme === 'dark'
              ? 'bg-lime-400/20 border-lime-400/40 text-accent-lime-glow'
              : 'bg-lime-400/25 border-lime-400/40 text-accent-lime-glow'
          }`}
        >
          <span>⚡</span>
          <span>Perbandingan Paradigma Rekrutmen Talenta</span>
        </div>

        <h2
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-display transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-900' : theme === 'dark' ? 'text-white' : 'text-purple-50'
          }`}
        >
          Cara Konvensional vs. Era ProjectMatch AI
        </h2>

        <p
          className={`text-sm sm:text-base leading-relaxed transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-600' : theme === 'dark' ? 'text-slate-300' : 'text-purple-200/80'
          }`}
        >
          Geser bilah interaktif di bawah untuk melihat perbedaan nyata dalam efisiensi, transparansi, dan kecepatan pencocokan tim.
        </p>
      </div>

      {/* Comparison Split Slider Widget */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className={`relative h-[440px] sm:h-[400px] w-full rounded-3xl overflow-hidden border shadow-2xl select-none cursor-ew-resize transition-colors duration-300 ${
          theme === 'light'
            ? 'border-slate-200/90'
            : theme === 'dark'
            ? 'border-white/15'
            : 'border-purple-500/25'
        }`}
      >
        {/* Layer 1: Left Background — "Cara Lama (Konvensional)" */}
        <div className="absolute inset-0 bg-slate-900 text-slate-300 p-6 sm:p-10 flex flex-col justify-between">
          <div className="max-w-md space-y-3">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-extrabold inline-block">
              ✕ Cara Lama: Rekrutmen Manual
            </span>
            <h3 className="text-2xl font-bold text-white">Proses Lambat &amp; Rentan Ghosting</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Screening CV PDF memakan waktu 2 hingga 4 minggu</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Keahlian di CV sering kali tidak sesuai realitas coding</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Tingkat penolakan tanpa kabar mencapai lebih dari 65%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Sulit menemukan rekan setim lintas disiplin yang seimbang</span>
              </li>
            </ul>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Rata-rata Waktu Tunggu: <strong>14-30 Hari</strong> • Kepuasan: Rendah
          </div>
        </div>

        {/* Layer 2: Right Background Masked — "Dengan ProjectMatch AI" */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0B0F19] via-[#1E1B4B] to-[#0F172A] text-white p-6 sm:p-10 flex flex-col justify-between pointer-events-none"
          style={{
            clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
          }}
        >
          {/* Ambient Purple/Lime Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-md ml-auto text-right space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-full bg-lime-400/20 text-accent-lime-glow border border-lime-400/40 text-xs font-black inline-block">
              ✓ Solusi: ProjectMatch AI
            </span>
            <h3 className="text-2xl font-black text-white">Pencocokan Presisi Sub-Detik</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              <li className="flex items-center justify-end gap-2">
                <span>Ekstraksi portofolio riil langsung dari commit GitHub</span>
                <span className="text-accent-lime-glow font-bold">✓</span>
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>Skor kecocokan semantik matematis transparan</span>
                <span className="text-accent-lime-glow font-bold">✓</span>
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>Tawaran kolaborasi proyek masuk dalam waktu &lt; 24 jam</span>
                <span className="text-accent-lime-glow font-bold">✓</span>
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>Pembentukan squad otomatis (Frontend + Backend + AI + UI)</span>
                <span className="text-accent-lime-glow font-bold">✓</span>
              </li>
            </ul>
          </div>

          <div className="text-xs text-accent-lime-glow font-mono text-right relative z-10">
            Rata-rata Waktu Tunggu: <strong>&lt; 24 Jam</strong> • Akurasi: 98.4%
          </div>
        </div>

        {/* Center Draggable Slider Divider Line & Knob */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Vertical Glowing Line */}
          <div className="w-[3px] h-full bg-gradient-to-b from-purple-400 via-accent-lime-glow to-purple-400 shadow-[0_0_15px_#84CC16]" />

          {/* Central Handle Knob */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0B0F19] border-2 border-accent-lime-glow shadow-[0_0_20px_rgba(132,204,22,0.8)] flex items-center justify-center text-white text-xs font-black">
            <span>◀▶</span>
          </div>
        </div>
      </div>

      {/* Quick Jump Buttons under comparison */}
      <div className="flex items-center justify-center gap-3 mt-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => setSliderPosition(20)}
          className={`px-4 py-2 rounded-full transition-all cursor-pointer border ${
            theme === 'light'
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
              : theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/15'
              : 'bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border-purple-500/30'
          }`}
        >
          Lihat Cara Lama
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(50)}
          className={`px-4 py-2 rounded-full transition-all cursor-pointer border ${
            theme === 'light'
              ? 'bg-purple-100 hover:bg-purple-200 text-primary-container border-purple-200 shadow-2xs'
              : theme === 'dark'
              ? 'bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border-purple-400/30'
              : 'bg-purple-600/40 hover:bg-purple-600/50 text-purple-100 border-purple-400/40'
          }`}
        >
          Seimbang (50:50)
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(80)}
          className={`px-4 py-2 rounded-full transition-all cursor-pointer border ${
            theme === 'light'
              ? 'bg-lime-100 hover:bg-lime-200 text-lime-900 border-lime-200 shadow-2xs'
              : theme === 'dark'
              ? 'bg-lime-400/20 hover:bg-lime-400/30 text-lime-300 border-lime-400/30'
              : 'bg-lime-400/25 hover:bg-lime-400/35 text-lime-200 border-lime-400/40'
          }`}
        >
          Lihat ProjectMatch AI
        </button>
      </div>

    </section>
  );
}
