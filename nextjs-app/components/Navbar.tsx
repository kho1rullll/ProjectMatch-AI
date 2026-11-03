'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NavClientControls from './NavClientControls';
import BrandHeaderLink from './BrandLogo';
import { useTheme } from '@/lib/theme-context';

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  // Sembunyikan topbar pada halaman landing page (karena memiliki header Stitch sendiri) serta dashboard
  if (pathname === '/' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/mitra')) {
    return null;
  }

  const isDark = theme === 'dark';
  const isDim = theme === 'dim';

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 pb-1">
      <div
        className={`max-w-7xl mx-auto h-16 sm:h-20 backdrop-blur-md rounded-full px-4 sm:px-6 flex items-center justify-between border transition-all duration-300 ${
          isDark
            ? 'bg-[#0B0F19]/80 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white'
            : isDim
            ? 'bg-[#140b27]/80 border-purple-500/25 shadow-[0_8px_32px_rgba(88,28,135,0.3)] text-purple-50'
            : 'bg-white/85 border-border-light shadow-[0_1px_8px_rgba(15,23,42,0.06)] text-slate-800'
        }`}
      >
        {/* Brand Logo & Title */}
        <BrandHeaderLink href="/" variant={theme === 'light' ? 'light' : 'dark'} size="md" />

        {/* Client Interactive Controls */}
        <React.Suspense fallback={<div className="w-24 h-8" />}>
          <NavClientControls />
        </React.Suspense>
      </div>
    </header>
  );
}
