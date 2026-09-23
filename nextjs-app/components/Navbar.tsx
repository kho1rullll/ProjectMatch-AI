import React from 'react';
import Link from 'next/link';
import NavClientControls from './NavClientControls';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/60 bg-white/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Beranda ProjectMatch AI">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-xs group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <span className="font-display font-black text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-1">
                ProjectMatch <span className="gradient-text-blue">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 block -mt-1">
                Link &amp; Match System
              </span>
            </div>
          </Link>
        </div>

        {/* Client Interactive Controls: Links, User Menu, Dropdowns, Mobile Menu */}
        <NavClientControls />
      </div>
    </header>
  );
}
