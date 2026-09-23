import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md">
                P
              </div>
              <span className="font-display font-black text-lg text-white tracking-tight">
                ProjectMatch <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform Link & Match generasi baru berbasis inferensi AI, menghubungkan talenta akademis dengan ekosistem riset dan industri global.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Sistem AI Operational (v2.4)</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Eksplorasi</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Dashboard Mahasiswa</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">Katalog Proyek & Lowongan</Link>
              </li>
              <li>
                <Link href="/post-project" className="hover:text-white transition-colors">Pasang Lowongan Industri</Link>
              </li>
              <li>
                <Link href="/projects?category=ai" className="hover:text-white transition-colors">Proyek Riset AI Terbuka</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Fitur Unggulan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fitur Unggulan</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">Hero RPG 5D Radar Stats</span>
              </li>
              <li>
                <span className="text-slate-400">Cosine Similarity Matching</span>
              </li>
              <li>
                <span className="text-slate-400">Multi-Dimensional Scoring</span>
              </li>
              <li>
                <span className="text-slate-400">Smart Contract Verification</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Keamanan & Kontak */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Keamanan & Legalitas</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data portofolio dan proyek dienkripsi dengan standar industri untuk melindungi hak cipta dan privasi pengguna.
            </p>
            <div className="pt-2">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
              >
                Mulai Registrasi Akun
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ProjectMatch AI. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <span>Privasi Data</span>
            <span>Syarat & Ketentuan</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
