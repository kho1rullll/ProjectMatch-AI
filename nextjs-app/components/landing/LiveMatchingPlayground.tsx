'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/apple-tahoe-liquid-glass-button';

const CATEGORIES = [
  { id: 'web-mobile', name: 'Web & Mobile', icon: '💻', baseScore: 94 },
  { id: 'ml-ai', name: 'Machine Learning & AI', icon: '🧠', baseScore: 98 },
  { id: 'iot', name: 'IoT & Smart Devices', icon: '📡', baseScore: 91 },
  { id: 'design', name: 'UI/UX & Product Design', icon: '🎨', baseScore: 95 },
];

const TALENT_NODES = [
  { id: 't1', label: 'Frontend Lead', skill: 'Next.js 15 • TypeScript', y: 40 },
  { id: 't2', label: 'AI Engineer', skill: 'PyTorch • Transformers', y: 110 },
  { id: 't3', label: 'Backend Architect', skill: 'FastAPI • pgvector', y: 180 },
  { id: 't4', label: 'UI/UX Designer', skill: 'Figma • Design System', y: 250 },
];

const PROJECT_NODES = [
  { id: 'p1', label: 'Core AI Engine', desc: 'Semantic Search Pipeline', y: 60 },
  { id: 'p2', label: 'Cloud Infrastructure', desc: 'Docker & Microservices', y: 145 },
  { id: 'p3', label: 'Client Dashboard', desc: 'Realtime Telemetry & Websocket', y: 230 },
];

export default function LiveMatchingPlayground() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>(CATEGORIES[1]!);
  const [timelineMonths, setTimelineMonths] = useState(3);
  const [complexity, setComplexity] = useState<'Standard' | 'Advanced' | 'Enterprise'>('Enterprise');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Dynamic calculated score
  const complexityMultiplier = complexity === 'Enterprise' ? 1.0 : complexity === 'Advanced' ? 0.95 : 0.9;
  const currentConfidence = Math.min(99.6, Number((selectedCategory.baseScore * complexityMultiplier - (timelineMonths - 3) * 0.8).toFixed(1)));

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      {/* Background glowing frame with Obsidian Liquid Glass */}
      <LiquidGlass
        material="clear"
        appearance="dark"
        refraction={36}
        bezel={30}
        tint="#0B0F19"
        className="text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
      >
        
        {/* Ambient glow patches */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-lime-glow text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-accent-lime-glow animate-pulse" />
            <span>Interactive AI Matching Engine • Live Playground</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-display">
            Uji Simulasi Neural Match Langsung di Sini
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Pilih domain keahlian, sesuaikan target durasi sprint, dan lihat bagaimana jaringan neural menghubungkan talenta dengan kebutuhan proyek secara presisi.
          </p>
        </div>

        {/* Controls Bar: Category Tabs & Sliders */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 pb-8 border-b border-white/10">
          
          {/* Category Tabs (Col 7) */}
          <div className="md:col-span-7 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              1. Pilih Kategori Proyek:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 select-none ${
                      isSelected
                        ? 'bg-purple-600/30 border-accent-lime-glow text-white shadow-lg shadow-purple-600/20 scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-bold leading-tight">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Timeline Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-wider">2. Target Timeline:</span>
                <span className="text-accent-lime-glow font-mono font-black">{timelineMonths} Bulan Sprint</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="1"
                value={timelineMonths}
                onChange={(e) => setTimelineMonths(Number(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
              />
            </div>

            {/* Complexity Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                3. Tingkat Kompleksitas:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Standard', 'Advanced', 'Enterprise'] as const).map((lvl) => {
                  const isSelected = complexity === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setComplexity(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-accent-lime-glow text-slate-950 border-accent-lime-glow font-extrabold shadow-md'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Neural Network Graph Canvas Visualization */}
        <div className="relative z-10 mt-8 pt-2">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Visualisasi Jaringan Saraf Talenta &amp; Lowongan Proyek
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-accent-lime-glow font-mono bg-lime-400/20 px-3 py-1 rounded-full border border-lime-400/30">
                AI Confidence: {currentConfidence}%
              </span>
            </div>
          </div>

          <div className="relative w-full h-[320px] rounded-2xl bg-[#070A12] border border-white/10 overflow-hidden p-4">
            
            {/* SVG Connecting Laser Beams */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 320" preserveAspectRatio="none">
              <defs>
                <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#84CC16" stopOpacity="1" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Laser connecting lines from each Talent node to Project nodes */}
              {TALENT_NODES.map((t) =>
                PROJECT_NODES.map((p) => {
                  const isHighlighted = hoveredNode === t.id || hoveredNode === p.id;
                  return (
                    <g key={`${t.id}-${p.id}`}>
                      {/* Base connection line */}
                      <line
                        x1="180"
                        y1={t.y + 15}
                        x2="620"
                        y2={p.y + 15}
                        stroke={isHighlighted ? '#84CC16' : 'rgba(124, 58, 237, 0.2)'}
                        strokeWidth={isHighlighted ? 2 : 1}
                        strokeDasharray={isHighlighted ? '6 4' : '3 6'}
                        className={isHighlighted ? 'animate-pulse' : ''}
                      />
                    </g>
                  );
                })
              )}

              {/* Central Neural Hub Indicator */}
              <circle cx="400" cy="160" r="30" fill="#0B0F19" stroke="#84CC16" strokeWidth="2" />
              <circle cx="400" cy="160" r="8" fill="#84CC16" className="animate-ping" style={{ transformOrigin: '400px 160px', animationDuration: '2s' }} />
            </svg>

            {/* Left Column: Talent Nodes */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 flex flex-col justify-around z-20 pointer-events-auto">
              {TALENT_NODES.map((t) => (
                <div
                  key={t.id}
                  onMouseEnter={() => setHoveredNode(t.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                    hoveredNode === t.id
                      ? 'bg-purple-600/40 border-accent-lime-glow scale-105 shadow-md shadow-purple-600/30'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>{t.label}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{t.skill}</p>
                </div>
              ))}
            </div>

            {/* Center: Neural Vector Hub Label */}
            <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-30">
              <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-accent-lime-glow text-[10px] font-mono font-bold border border-accent-lime-glow/40 shadow-xl">
                HNSW Vector Hub
              </span>
            </div>

            {/* Right Column: Project Nodes */}
            <div className="absolute right-4 sm:right-8 top-0 bottom-0 flex flex-col justify-around z-20 pointer-events-auto">
              {PROJECT_NODES.map((p) => (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredNode(p.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`px-3 py-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer text-right ${
                    hoveredNode === p.id
                      ? 'bg-lime-400/20 border-accent-lime-glow scale-105 shadow-md shadow-lime-400/20'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <p className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                    <span>{p.label}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-lime-glow" />
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{p.desc}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Telemetry Footer inside Playground */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-[11px] text-slate-400 font-mono pt-2 border-t border-white/10">
            <span>Algoritma: Multi-Vector Cosine Embedding (1536 dims)</span>
            <span className="text-accent-lime-glow font-bold">Status: SYNERGY_CONVERGED • 0.9841</span>
          </div>

        </div>

      </LiquidGlass>
    </section>
  );
}
