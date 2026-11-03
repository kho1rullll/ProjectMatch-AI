'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, GitBranch, Star, Code2, Award, Terminal, Flame, Layers } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export default function ProjectMatchHeroStack() {
  const [activeTab, setActiveTab] = useState<'project' | 'skills'>('project');

  return (
    <div className="relative mx-auto w-full max-w-lg flex items-center justify-center py-6 sm:py-10 select-none">
      
      {/* ========================================================================= */}
      {/* 1. AMBIENT GLOW & DECORATIVE ANIMATED BACKGROUND ELEMENTS                */}
      {/* ========================================================================= */}
      
      {/* Neon Lime Ring (From Reference Design) - Floating Animation */}
      <div 
        className="absolute -top-6 -right-2 sm:-top-10 sm:right-2 w-36 h-36 sm:w-44 sm:h-44 rounded-full border-[7px] sm:border-[8px] border-[#a3e635] opacity-80 pointer-events-none -z-10 animate-float-1"
        aria-hidden="true"
      />

      {/* Pastel Rainbow / Purple Glow Aura */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-72 sm:h-80 bg-gradient-to-tr from-purple-500/20 via-pink-400/15 to-lime-300/20 rounded-full blur-3xl pointer-events-none -z-20 animate-pulse"
        style={{ animationDuration: '4s' }}
        aria-hidden="true"
      />

      {/* Purple Ribbon Wave (Floating below the portfolio cards) */}
      <div 
        className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-10 w-52 sm:w-64 h-12 sm:h-14 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 rounded-full -rotate-12 opacity-90 shadow-xl shadow-purple-600/30 pointer-events-none z-10 animate-float-2"
        aria-hidden="true"
      />

      {/* Circular Stamp Badge */}
      <div 
        className="absolute -top-7 right-4 sm:-top-8 sm:right-2 w-20 h-20 sm:w-22 sm:h-22 rounded-full border border-purple-200 bg-white/80 backdrop-blur-md flex items-center justify-center p-1 shadow-md pointer-events-none z-30 -rotate-12 hidden xs:flex animate-float-3"
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-full border border-dashed border-purple-500/80 flex flex-col items-center justify-center text-center p-1">
          <span className="text-[7px] font-black uppercase tracking-wider text-purple-700">
            VERIFIED
          </span>
          <span className="text-[8px] font-black text-slate-900">
            PORTOFOLIO
          </span>
          <span className="text-[6px] font-bold text-emerald-600">
            ★ TOP 1% ★
          </span>
        </div>
      </div>

      {/* Micro Animated Sparkles */}
      <div className="absolute top-2 -left-2 text-purple-500 text-xl font-bold animate-ping pointer-events-none z-20" style={{ animationDuration: '3s' }}>
        ✦
      </div>
      <div className="absolute -bottom-2 right-12 text-[#84cc16] text-xl font-bold animate-pulse pointer-events-none z-20">
        ✦
      </div>
      <div className="absolute top-1/2 -right-6 text-indigo-400 text-sm font-bold pointer-events-none z-20">
        ✦
      </div>

      {/* ========================================================================= */}
      {/* 2. PORTOFOLIO CARD SYSTEM (Animated & Interactive)                       */}
      {/* ========================================================================= */}
      <div className="relative w-full max-w-[360px] sm:max-w-[420px] transition-transform duration-500 hover:scale-[1.02]">
        
        {/* ======================================================================= */}
        {/* BACK CARD: Secondary Competency & Git Activity Card                    */}
        {/* ======================================================================= */}
        <div 
          className="absolute inset-0 bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-800 flex flex-col justify-between -rotate-6 translate-x-3 translate-y-6 sm:translate-x-5 sm:translate-y-7 transition-all duration-500 pointer-events-none"
          style={{ zIndex: 10 }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#a3e635] shadow-xs shadow-lime-400/50" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                Kompetensi Portofolio
              </span>
            </div>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800">
              Tier S • Level 42
            </span>
          </div>

          {/* Mini Skill Meters */}
          <div className="space-y-1.5 my-2">
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Frontend &amp; Arsitektur</span>
              <span className="text-white font-bold">96%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full w-[96%]" />
            </div>
          </div>

          {/* Footer of back card */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <GithubIcon className="w-3.5 h-3.5 text-white" />
              <span>1.420+ Verified Commits</span>
            </span>
            <span className="text-[#a3e635] font-bold">Aktif Terverifikasi</span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* FRONT CARD: Interactive Glassmorphism Portofolio Showcase Card           */}
        {/* ======================================================================= */}
        <div 
          className="relative rounded-3xl bg-white/95 backdrop-blur-xl border border-purple-200/90 shadow-2xl p-5 sm:p-6 space-y-4 transition-all duration-500 rotate-2 hover:rotate-0"
          style={{ zIndex: 20 }}
        >
          {/* Student Profile Header */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {/* Avatar with Live Indicator */}
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-purple-600/30">
                  RS
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[7px] text-white font-bold">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                    Raden Satria
                  </h4>
                  <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-md border border-purple-200">
                    Mahasiswa
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <GithubIcon className="w-3 h-3 text-slate-600" />
                  <span>github.com/radensatria</span>
                </p>
              </div>
            </div>

            {/* Match Score Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>98.4% Match</span>
            </div>
          </div>

          {/* Featured Portfolio Project */}
          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-2 text-left">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                <Code2 className="w-3 h-3" />
                <span>Portofolio Unggulan</span>
              </span>
              <span className="text-slate-400 font-mono">Repo Publik</span>
            </div>

            <div>
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                Medical NLP &amp; Diagnostic Platform
              </h5>
              <p className="text-[10px] text-slate-600 leading-relaxed mt-0.5">
                Aplikasi analisis data kesehatan dengan antarmuka interaktif dan pemrosesan otomatis.
              </p>
            </div>

            {/* Commit Heatmap Activity Representation */}
            <div className="pt-1">
              <p className="text-[9px] font-semibold text-slate-400 mb-1">Aktivitas Kontribusi GitHub:</p>
              <div className="flex items-center gap-1 overflow-hidden">
                {[
                  'bg-emerald-300', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-400',
                  'bg-emerald-600', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700',
                  'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700', 'bg-emerald-600',
                  'bg-emerald-500', 'bg-emerald-400', 'bg-emerald-600', 'bg-emerald-500'
                ].map((color, i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-3 rounded-xs ${color} transition-transform hover:scale-125 cursor-pointer`}
                    title={`Aktivitas Commit Minggu #${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Skill Badges & Repository Stats */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-left">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                React.js
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                Python
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#ecfccb] text-[#3f6212] border border-[#d9f99d]">
                FastAPI
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>142</span>
              </span>
              <span className="flex items-center gap-0.5 text-slate-600">
                <GitBranch className="w-3 h-3" />
                <span>38</span>
              </span>
            </div>
          </div>

          {/* Floating Micro Status Pill */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Portofolio Otomatis Tersinkron</span>
            </span>
            <span className="text-purple-600 font-bold hover:underline cursor-pointer">
              Detail Profil →
            </span>
          </div>

        </div>

        {/* Floating Accent Mini Badge (Animated Top-Left) */}
        <div className="absolute -top-3 -left-3 sm:-left-6 z-30 animate-float-1 pointer-events-none">
          <div className="glass-card rounded-2xl px-3 py-1.5 shadow-lg border border-purple-200/90 flex items-center gap-1.5 bg-white/90">
            <span className="text-xs">🚀</span>
            <span className="text-[10px] font-extrabold text-slate-800">Siap Magang &amp; Proyek</span>
          </div>
        </div>

        {/* Floating Accent Mini Badge (Animated Bottom-Right) */}
        <div className="absolute -bottom-3 -right-2 sm:-right-4 z-30 animate-float-3 pointer-events-none">
          <div className="glass-card rounded-2xl px-3 py-1.5 shadow-lg border border-emerald-200/90 flex items-center gap-1.5 bg-white/90">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-extrabold text-emerald-800">Cocok 5 Lowongan Baru</span>
          </div>
        </div>

      </div>

    </div>
  );
}
