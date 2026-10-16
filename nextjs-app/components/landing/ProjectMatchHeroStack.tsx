import React from 'react';

export default function ProjectMatchHeroStack() {
  return (
    <div className="relative mx-auto w-full max-w-md pt-2 pb-6 group">
      {/* Ambient soft cyan/blue glow behind the stack */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[420px] h-36 bg-gradient-to-r from-blue-400/20 via-cyan-300/30 to-indigo-400/20 rounded-full blur-3xl pointer-events-none -z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-700"
      />

      <div className="relative animate-hero-stack">
        
        {/* Layer 3 - Bottom Card (Smart Campus Kiosk status) */}
        <div
          className="absolute inset-x-4 top-8 bg-white/95 rounded-2xl border border-slate-200/90 shadow-sm p-3 flex items-center justify-between text-left transition-all duration-300 pointer-events-none select-none z-10 translate-y-[16px] scale-[0.94] opacity-75 group-hover:translate-y-[36px] group-hover:scale-[0.96] group-hover:opacity-95"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 text-xs font-bold">
              📡
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800">Smart Kiosk RFID #01</p>
              <p className="text-[10px] text-slate-500">Lobby Riset • Standby Tap KTM</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Layer 2 - Middle Card (Hero RPG Competency) */}
        <div
          className="absolute inset-x-2 top-4 bg-white/95 rounded-2xl border border-slate-200/90 shadow-md p-3.5 flex items-center justify-between text-left transition-all duration-300 pointer-events-none select-none z-20 translate-y-[8px] scale-[0.97] opacity-90 group-hover:translate-y-[18px] group-hover:scale-[0.98] group-hover:opacity-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold">
              🎮
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900">Raden Satria</p>
                <span className="text-[9px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                  Hero Tier S
                </span>
              </div>
              <p className="text-[10px] text-slate-500">5D Radar: AI & Data (92), Frontend (85)</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Level 42</span>
        </div>

        {/* Layer 1 - Top Card (AI Semantic Match & Project Recommendation) */}
        <div
          className="relative bg-white rounded-2xl border border-slate-200/90 shadow-[0_12px_32px_-6px_rgba(15,23,42,0.1)] p-3.5 sm:p-4 text-left transition-all duration-300 cursor-default"
          style={{ zIndex: 30 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Partner Logo / Avatar with verified badge */}
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  BN
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[7px] text-white font-black">
                  ✓
                </span>
              </div>

              {/* Title & Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    BioInformatika Nusantara
                  </p>
                  <span className="text-[9px] text-slate-400 shrink-0">baru saja</span>
                </div>
                <p className="text-[11px] text-slate-600 truncate">
                  NLP &amp; Deep Learning Cancer Genomics
                </p>
              </div>
            </div>

            {/* Score Pill */}
            <div className="shrink-0 text-right">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                94.2% Match
              </span>
            </div>
          </div>

          {/* Sub-bar tags */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium text-slate-700">Python</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium text-slate-700">PyTorch</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">Cosine Vector</span>
            </div>
            <span className="text-blue-600 font-semibold hover:underline">Detail →</span>
          </div>
        </div>

      </div>
    </div>
  );
}
