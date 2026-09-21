'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth-context';

export default function NavClientControls() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchAccount, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/auth';

  const navLinks = [
    { name: 'Dashboard Mahasiswa', href: '/dashboard', role: 'MAHASISWA' },
    { name: 'Eksplorasi Proyek', href: '/projects' },
    { name: 'Pasang Lowongan', href: '/post-project', role: 'MITRA' },
    { name: 'Admin Panel', href: '/admin', role: 'ADMIN' },
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

  const handleSwitchRole = (role: UserRole) => {
    switchAccount(role);
    setProfileDropdownOpen(false);
    if (role === 'MAHASISWA') router.push('/dashboard');
    else if (role === 'MITRA') router.push('/projects');
    else if (role === 'ADMIN') router.push('/admin');
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    router.push('/');
  };

  return (
    <>
      {/* Desktop Navigation: Halaman Landing Page */}
      {isLandingPage && (
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Solusi AI
          </a>
          <a href="#hero-rpg" className="hover:text-slate-900 transition-colors">
            Hero RPG
          </a>
          <Link href="/projects" className="hover:text-slate-900 transition-colors">
            Eksplorasi Proyek
          </Link>
          <a href="#workflow" className="hover:text-slate-900 transition-colors">
            Alur Kerja
          </a>
          {user && (
            <Link
              href={user.role === 'MAHASISWA' ? '/dashboard' : user.role === 'ADMIN' ? '/admin' : '/projects'}
              className="text-blue-600 font-bold hover:underline"
            >
              Dasbor Saya →
            </Link>
          )}
        </nav>
      )}

      {/* Desktop Navigation: Halaman Internal Aplikasi */}
      {!isLandingPage && !isAuthPage && (
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/70 border border-slate-200/80 rounded-2xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isRecommended = link.role && user?.role === link.role;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  isActive
                    ? 'text-blue-700 bg-white shadow-xs border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {link.name}
                {isRecommended && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* JIKA USER BELUM LOGIN */}
        {!user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Masuk
            </Link>
            <Link
              href="/auth?register=true"
              className={
                isLandingPage
                  ? 'px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 shadow-xs transition-all cursor-pointer'
                  : 'px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all cursor-pointer'
              }
            >
              Daftar Akun
            </Link>
          </div>
        ) : (
          /* JIKA USER SUDAH LOGIN */
          <>
            {/* Notification Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setProfileDropdownOpen(false);
                }}
                className="relative p-2.5 rounded-xl glass-card text-slate-600 hover:text-blue-600 hover:bg-white transition-all cursor-pointer"
                aria-label="Notifikasi"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  3
                </span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-blue-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <h4 className="text-xs font-bold text-slate-900">Notifikasi Terkini</h4>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">3 Baru</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100/70">
                      <p className="font-bold text-slate-900">Match 94% Ditemukan!</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">BioInformatika Nusantara memposting proyek NLP sesuai keahlianmu.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="font-bold text-slate-900">Kiosk ESP32 + RC522 Terhubung</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">Smart Kiosk Lobby Utama aktif dan siap melayani tap KTM.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill with Switcher & Logout Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-2.5 pl-2 border-l border-slate-200 hover:opacity-90 transition-all text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-xs shadow-sm ring-2 ring-white">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-xs font-bold text-slate-900 leading-none max-w-[130px] truncate">
                    {user.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md mt-1 border border-blue-100">
                    {user.badge || 'Hero Tier S'}
                  </span>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-blue-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-2">
                  <div className="p-2 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{user.organization}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1">
                      Ganti Peran Akun (Demo Test)
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('MAHASISWA')}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        user.role === 'MAHASISWA' ? 'bg-blue-50 font-bold text-blue-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>🎓 Raden Satria (Mahasiswa)</span>
                      {user.role === 'MAHASISWA' && <span className="text-blue-600">✓</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('MITRA')}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        user.role === 'MITRA' ? 'bg-blue-50 font-bold text-blue-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>🏢 Dr. Hendra Gunawan (Mitra)</span>
                      {user.role === 'MITRA' && <span className="text-blue-600">✓</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('ADMIN')}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        user.role === 'ADMIN' ? 'bg-blue-50 font-bold text-blue-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>🛡️ Biro Kemahasiswaan (Admin)</span>
                      {user.role === 'ADMIN' && <span className="text-blue-600">✓</span>}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                    <Link
                      href={user.role === 'MAHASISWA' ? '/dashboard' : user.role === 'ADMIN' ? '/admin' : '/projects'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Ke Dasbor Saya
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Logout (Keluar)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button (internal page) */}
            {!isLandingPage && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl glass-card text-slate-700"
                aria-expanded={mobileMenuOpen}
                aria-label="Buka menu navigasi"
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

            {/* Mobile Menu Toggle Button for Landing Page */}
            {isLandingPage && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-expanded={mobileMenuOpen}
                aria-label="Buka menu navigasi"
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
          </>
        )}

        {isAuthPage && (
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all"
          >
            ← Kembali ke Beranda
          </Link>
        )}
      </div>

      {/* Mobile Navigation Dropdown for Landing Page */}
      {isLandingPage && mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 w-full bg-white/95 border-b border-slate-200 shadow-xl backdrop-blur-xl px-4 py-3 space-y-1.5 text-xs font-semibold z-50">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            Solusi AI
          </a>
          <a
            href="#hero-rpg"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            Hero RPG
          </a>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            Eksplorasi Proyek
          </Link>
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50"
          >
            Alur Kerja
          </a>
        </div>
      )}

      {/* Mobile Navigation Dropdown (Internal page) */}
      {!isLandingPage && !isAuthPage && mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 w-full px-4 pt-2 pb-4 space-y-1.5 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-xl z-50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isActive
                    ? 'text-blue-700 bg-blue-50 border border-blue-100'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
