'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import Link from 'next/link';
import MagneticButton from './MagneticButton';
import { LiquidGlass, LiquidGlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { type Theme } from '@/components/ui/apple-liquid-glass-switcher';

interface SkillItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  points: number;
}

const INITIAL_SKILLS: SkillItem[] = [
  { id: 'nextjs', name: 'Next.js 15', icon: '⚡', category: 'Frontend', points: 14 },
  { id: 'python', name: 'Python / ML', icon: '🐍', category: 'AI', points: 18 },
  { id: 'pytorch', name: 'PyTorch', icon: '🔥', category: 'Deep Learning', points: 15 },
  { id: 'fastapi', name: 'FastAPI', icon: '🚀', category: 'Backend', points: 12 },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', category: 'Languages', points: 11 },
  { id: 'uiux', name: 'UI/UX Design', icon: '🎨', category: 'Design', points: 12 },
  { id: 'pgvector', name: 'pgvector', icon: '🗄️', category: 'Vector DB', points: 10 },
  { id: 'docker', name: 'Docker / Cloud', icon: '🐳', category: 'DevOps', points: 8 },
];

interface DraggableHeroSectionProps {
  theme?: Theme;
}

export default function DraggableHeroSection({ theme = 'light' }: DraggableHeroSectionProps) {
  const heroCardRef = useRef<HTMLDivElement>(null);

  // Active matched skills inside the drop zone
  const [activeSkills, setActiveSkills] = useState<string[]>([
    'nextjs',
    'python',
    'pytorch',
    'fastapi',
  ]);
  const [matchScore, setMatchScore] = useState<number>(88.5);
  const [lastAddedSkill, setLastAddedSkill] = useState<string | null>(null);

  // Mouse tracking for 3D card tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 180,
    damping: 18,
  });

  // Spotlight coordinates on card
  const [spotlight, setSpotlight] = useState({ x: 260, y: 180 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpotlight({ x: 260, y: 180 });
  };

  // Toggle or add skill to matching pool
  const toggleSkill = (skill: SkillItem) => {
    let next: string[];
    if (activeSkills.includes(skill.id)) {
      if (activeSkills.length <= 1) return;
      next = activeSkills.filter((id) => id !== skill.id);
    } else {
      next = [...activeSkills, skill.id];
      setLastAddedSkill(skill.name);
      setTimeout(() => setLastAddedSkill(null), 1200);
    }
    setActiveSkills(next);

    // Compute dynamic score with spring physics
    const totalPoints = next.reduce((acc, currId) => {
      const found = INITIAL_SKILLS.find((s) => s.id === currId);
      return acc + (found?.points || 0);
    }, 0);
    const targetScore = Math.min(99.4, Math.max(45.0, 40 + totalPoints * 0.72));

    animate(matchScore, Number(targetScore.toFixed(1)), {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (val) => setMatchScore(Number(val.toFixed(1))),
    });
  };

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-14 pb-16 lg:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Headlines & Magnetic CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          
          {/* Overline pill badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs border transition-colors ${
              theme === 'light'
                ? 'bg-purple-50 border-purple-200 text-primary-container'
                : theme === 'dark'
                ? 'bg-purple-950/60 border-purple-500/30 text-purple-300'
                : 'bg-purple-900/50 border-purple-400/40 text-purple-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-accent-lime-glow animate-ping" />
            <span className="uppercase tracking-wider">Semantic AI Matching • Next-Gen Career Launch</span>
          </div>

          {/* Main Title */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] font-display transition-colors duration-300 ${
              theme === 'light' ? 'text-slate-900' : theme === 'dark' ? 'text-white' : 'text-purple-50'
            }`}
          >
            Match your skills, land your dream{' '}
            <span className="relative inline-block mt-1">
              <span className="inline-block bg-primary-container text-white px-4 py-1 rounded-2xl shadow-xl shadow-purple-600/30 transform -rotate-1">
                project
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg max-w-xl leading-relaxed transition-colors duration-300 ${
              theme === 'light' ? 'text-slate-600' : theme === 'dark' ? 'text-slate-300' : 'text-purple-200/80'
            }`}
          >
            Platform kurasi proyek berbasis semantic AI yang menghubungkan mahasiswa dan talenta teknologi dengan proyek industri terverifikasi secara presisi tanpa screening manual yang lambat.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
            <LiquidGlassButton
              asChild
              interactive
              size="lg"
              refraction={20}
              tint="#7C3AED"
              className="w-full sm:w-auto text-white font-bold shadow-xl shadow-purple-500/25"
            >
              <Link href="/projects" className="flex items-center gap-2">
                <span>Find Projects</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </LiquidGlassButton>

            <MagneticButton
              href="#ai-matching"
              magneticStrength={0.2}
              glowOnHover={false}
              className={`w-full sm:w-auto px-6 py-4 rounded-full font-bold text-sm border shadow-xs flex items-center gap-2 transition-all ${
                theme === 'light'
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'
                  : theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/15 text-white border-white/20 backdrop-blur-md'
                  : 'bg-purple-950/60 hover:bg-purple-900/60 text-purple-100 border-purple-500/30 backdrop-blur-md'
              }`}
            >
              <span>How AI Match Works</span>
              <span className="material-symbols-outlined text-[18px]">east</span>
            </MagneticButton>
          </div>

          {/* Draggable Skills Playground Hint Bar */}
          <div
            className={`w-full pt-4 border-t space-y-2.5 transition-colors ${
              theme === 'light' ? 'border-slate-200/80' : 'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span
                className={`uppercase tracking-wider flex items-center gap-1.5 ${
                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <span>✋</span>
                <span>Drag &amp; Drop atau Klik Skill ke Kartu:</span>
              </span>
              <span
                className={`font-mono text-[11px] ${
                  theme === 'light' ? 'text-primary-container' : 'text-purple-400'
                }`}
              >
                {activeSkills.length} Terpasang
              </span>
            </div>

            {/* Draggable Badges Pool */}
            <div className="flex flex-wrap gap-2 relative">
              {INITIAL_SKILLS.map((skill) => {
                const isSelected = activeSkills.includes(skill.id);
                return (
                  <motion.div
                    key={skill.id}
                    drag
                    dragConstraints={{ left: -40, right: 40, top: -40, bottom: 40 }}
                    dragElastic={0.3}
                    whileDrag={{ scale: 1.15, zIndex: 50, cursor: 'grabbing' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-grab transition-colors border select-none ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/25'
                        : theme === 'light'
                        ? 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
                        : theme === 'dark'
                        ? 'bg-slate-800/80 text-slate-200 border-white/10 hover:border-purple-400 hover:bg-purple-950/40'
                        : 'bg-purple-950/50 text-purple-200 border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/50'
                    }`}
                  >
                    <span>{skill.icon}</span>
                    <span>{skill.name}</span>
                    <span className="text-[10px] opacity-80">{isSelected ? '✓' : '+'}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2.5 items-center">
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                ITB
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                UI
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                UGM
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-900 text-accent-lime-glow font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                +15k
              </div>
            </div>
            <div className={`text-xs ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className={`font-extrabold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                15,400+ Mahasiswa
              </span>{' '}
              bergabung &amp; terverifikasi
            </div>
          </div>

        </div>

        {/* Right Column: 3D Perspective Tilt Card with Drop Zone */}
        <div className="lg:col-span-5 relative" style={{ perspective: 1200 }}>
          
          {/* Ambient colored backdrop */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 via-primary-container/10 to-lime-400/20 rounded-3xl blur-2xl -rotate-2 scale-95 opacity-80 pointer-events-none" />

          {/* Notification toast if skill added */}
          {lastAddedSkill && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 bg-[#0B0F19] text-accent-lime-glow px-4 py-1 rounded-full text-xs font-bold shadow-xl border border-white/10 flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>Skill Synced: {lastAddedSkill}</span>
            </motion.div>
          )}

          {/* Physical 3D Tilt Card Container */}
          <motion.div
            ref={heroCardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative"
          >
            <LiquidGlass
              material="clear"
              appearance={theme === 'light' ? 'light' : 'dark'}
              refraction={24}
              bezel={22}
              dispersion={0.15}
              tint={theme === 'dim' ? '#180d2e' : undefined}
              className={`p-6 sm:p-7 relative rounded-3xl border transition-all duration-300 overflow-hidden backdrop-blur-xl ${
                theme === 'light'
                  ? 'border-slate-200/90 bg-white/40 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)]'
                  : theme === 'dark'
                  ? 'border-white/15 bg-slate-900/45 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]'
                  : 'border-purple-500/25 bg-[#170c2e]/50 shadow-[0_25px_60px_-15px_rgba(88,28,135,0.35)]'
              }`}
            >
              {/* Specular glass reflection following cursor */}
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background: `radial-gradient(circle 350px at ${spotlight.x}px ${spotlight.y}px, rgba(132, 204, 22, 0.16), rgba(124, 58, 237, 0.08) 45%, transparent 75%)`,
                }}
              />

              {/* Top Row: Match Score & Live Wave */}
              <div
                className={`flex items-center justify-between pb-4 border-b relative z-20 ${
                  theme === 'light' ? 'border-slate-100' : 'border-white/10'
                }`}
              >
                <div className="relative">
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs shadow-xs border ${
                      theme === 'light'
                        ? 'bg-lime-100 border-lime-300 text-lime-950'
                        : 'bg-lime-400/20 border-lime-400/40 text-accent-lime-glow'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping" />
                    <span
                      className={`font-mono text-base font-black ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {matchScore}%
                    </span>
                    <span>Match Convergence</span>
                  </div>

                  {/* Radar glow */}
                  <span className="absolute -inset-1 rounded-full border border-lime-400/50 animate-ping pointer-events-none opacity-40" />
                </div>

                <span
                  className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    theme === 'light'
                      ? 'text-purple-700 bg-purple-50 border-purple-200'
                      : 'text-purple-300 bg-purple-950/60 border-purple-500/30'
                  }`}
                >
                  Rank #1
                </span>
              </div>

              {/* Target Role & Client Block */}
              <div
                className={`mt-4 p-4 rounded-2xl border flex items-center justify-between gap-3 relative z-20 ${
                  theme === 'light'
                    ? 'bg-slate-50/90 border-slate-200/80'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-accent-lime-glow flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                    BM
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`font-extrabold text-sm truncate ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      Fintech AI Risk Engine
                    </h4>
                    <p
                      className={`text-xs truncate mt-0.5 ${
                        theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      Bank Mandiri Digital Lab • Capstone
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 shrink-0">
                  ✓ Sponsor Verified
                </span>
              </div>

              {/* Interactive "Drop Zone / Active Skill Mesh" */}
              <div
                className={`mt-4 p-4 rounded-2xl border-2 border-dashed relative z-20 space-y-2.5 ${
                  theme === 'light'
                    ? 'border-purple-200/80 bg-purple-50/30'
                    : 'border-purple-500/30 bg-purple-950/20'
                }`}
              >
                <div
                  className={`flex items-center justify-between text-xs font-bold ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-primary-container">✦</span>
                    <span>Matched Skill Mesh:</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">Auto Computed</span>
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[48px]">
                  {activeSkills.map((sId) => {
                    const item = INITIAL_SKILLS.find((s) => s.id === sId);
                    if (!item) return null;
                    return (
                      <motion.span
                        layout
                        key={item.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-xs border ${
                          theme === 'light'
                            ? 'bg-white text-slate-800 border-purple-200/70'
                            : 'bg-slate-800/90 text-slate-100 border-purple-500/30'
                        }`}
                      >
                        <span className="text-xs">{item.icon}</span>
                        <span>{item.name}</span>
                      </motion.span>
                    );
                  })}
                </div>
              </div>

              {/* Live Telemetry Terminal Strip */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#0B0F19] text-white font-mono text-[11px] leading-tight space-y-1 border border-white/10 relative z-20 shadow-inner">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-lime-glow animate-pulse" />
                    <span>telemetry.vector_engine</span>
                  </span>
                  <span className="text-accent-lime-glow font-bold">
                    {`${(matchScore / 100).toFixed(4)} // HIGH_CONVERGENCE`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>Vector Dimension: 1536</span>
                  <span className="text-slate-300 font-semibold">Latency: 8.2ms</span>
                </div>
              </div>

              {/* Card Action */}
              <div className="mt-4 pt-2 relative z-20 flex items-center justify-between gap-3">
                <Link
                  href="/projects"
                  className="flex-1 py-3 px-4 rounded-full bg-primary-container hover:bg-primary-hover text-white font-bold text-xs text-center transition-all shadow-md shadow-purple-500/25 active:scale-98"
                >
                  Tinjau Lowongan Terbuka
                </Link>
                <Link
                  href="/projects"
                  className={`p-3 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                    theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="Lihat Graf Vektor"
                >
                  <span className="material-symbols-outlined text-[18px]">hub</span>
                </Link>
              </div>
            </LiquidGlass>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
