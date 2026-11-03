'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { type Theme } from '@/components/ui/apple-liquid-glass-switcher';

interface FeatureCardData {
  id: string;
  icon: string;
  iconGradient: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  accent: 'purple' | 'lime' | 'indigo' | 'amber';
  previewComponent: (theme: Theme) => React.ReactNode;
}

const CARDS_DATA: FeatureCardData[] = [
  {
    id: 'card-1',
    icon: 'document_scanner',
    iconGradient: 'from-purple-600 to-indigo-700',
    title: 'Smart Resume & Repo Parser',
    subtitle: 'Ekstraksi otomatis repositori GitHub dan dokumen CV tanpa bias kata kunci manual.',
    tagline: 'Deep Embedding Analysis →',
    badge: '01 • Ingestion',
    accent: 'purple',
    previewComponent: (theme: Theme) => (
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>Parsing Progress:</span>
          <span className="text-purple-500 font-mono">100% Selesai</span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-slate-100' : 'bg-white/10'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8 }}
            className="h-full bg-purple-600 rounded-full"
          />
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {['TypeScript 98%', 'FastAPI 94%', 'PyTorch 92%'].map((tag) => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                theme === 'light'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-purple-950/60 text-purple-200 border-purple-400/30'
              }`}
            >
              ✓ {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'card-2',
    icon: 'hub',
    iconGradient: 'from-lime-500 to-emerald-600',
    title: 'Vector Semantic Matching',
    subtitle: 'Kalkulasi jarak matematis multi-vektor antara profil mahasiswa dan kualifikasi proyek.',
    tagline: 'Cosine Distance Metric →',
    badge: '02 • Match Engine',
    accent: 'lime',
    previewComponent: (theme: Theme) => (
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>Vector Distance Score:</span>
          <span className="text-lime-500 font-mono font-bold">0.9841 / 1.0</span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-slate-100' : 'bg-white/10'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '98%' }}
            transition={{ duration: 0.8 }}
            className="h-full bg-lime-500 rounded-full"
          />
        </div>
        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          Kesesuaian tinggi dengan 5 dimensi keahlian teknis.
        </p>
      </div>
    ),
  },
  {
    id: 'card-3',
    icon: 'verified_user',
    iconGradient: 'from-indigo-600 to-purple-700',
    title: 'Verified Industry Capstones',
    subtitle: 'Lowongan proyek riil bersertifikat langsung dari tech team korporat dan lab riset kampus.',
    tagline: 'Enterprise Grade Only →',
    badge: '03 • Verified',
    accent: 'indigo',
    previewComponent: (theme: Theme) => (
      <div className="space-y-2 pt-2">
        <div
          className={`p-2 rounded-xl border flex items-center justify-between ${
            theme === 'light'
              ? 'bg-slate-50/90 border-slate-200/80'
              : 'bg-white/5 border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
              ✓
            </span>
            <span className={`text-[11px] font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              Bank Mandiri &amp; BioFarma
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400">Terakreditasi</span>
        </div>
        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          Didampingi mentor industri senior selama sprint.
        </p>
      </div>
    ),
  },
  {
    id: 'card-4',
    icon: 'groups',
    iconGradient: 'from-amber-500 to-orange-600',
    title: 'Autonomous Squad Assembly',
    subtitle: 'Pembentukan squad seimbang (Frontend + Backend + AI Eng + UI/UX) siap bangun.',
    tagline: 'Balanced Team Synergy →',
    badge: '04 • Synergy',
    accent: 'amber',
    previewComponent: (theme: Theme) => (
      <div className="space-y-2 pt-2">
        <div className="grid grid-cols-4 gap-1 text-center">
          {['FE', 'BE', 'AI', 'UI'].map((role) => (
            <div
              key={role}
              className={`p-1.5 rounded-lg text-[10px] font-bold border ${
                theme === 'light'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
              }`}
            >
              {role}: 100%
            </div>
          ))}
        </div>
        <p className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          Komposisi peran optimal tanpa tumpang tindih keahlian.
        </p>
      </div>
    ),
  },
];

interface TactileFeatureCardsProps {
  theme?: Theme;
}

export default function TactileFeatureCards({ theme = 'light' }: TactileFeatureCardsProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>('card-1');

  return (
    <section id="ai-matching" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 scroll-mt-24">
      {/* Header with Bi-directional Scroll-Driven Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.95, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto text-center space-y-3 mb-12"
      >
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs ${
            theme === 'light'
              ? 'bg-purple-50 border-purple-200 text-primary-container'
              : theme === 'dark'
              ? 'bg-purple-950/60 border-purple-500/30 text-purple-300'
              : 'bg-purple-900/50 border-purple-400/40 text-purple-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-accent-lime-glow animate-pulse" />
          <span>Core Architecture &amp; Deliverables</span>
        </div>

        <h2
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-display transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-900' : theme === 'dark' ? 'text-white' : 'text-purple-50'
          }`}
        >
          Built to Eliminate Friction in Tech Talent Matching
        </h2>

        <p
          className={`text-sm sm:text-base leading-relaxed transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-600' : theme === 'dark' ? 'text-slate-300' : 'text-purple-200/80'
          }`}
        >
          Gantikan job board konvensional dengan kalkulasi semantik berbasis vektor yang akurat dan transparan.
        </p>
      </motion.div>

      {/* 4 Capsule Cards Grid with Staggered Bi-Directional Reveal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS_DATA.map((card, index) => {
          const isExpanded = activeCardId === card.id;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 50, scale: 0.92, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2, margin: '-40px' }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => setActiveCardId(isExpanded ? null : card.id)}
              whileHover={{ y: -8, scale: 1.01 }}
              className="relative rounded-3xl p-[1.5px] group cursor-pointer select-none"
            >
              {/* Animated Conic / Linear Glowing Border Sweep on Hover / Active */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 via-lime-400 to-purple-600 transition-opacity duration-300 blur-[2px] ${
                  isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              />

              {/* Card Surface with Liquid Glass — semi-transparent to reveal scrolling green conduit token with frosted blur */}
              <LiquidGlass
                material="clear"
                appearance={theme === 'light' ? 'light' : 'dark'}
                refraction={20}
                bezel={18}
                blur={12}
                interactive
                tint={theme === 'dim' ? '#180d2e' : undefined}
                className={`cursor-pointer transition-all duration-300 relative h-full rounded-3xl p-6 border group-hover:border-transparent shadow-sm group-hover:shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-xl ${
                  theme === 'light'
                    ? 'border-slate-200/70 bg-white/45 text-slate-800'
                    : theme === 'dark'
                    ? 'border-white/10 bg-slate-900/40 text-slate-100'
                    : 'border-purple-500/20 bg-[#160b2d]/45 text-purple-100'
                }`}
              >
                <div>
                  {/* Top: Icon + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.iconGradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform`}
                    >
                      <span className="material-symbols-outlined text-[28px]">{card.icon}</span>
                    </div>

                    <span className="font-mono text-xs font-black text-slate-400 group-hover:text-primary-container transition-colors">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3
                    className={`text-lg font-extrabold group-hover:text-primary-container transition-colors ${
                      theme === 'light' ? 'text-slate-900' : theme === 'dark' ? 'text-white' : 'text-purple-50'
                    }`}
                  >
                    {card.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm mt-2 leading-relaxed transition-colors ${
                      theme === 'light' ? 'text-slate-600' : theme === 'dark' ? 'text-slate-300' : 'text-purple-200/80'
                    }`}
                  >
                    {card.subtitle}
                  </p>

                  {/* Expandable Preview Area */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-3"
                      >
                        {card.previewComponent(theme)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Tagline / Action */}
                <div
                  className={`mt-6 pt-3 border-t flex items-center justify-between transition-colors ${
                    theme === 'light' ? 'border-slate-100' : 'border-white/10'
                  }`}
                >
                  <span
                    className={`text-xs font-bold group-hover:translate-x-1 transition-transform ${
                      theme === 'light' ? 'text-primary-container' : 'text-purple-400'
                    }`}
                  >
                    {card.tagline}
                  </span>
                  <span
                    className={`text-[11px] font-semibold transition-colors ${
                      theme === 'light'
                        ? 'text-slate-400 group-hover:text-slate-600'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {isExpanded ? 'Tutup ▲' : 'Uji Rincian ▼'}
                  </span>
                </div>
              </LiquidGlass>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
