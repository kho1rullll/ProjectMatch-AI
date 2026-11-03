'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function HeroTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Raden Satria',
      role: 'Mahasiswa Teknik Informatika • BioFarmanusa Intern',
      avatarBg: 'bg-gradient-to-tr from-purple-600 to-indigo-600',
      initials: 'RS',
      content:
        'Berkat integrasi repositori GitHub, skor kecocokan AI langsung memetakan portofolio proyek coding saya ke proyek riset BioFarmanusa. Proses seleksi jadi instan, transparan, dan objektif!',
      date: 'Oktober 2026',
      rating: 5,
    },
    {
      id: 2,
      name: 'Putri Utami',
      role: 'UI/UX & Frontend Developer • Telkom Digital',
      avatarBg: 'bg-gradient-to-tr from-lime-500 to-emerald-600',
      initials: 'PU',
      content:
        'Visualisasi radar kompetensi membuat portofolio desain dan frontend saya terlihat sangat memikat di mata mitra industri. Rekomendasi proyek AI sangat presisi dengan skill riil saya.',
      date: 'November 2026',
      rating: 5,
    },
    {
      id: 3,
      name: 'Dr. Irfan Pratama',
      role: 'Mitra Industri • Nusantara Research Lab',
      avatarBg: 'bg-gradient-to-tr from-blue-600 to-cyan-500',
      initials: 'IP',
      content:
        'ProjectMatch AI memangkas waktu screening kandidat riset hingga 80%. Kami menemukan talenta mahasiswa dengan kompetensi coding yang terverifikasi tanpa review ratusan CV manual.',
      date: 'Desember 2026',
      rating: 5,
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
      
      {/* Micro Accents */}
      <div className="absolute -top-4 left-10 text-slate-800 text-sm font-bold pointer-events-none select-none">✦</div>
      <div className="absolute top-8 right-16 text-purple-400 text-lg font-bold pointer-events-none select-none">✦</div>
      <div className="absolute bottom-6 left-1/4 text-[#84cc16] text-xl font-bold pointer-events-none select-none">✦</div>

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 font-display tracking-tight">
          What our <span className="text-purple-600">Talent say</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal flex items-center justify-center flex-wrap gap-1">
          <span>Pengalaman nyata mahasiswa dan mitra industri yang terhubung melalui</span>
          <span className="font-extrabold text-slate-900">Project<span className="text-purple-600">Match</span></span>
          <span className="bg-[#84CC16] text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded ml-0.5">AI</span>
        </p>
      </div>

      {/* Testimonials Grid with Navigation Buttons */}
      <div className="relative flex items-center justify-between gap-4">
        
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Ulasan sebelumnya"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 text-white hover:bg-purple-600 flex items-center justify-center shrink-0 shadow-md transition-all cursor-pointer z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {testimonials.map((item, idx) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between shadow-lg ${
                activeIndex === idx
                  ? 'border-purple-300 shadow-purple-500/10 -translate-y-1'
                  : 'border-slate-200/90 hover:border-purple-200'
              }`}
            >
              {/* Header: Avatar, Name & Rating */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}>
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Body */}
                <p className="text-xs text-slate-600 leading-relaxed font-normal italic">
                  "{item.content}"
                </p>
              </div>

              {/* Date */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>{item.date}</span>
                <span className="text-purple-600 font-bold">Terverifikasi ✓</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Ulasan berikutnya"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 text-white hover:bg-purple-600 flex items-center justify-center shrink-0 shadow-md transition-all cursor-pointer z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              activeIndex === i ? 'w-6 bg-purple-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

    </section>
  );
}
