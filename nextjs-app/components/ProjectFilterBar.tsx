'use client';

import React from 'react';

interface ProjectFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  minMatchScore: number;
  onMinMatchScoreChange: (score: number) => void;
}

export default function ProjectFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  minMatchScore,
  onMinMatchScoreChange,
}: ProjectFilterBarProps) {
  return (
    <div className="glass-card rounded-3xl p-6 border border-blue-100 shadow-md space-y-5">
      {/* Search Input & Minimum Match Slider */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Bar */}
        <div className="md:col-span-7 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul proyek, kata kunci, atau nama mitra industri..."
            className="w-full px-4 py-3 pl-11 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <svg
            className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Cosine Similarity Threshold Slider */}
        <div className="md:col-span-5 bg-blue-50/60 p-3 rounded-2xl border border-blue-100/80 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <span>🎯 Min. AI Match Score:</span>
            </span>
            <span className="text-blue-700 font-black">{minMatchScore}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={minMatchScore}
            onChange={(e) => onMinMatchScoreChange(Number(e.target.value))}
            className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold mr-1 shrink-0">Kategori:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
