'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import NotificationBell from './NotificationBell';
import { useTheme } from '@/lib/theme-context';

export default function NavClientControls() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/auth';
  const isRegisterParam = searchParams.get('register') === 'true';

  const navLinks = [
    { name: 'Dashboard Mahasiswa', href: '/dashboard', role: 'mahasiswa' },
    { name: 'Eksplorasi Lowongan', href: '/dashboard?tab=jobs' },
    { name: 'Tautkan GitHub', href: '/dashboard?tab=github' },
    { name: 'Lowongan Tersimpan', href: '/dashboard?tab=bookmarks' },
    { name: 'Admin Panel', href: '/admin', role: 'admin' },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'PM';
    const parts = name.trim().split(' ');
    const first = parts[0];
    const second = parts[1];
    if (first && second && first[0] && second[0]) {
      return `${first[0]}${second[0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    router.push('/');
  };

  const isMahasiswa = user?.role === 'mahasiswa' || (user?.role as any) === 'MAHASISWA';

  const landingNavItems = [
    { name: 'Beranda', href: '#hero' },
    { name: 'Fitur', href: '#features' },
    { name: 'Alur Kerja', href: '#workflow' },
    { name: 'Katalog Lowongan', href: '/projects' },
    { name: 'Testimoni', href: '#testimonials' },
  ];

  return (
    <>
      {/* Desktop Navigation: Landing Page (Matches Reference Navbar) */}
      {isLandingPage && (
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/70 border border-slate-200/70 rounded-full backdrop-blur-xs">
          {landingNavItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-white hover:shadow-xs transition-all"
            >
              {item.name}
            </a>
          ))}
          {user && (
            <Link
              href={isMahasiswa ? '/dashboard' : '/admin'}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all ml-1"
            >
              Dasbor Saya →
            </Link>
          )}
        </nav>
      )}

      {/* Desktop Navigation: Internal Pages */}
      {/* Desktop Navigation: Internal Pages */}
      {!isLandingPage && !isAuthPage && (
        <nav className="hidden md:flex items-center gap-1 p-1 bg-surface-container-low/80 border border-border-light rounded-full backdrop-blur-md">
          {user ? (
            navLinks.map((link) => {
              const isActive = pathname === link.href;
              if (link.role === 'admin' && isMahasiswa) return null;
              if (link.role === 'mahasiswa' && !isMahasiswa) return null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'text-primary bg-white shadow-xs border border-primary-light'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })
          ) : (
            <>
              <Link
                href="/projects"
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  pathname === '/projects'
                    ? 'text-primary bg-white shadow-xs border border-primary-light'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
                }`}
              >
                Katalog Proyek
              </Link>
              <Link
                href="/talents"
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  pathname === '/talents'
                    ? 'text-primary bg-white shadow-xs border border-primary-light'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-white/60'
                }`}
              >
                Direktori Talenta
              </Link>
            </>
          )}
        </nav>
      )}

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu trigger for landing page */}
        {isLandingPage && (
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-text-body hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}

        {!user ? (
          !isAuthPage ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/auth"
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${theme === 'light' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-200 hover:text-white hover:bg-white/10'}`}
            >
              Masuk
            </Link>
            <Link
              href="/auth?register=true"
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-primary-container hover:bg-primary-hover shadow-md shadow-purple-500/25 transition-all cursor-pointer"
            >
              Daftar Akun
            </Link>
          </div>
          ) : null
        ) : (
          <>
            {/* Real-time Notification Bell */}
            <NotificationBell />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 border-l border-border-light hover:opacity-90 transition-all text-left cursor-pointer"
                aria-label="Menu akun pengguna"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-xs font-bold text-text-heading leading-none max-w-[130px] truncate">
                    {user.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary bg-primary-light/70 px-2 py-0.5 rounded-full mt-1 border border-primary/20 uppercase">
                    {user.role}
                  </span>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-border-light p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-2.5">
                  <div className="p-2 border-b border-border-light/60">
                    <p className="text-xs font-extrabold text-text-heading">{user.name}</p>
                    <p className="text-[11px] text-text-muted truncate">{user.email}</p>
                    {user.nim && (
                      <p className="text-[10px] text-primary font-mono mt-0.5">NIM: {user.nim}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border-light/60 flex items-center justify-between px-1">
                    <Link
                      href={isMahasiswa ? '/dashboard' : '/admin'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Buka Dasbor
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {isAuthPage && (
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${theme === 'light' ? 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100' : 'text-purple-300 bg-purple-950/60 border-purple-500/30 hover:bg-purple-900/50 hover:text-white'}`}
          >
            ← Beranda
          </Link>
        )}
      </div>

      {/* Mobile Drawer/Dropdown for Landing Page */}
      {isLandingPage && mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-purple-100 shadow-xl p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="flex flex-col space-y-1">
            {landingNavItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                {item.name}
              </a>
            ))}
            {user && (
              <Link
                href={isMahasiswa ? '/dashboard' : '/admin'}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                Buka Dasbor Saya →
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
