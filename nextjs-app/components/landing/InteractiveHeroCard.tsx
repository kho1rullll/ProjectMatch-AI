'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import Link from 'next/link';

interface ProjectTarget {
  id: string;
  name: string;
  company: string;
  badge: string;
  category: string;
  requiredSkills: string[];
}

const PROJECT_TARGETS: ProjectTarget[] = [
  {
    id: 'fintech-risk',
    name: 'Fintech AI Risk Engine',
    company: 'Bank Mandiri Digital Lab',
    badge: 'BM',
    category: 'High-Throughput ML',
    requiredSkills: ['Next.js', 'Python / PyTorch', 'FastAPI', 'TypeScript', 'pgvector'],
  },
  {
    id: 'bio-vision',
    name: 'Deep Bio-Informatics Pipeline',
    company: 'BioFarma Nusantara & Lab',
    badge: 'BF',
    category: 'Genomic AI',
    requiredSkills: ['Python / PyTorch', 'FastAPI', 'Docker', 'Machine Learning'],
  },
  {
    id: 'smart-campus',
    name: 'Smart Campus IoT & Kiosk Gateway',
    company: 'Direktorat Kemahasiswaan',
    badge: 'DK',
    category: 'Fullstack IoT',
    requiredSkills: ['Next.js', 'TypeScript', 'UI/UX Design', 'Tailwind CSS'],
  },
];

const AVAILABLE_SKILLS = [
  'Next.js',
  'Python / PyTorch',
  'FastAPI',
  'TypeScript',
  'UI/UX Design',
  'pgvector',
  'Docker',
  'Tailwind CSS',
];

export default function InteractiveHeroCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTarget, setSelectedTarget] = useState<ProjectTarget>(PROJECT_TARGETS[0]!);
  const [activeSkills, setActiveSkills] = useState<string[]>([
    'Next.js',
    'FastAPI',
    'Python / PyTorch',
    'TypeScript',
    'pgvector',
  ]);
  const [displayedScore, setDisplayedScore] = useState(98.4);
  const [telemetryEvent, setTelemetryEvent] = useState('0.9841 // HIGH_CONVERGENCE');
  const [isSimulating, setIsSimulating] = useState(false);

  // Mouse tilt tracking motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 180,
    damping: 18,
  });

  // Parallax floating offsets for 3D depth elements
  const parallaxX1 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 200, damping: 20 });
  const parallaxY1 = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), { stiffness: 200, damping: 20 });
  const parallaxX2 = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), { stiffness: 200, damping: 20 });
  const parallaxY2 = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), { stiffness: 200, damping: 20 });

  // Spotlight Coordinates (pixels inside card)
  const [spotlightPos, setSpotlightPos] = useState({ x: 200, y: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);

    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setSpotlightPos({ x: 250, y: 180 });
  };

  // Toggle skills in simulator
  const toggleSkill = (skill: string) => {
    let nextSkills: string[];
    if (activeSkills.includes(skill)) {
      if (activeSkills.length === 1) return; // keep at least 1
      nextSkills = activeSkills.filter((s) => s !== skill);
    } else {
      nextSkills = [...activeSkills, skill];
    }
    setActiveSkills(nextSkills);
    computeMatch(nextSkills, selectedTarget);
  };

  // Change project target
  const handleTargetChange = (target: ProjectTarget) => {
    setSelectedTarget(target);
    computeMatch(activeSkills, target);
  };

  // Dynamic semantic match calculation
  const computeMatch = (skills: string[], target: ProjectTarget) => {
    const required = target.requiredSkills;
    const overlap = skills.filter((s) => required.includes(s)).length;
    const baseRatio = overlap / required.length;

    // Bonus for high skill count
    const extraSkillBonus = Math.min(10, skills.length * 1.5);
    const rawScore = Math.min(99.6, Math.max(38.0, baseRatio * 88 + extraSkillBonus));
    const finalScore = Number(rawScore.toFixed(1));

    // Animate score counter smoothly
    animate(displayedScore, finalScore, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayedScore(Number(latest.toFixed(1))),
    });

    // Update telemetry
    if (finalScore >= 90) {
      setTelemetryEvent(`${(finalScore / 100).toFixed(4)} // HIGH_CONVERGENCE`);
    } else if (finalScore >= 70) {
      setTelemetryEvent(`${(finalScore / 100).toFixed(4)} // OPTIMAL_SYNERGY`);
    } else {
      setTelemetryEvent(`${(finalScore / 100).toFixed(4)} // PARTIAL_ALIGNMENT`);
    }
  };

  // Quick Run AI Simulation Burst
  const triggerSimulationBurst = () => {
    setIsSimulating(true);
    setTelemetryEvent('0.9992 // CALCULATING_EMBEDDINGS...');
    setTimeout(() => {
      // Pick all target required skills
      setActiveSkills(selectedTarget.requiredSkills);
      computeMatch(selectedTarget.requiredSkills, selectedTarget);
      setIsSimulating(false);
    }, 700);
  };

  const isHighMatch = displayedScore >= 85;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative select-none"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic 3D Ambient Backing Glow */}
      <motion.div
        style={{ x: parallaxX1, y: parallaxY1 }}
        className="absolute -inset-4 bg-gradient-to-tr from-primary-container/30 via-purple-500/10 to-accent-lime-glow/25 rounded-3xl blur-2xl -rotate-2 scale-95 opacity-80 pointer-events-none"
      />

      {/* Floating 3D Node 1: Top-Right Verified Badge */}
      <motion.div
        style={{ x: parallaxX2, y: parallaxY2, z: 40 }}
        className="hidden sm:flex absolute -top-5 -right-4 z-30 items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0B0F19]/90 text-accent-lime-glow border border-accent-lime-glow/30 backdrop-blur-md shadow-xl text-xs font-bold"
      >
        <span className="w-2 h-2 rounded-full bg-accent-lime-glow animate-ping" />
        <span>Rank #1 Verified</span>
      </motion.div>

      {/* Floating 3D Node 2: Bottom-Left Vector Latency Chip */}
      <motion.div
        style={{ x: parallaxX1, y: parallaxY1, z: 35 }}
        className="hidden sm:flex absolute -bottom-5 -left-4 z-30 items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 text-slate-800 border border-slate-200/80 shadow-lg text-[11px] font-bold"
      >
        <span className="text-purple-600">⚡</span>
        <span>Vector Latency: 12ms</span>
      </motion.div>

      {/* Main 3D Perspective Glass Card */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative bg-surface-white/95 backdrop-blur-2xl border border-border-light rounded-3xl p- space-lg lg:p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] transition-shadow duration-300 overflow-hidden"
      >
        {/* Spotlight Dynamic Glow Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 320px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(132, 204, 22, 0.15), rgba(124, 58, 237, 0.08) 40%, transparent 80%)`,
          }}
        />

        {/* Top Interactive Score Header & Pulsing Neural Wave */}
        <div className="flex items-center justify-between pb-4 border-b border-border-light relative z-20">
          <div className="relative">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 font-bold text-xs ${
                isHighMatch
                  ? 'bg-lime-50 text-lime-950 border-lime-300 shadow-sm shadow-lime-500/20'
                  : 'bg-purple-50 text-purple-900 border-purple-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isHighMatch ? 'bg-lime-500 animate-ping' : 'bg-purple-500'
                }`}
              />
              <span className="font-mono text-sm font-extrabold">{displayedScore}%</span>
              <span>Semantic Match</span>
            </div>

            {/* Neural Radar Wave Effect when high score */}
            {isHighMatch && (
              <span
                className="absolute -inset-1 rounded-full border border-lime-400/60 animate-ping pointer-events-none opacity-40"
                style={{ animationDuration: '1.8s' }}
              />
            )}
          </div>

          {/* Quick AI Simulation Button */}
          <button
            type="button"
            onClick={triggerSimulationBurst}
            disabled={isSimulating}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-primary-container border border-purple-200 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="Klik untuk mensimulasikan pencocokan keahlian optimal"
          >
            <span className={isSimulating ? 'animate-spin' : ''}>✨</span>
            <span>{isSimulating ? 'Simulating...' : 'Auto-Match'}</span>
          </button>
        </div>

        {/* Target Project Selector Tabs */}
        <div className="mt-4 relative z-20 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-text-muted">
            <span className="uppercase tracking-wider">Pilih Proyek Target:</span>
            <span className="text-primary-container font-semibold">Live Simulator</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
            {PROJECT_TARGETS.map((proj) => {
              const isSelected = selectedTarget.id === proj.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleTargetChange(proj)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center truncate cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {proj.badge} • {proj.category.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Talent Profile & Matched Target Card */}
        <div className="mt-4 p-3.5 bg-surface-container-low/80 rounded-2xl border border-border-light relative z-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-surface-dark flex items-center justify-center text-accent-lime-glow font-black text-xs shadow-md shrink-0">
              {selectedTarget.badge}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {selectedTarget.name}
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {selectedTarget.company}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Verified
          </span>
        </div>

        {/* Interactive Skill Overlap Playground */}
        <div className="mt-4 relative z-20 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500 uppercase tracking-wider">
              Aktifkan Skill (Klik untuk Uji Skor):
            </span>
            <span className="text-purple-600 font-mono text-[10px]">
              {activeSkills.length} Aktif
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_SKILLS.map((skill) => {
              const isSelected = activeSkills.includes(skill);
              const isRequired = selectedTarget.requiredSkills.includes(skill);

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? isRequired
                        ? 'bg-primary-container text-white border-primary-container shadow-sm shadow-purple-500/20 scale-[1.02]'
                        : 'bg-purple-100 text-purple-900 border-purple-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200/70 hover:bg-slate-200/70'
                  }`}
                >
                  <span className="text-[10px]">{isSelected ? '✓' : '+'}</span>
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Telemetry Terminal Strip */}
        <div className="mt-4 p-3 rounded-2xl bg-surface-dark text-surface-white font-mono text-[11px] leading-tight flex flex-col gap-1.5 border border-border-glass-dark relative z-20 shadow-inner">
          <div className="flex items-center justify-between text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-lime-glow animate-pulse" />
              <span>telemetry.vector_engine</span>
            </span>
            <span className="text-accent-lime-glow font-bold text-[10px] tracking-wide">
              {telemetryEvent}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/10">
            <span>Skill Convergence: {displayedScore}%</span>
            <span className="text-slate-200 font-semibold">Decision: AUTO_ROUTED</span>
          </div>
        </div>

        {/* Action Button inside 3D Card */}
        <div className="mt-4 pt-3 flex items-center justify-between gap-3 relative z-20">
          <Link
            href="/projects"
            className="flex-1 py-2.5 px-4 rounded-full bg-primary-container text-surface-white hover:bg-primary-hover font-bold text-xs text-center transition-all shadow-md shadow-purple-500/25 active:scale-98"
          >
            Lihat Lowongan Terkait
          </Link>
          <Link
            href="/projects"
            className="p-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer"
            title="Eksplorasi Katalog Lengkap"
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
