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
    <div className="bg-surface-white/95 backdrop-blur-xl rounded-3xl p-6 border border-border-light shadow-[0_10px_30px_rgba(15,23,42,0.04)] space-y-5">
      {/* Search Input & Minimum Match Slider */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Bar */}
        <div className="md:col-span-7 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari judul proyek, kata kunci, atau nama mitra industri..."
            className="w-full px-5 py-3.5 pl-12 rounded-full bg-surface-container-low/60 border border-border-light text-xs font-semibold text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container focus:bg-white transition-all"
          />
          <svg
            className="w-4 h-4 absolute left-4.5 top-1/2 -translate-y-1/2 text-text-muted"
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
        <div className="md:col-span-5 bg-primary-light/40 p-3.5 rounded-2xl border border-primary/15 space-y-2">
          <div className="flex justify-between text-xs font-bold text-text-heading">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span>Min. AI Match Score:</span>
            </span>
            <span className="text-primary font-extrabold">{minMatchScore}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={minMatchScore}
            onChange={(e) => onMinMatchScoreChange(Number(e.target.value))}
            className="w-full accent-primary-container h-1.5 bg-surface-container-high rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-text-muted font-bold mr-1 shrink-0">Kategori:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-primary-container text-white shadow-md shadow-purple-500/20'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
