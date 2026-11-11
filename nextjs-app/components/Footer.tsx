'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import BrandHeaderLink from './BrandLogo';

export default function Footer() {
  const pathname = usePathname();

  // Sembunyikan footer pada landing page (karena memiliki footer Stitch sendiri) serta dashboard
  if (pathname === '/' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/mitra')) {
    return null;
  }

  return (
    <footer className="bg-surface-dark text-surface-white border-t border-border-glass-dark mt-20 relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-60" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-container/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            <BrandHeaderLink href="/" variant="dark" size="md" />
            <p className="text-xs text-text-muted leading-relaxed font-normal">
              High-fidelity semantic matching uniting vetted engineering talent with institutional tech initiatives and deep-tech founders.
            </p>
            <div className="flex items-center gap-2 text-xs text-accent-lime-glow bg-surface-dark-subtle border border-accent-lime-glow/30 px-3 py-1.5 rounded-full w-fit font-bold">
              <span className="w-2 h-2 rounded-full bg-accent-lime-glow animate-pulse" />
              <span>Engine 4.2 Online</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Eksplorasi</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Beranda Utama</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">Katalog Proyek &amp; Lowongan</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Dasbor Mahasiswa</Link>
              </li>
              <li>
                <Link href="/talents" className="hover:text-white transition-colors">Direktori Talenta Kampus</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Fitur Unggulan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Teknologi Utama</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="text-purple-400 text-xs">✦</span>
                <span>Pencocokan Otomatis Cerdas</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-400 text-xs">✦</span>
                <span>Grafik Radar Portofolio Talenta</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-400 text-xs">✦</span>
                <span>Sinkronisasi Repositori GitHub</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-400 text-xs">✦</span>
                <span>Integrasi Ekosistem Kampus</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Keamanan & Kontak */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Akses Langsung</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mulai hubungkan repositori coding-mu dan dapatkan skor kecocokan matematis secara gratis.
            </p>
            <div>
              <Link
                href="/auth"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-primary-container hover:bg-primary-hover shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
              >
                <span>Masuk ke Akun</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Socials & Legal */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ProjectMatch AI. Hak Cipta Dilindungi.</p>
          
          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-white transition-colors">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter / X" className="hover:text-white transition-colors">
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Privasi Data</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Syarat &amp; Ketentuan</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
