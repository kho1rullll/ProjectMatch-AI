import React from 'react';
import { Bot, Gamepad2, GitFork, Radio } from 'lucide-react';

export default function HeroFeaturesGrid() {
  const features = [
    {
      id: 'ai-match',
      title: 'Pencocokan Cerdas',
      desc: 'Sistem cerdas memetakan riwayat portofolio kode dan keahlian mahasiswa ke kualifikasi proyek secara instan.',
      badgeColor: 'from-purple-600 to-indigo-600',
      badgeShadow: 'shadow-purple-500/30',
      icon: <Bot className="w-6 h-6 text-white" />,
      accentLabel: 'Presisi Tinggi',
      accentStyle: 'text-purple-700 bg-purple-50 border-purple-200',
    },
    {
      id: 'rpg-radar',
      title: 'Radar Kompetensi',
      desc: 'Visualisasi grafik kompetensi interaktif untuk memetakan tingkat keahlian teknis secara komprehensif.',
      badgeColor: 'from-lime-400 to-emerald-500',
      badgeShadow: 'shadow-lime-400/30',
      icon: <Gamepad2 className="w-6 h-6 text-slate-900" />,
      accentLabel: 'Evaluasi 5 Dimensi',
      accentStyle: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'github-sync',
      title: 'Sinkronisasi Otomatis',
      desc: 'Ekstraksi riwayat repositori, kontribusi proyek, dan keahlian mahasiswa secara otomatis tanpa pengisian manual.',
      badgeColor: 'from-indigo-600 to-purple-600',
      badgeShadow: 'shadow-indigo-500/30',
      icon: <GitFork className="w-6 h-6 text-white" />,
      accentLabel: 'Otomatisasi Penuh',
      accentStyle: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      id: 'campus-kiosk',
      title: 'Verifikasi Kampus',
      desc: 'Verifikasi identitas dan status akademik terpadu yang terhubung langsung dengan ekosistem kampus.',
      badgeColor: 'from-emerald-400 to-teal-500',
      badgeShadow: 'shadow-teal-400/30',
      icon: <Radio className="w-6 h-6 text-white" />,
      accentLabel: 'Terintegrasi Kampus',
      accentStyle: 'text-teal-700 bg-teal-50 border-teal-200',
    },
  ];

  return (
    <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 scroll-mt-24 relative">
      
      {/* Micro Accents: Sparkles & Squiggles */}
      <div className="absolute top-2 left-8 text-purple-400 text-lg font-bold pointer-events-none select-none">✦</div>
      <div className="absolute top-12 right-12 text-[#84cc16] text-xl font-bold pointer-events-none select-none">✦</div>
      <div className="absolute bottom-4 left-1/3 text-indigo-400 text-sm font-bold pointer-events-none select-none">✦</div>

      {/* Header (Matches Reference "What we provide?") */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 font-display tracking-tight">
          What <span className="text-purple-600">we provide?</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Solusi cerdas berbasis kecerdasan buatan untuk akselerasi karier digital dan pencocokan proyek talenta mahasiswa secara akurat.
        </p>
      </div>

      {/* 4 Capsule Cards Container with Purple Wave Ribbon Background */}
      <div className="relative py-4">
        
        {/* Purple Ribbon / Wave flowing behind the 4 capsule cards (Matches Reference) */}
        <div 
          className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-[50px] shadow-xl shadow-purple-600/25 pointer-events-none -z-0 opacity-95 transform -rotate-1 scale-x-105"
          aria-hidden="true"
        />

        {/* 4 Vertical Capsule/Pill Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {features.map((item) => (
            <div
              key={item.id}
              className="capsule-card rounded-[44px] bg-white p-7 sm:p-8 flex flex-col items-center text-center justify-between min-h-[340px] border border-purple-100/90 shadow-xl shadow-purple-500/5 group hover:-translate-y-3 transition-all duration-300"
            >
              {/* Top 3D-styled Glowing Circular Badge */}
              <div className="space-y-4 flex flex-col items-center">
                <div 
                  className={`w-16 h-16 rounded-full bg-gradient-to-tr ${item.badgeColor} flex items-center justify-center shadow-lg ${item.badgeShadow} group-hover:scale-110 transition-transform duration-300 ring-4 ring-white`}
                >
                  {item.icon}
                </div>

                {/* Status Pill Badge */}
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.accentStyle}`}>
                  {item.accentLabel}
                </span>

                {/* Card Title */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-display tracking-tight group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Card Description */}
              <p className="text-xs text-slate-600 leading-relaxed font-normal mt-3">
                {item.desc}
              </p>

              {/* Bottom Decorative Indicator */}
              <div className="pt-4 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                <span className="text-[10px] font-bold text-purple-600 group-hover:underline">
                  Pelajari Fitur →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
