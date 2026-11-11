import React from 'react';
import { Building2, Dna, Radio, Cloud, GraduationCap, Award, Cpu, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export default function HeroMetricsBar() {
  const partners = [
    {
      name: 'Kemendikbudristek',
      logo: (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 8.5L4.5 7 12 3.5 19.5 7 12 10.5zm-8 4.2v3.8c0 2.2 3.6 4 8 4s8-1.8 8-4v-3.8l-8 4-8-4z"/>
        </svg>
      ),
    },
    {
      name: 'Politeknik Negeri',
      logo: <GraduationCap className="w-4 h-4 text-purple-400" />,
    },
    {
      name: 'BioFarmanusa',
      logo: <Dna className="w-4 h-4 text-emerald-400" />,
    },
    {
      name: 'Telkom Digital',
      logo: <Radio className="w-4 h-4 text-rose-400" />,
    },
    {
      name: 'GitHub Campus',
      logo: <GithubIcon className="w-4 h-4 text-white" />,
    },
    {
      name: 'AWS Academy',
      logo: <Cloud className="w-4 h-4 text-amber-300" />,
    },
    {
      name: 'Astra Ventura',
      logo: <Building2 className="w-4 h-4 text-cyan-400" />,
    },
    {
      name: 'Nusantara AI',
      logo: <Cpu className="w-4 h-4 text-[#a3e635]" />,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Dark Navy Contrast Box */}
      <div className="rounded-[2.5rem] bg-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-800 relative overflow-hidden space-y-7">
        
        {/* Glow ambient inside dark banner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header Centered (Matches Request #5) */}
        <div className="text-center w-full space-y-1 relative z-10">
          <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold text-slate-200">
            <span className="text-[#a3e635] text-base">✦</span>
            <span>Dipercaya oleh Mitra Kampus &amp; Industri Terkemuka</span>
            <span className="text-[#a3e635] text-base">✦</span>
          </div>
        </div>

        {/* 2. Infinite Marquee Scrolling from Right to Left with Logos & No Parentheses (Matches Request #5) */}
        <div className="relative w-full overflow-hidden py-2 border-y border-slate-800/80">
          {/* Subtle edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track: Duplicated list for seamless looping */}
          <div className="animate-marquee gap-8 sm:gap-12 items-center">
            {[...partners, ...partners].map((p, idx) => (
              <div 
                key={`${p.name}-${idx}`} 
                className="flex items-center gap-2.5 text-slate-300 hover:text-white shrink-0 transition-colors cursor-default"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-center p-1 shrink-0">
                  {p.logo}
                </div>
                <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white whitespace-nowrap">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 4 High-Contrast White Metric Indicator Cards (General & Clean Copy) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10 pt-1">
          <div className="bg-white text-slate-900 rounded-2xl sm:rounded-full py-4 px-5 sm:px-6 shadow-md border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 transition-transform hover:-translate-y-1">
            <span className="text-2xl sm:text-3xl font-black font-display text-slate-950">1.240+</span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Mahasiswa Aktif</span>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl sm:rounded-full py-4 px-5 sm:px-6 shadow-md border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 transition-transform hover:-translate-y-1">
            <span className="text-2xl sm:text-3xl font-black font-display text-purple-600">890+</span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Proyek Cocok</span>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl sm:rounded-full py-4 px-5 sm:px-6 shadow-md border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 transition-transform hover:-translate-y-1">
            <span className="text-2xl sm:text-3xl font-black font-display text-emerald-600">94.2%</span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Akurasi AI Match</span>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl sm:rounded-full py-4 px-5 sm:px-6 shadow-md border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 transition-transform hover:-translate-y-1">
            <span className="text-2xl sm:text-3xl font-black font-display text-[#65a30d]">100+</span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Mitra Industri &amp; Lab</span>
          </div>
        </div>

      </div>
    </section>
  );
}
