import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Code2, CheckCircle2, GitBranch } from 'lucide-react';

export default function HeroCtaBanner() {
  return (
    <div className="relative rounded-[2.5rem] bg-slate-950 p-8 sm:p-12 lg:p-14 text-white overflow-hidden shadow-2xl border border-slate-800/90">
      
      {/* Background Radial Glows */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* 2-Column Layout (Matches Reference Design) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Dual Tilted Mockup Cards */}
        <div className="lg:col-span-6 relative flex items-center justify-center py-6 sm:py-8">
          
          {/* Lime Accent Ring & Floating Dots */}
          <div className="absolute top-2 left-6 w-12 h-12 rounded-full bg-[#a3e635] opacity-80 blur-xs pointer-events-none animate-float-1" />
          <div className="absolute bottom-4 right-10 text-purple-400 text-xl font-bold pointer-events-none animate-pulse">✦</div>

          <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[220px] sm:h-[250px]">
            
            {/* Card 1 (Bottom Dark Navy/Purple Card) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-950/80 rounded-3xl p-5 border border-slate-700 shadow-xl flex flex-col justify-between -rotate-10 translate-y-6 -translate-x-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#a3e635]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                    Portofolio Terverifikasi
                  </span>
                </div>
                <span className="text-[9px] font-mono text-purple-300">Kandidat Mahasiswa</span>
              </div>
              <div className="my-2">
                <p className="text-[8px] uppercase tracking-widest text-slate-400 font-mono">REPOSITORI GITHUB</p>
                <p className="text-xs font-mono font-bold text-slate-200">github.com/radensatria/project-lab</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[9px] text-slate-400">
                <span>RADEN SATRIA</span>
                <span className="text-[#a3e635] font-bold">Top 5% Talent</span>
              </div>
            </div>

            {/* Card 2 (Top Holographic Iridescent Prism Card) */}
            <div className="absolute inset-0 holographic-card rounded-3xl p-5 shadow-2xl flex flex-col justify-between rotate-6 hover:rotate-2 transition-transform duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" className="w-8 h-8 rounded-xl object-contain shadow-xs" alt="ProjectMatch AI Logo" />
                  <span className="text-[11px] font-extrabold text-slate-900">
                    Project<span className="text-purple-600">Match</span> <span className="bg-[#84CC16] text-slate-950 font-black px-1.5 py-0.5 rounded text-[9px] ml-1">AI</span>
                  </span>
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  98.4% Match
                </span>
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-wider text-purple-800 font-mono">PROYEK REKOMENDASI</p>
                <p className="text-xs sm:text-sm font-extrabold text-slate-950 mt-0.5">
                  Full-Stack Platform &amp; Health Engine
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">Mitra: BioFarmanusa Research</p>
              </div>

              <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-[9px] text-purple-900 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Kualifikasi Sesuai</span>
                </span>
                <span className="text-purple-700">Terbuka untuk Mahasiswa</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: High-Impact Typography & Purple CTA (General Copy - Matches Request #7) */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" />
            <span>Akses Terbuka untuk Kampus &amp; Industri</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight leading-tight">
            Rancang Portofolio &amp; <span className="text-purple-400">Karier Digitalmu</span> Bersama AI
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Sistem cerdas AI siap menganalisis portofolio coding dan riwayat proyekmu dalam hitungan detik untuk mencocokkan lowongan industri yang paling relevan.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/projects"
              className="px-7 py-3.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/35 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Mulai Eksplorasi Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/post-project"
              className="px-6 py-3.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Pasang Lowongan Mitra →
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
