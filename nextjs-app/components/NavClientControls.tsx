'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import NotificationBell from './NotificationBell';

export default function NavClientControls() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, switchAccount, logout } = useAuth();

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

  const handleSwitchRole = (role: 'mahasiswa' | 'admin') => {
    switchAccount(role);
    setProfileDropdownOpen(false);
    if (role === 'mahasiswa') router.push('/dashboard');
    else if (role === 'admin') router.push('/admin');
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    router.push('/');
  };

  const isMahasiswa = user?.role === 'mahasiswa' || (user?.role as any) === 'MAHASISWA';

  return (
    <>
      {/* Desktop Navigation: Landing Page */}
      {isLandingPage && user && (
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <Link
            href={isMahasiswa ? '/dashboard' : '/admin'}
            className="text-blue-600 font-bold hover:underline"
          >
            Buka Dasbor Saya →
          </Link>
        </nav>
      )}

      {/* Desktop Navigation: Internal Pages */}
      {!isLandingPage && !isAuthPage && (
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/70 border border-slate-200/80 rounded-2xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            if (link.role === 'admin' && isMahasiswa) return null;
            if (link.role === 'mahasiswa' && !isMahasiswa) return null;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'text-blue-700 bg-white shadow-xs border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Right Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {!user ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/auth"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Masuk
            </Link>
            <Link
              href="/auth?register=true"
              className="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all cursor-pointer"
            >
              Daftar Akun
            </Link>
          </div>
        ) : (
          <>
            {/* Real-time Notification Bell */}
            <NotificationBell />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 border-l border-slate-200 hover:opacity-90 transition-all text-left cursor-pointer"
                aria-label="Menu akun pengguna"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-xs font-bold text-slate-900 leading-none max-w-[130px] truncate">
                    {user.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md mt-1 border border-blue-100 uppercase">
                    {user.role}
                  </span>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-blue-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-2">
                  <div className="p-2 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    {user.nim && (
                      <p className="text-[10px] text-blue-600 font-mono mt-0.5">NIM: {user.nim}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-1">
                      Pindah Peran (Demo Test)
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('mahasiswa')}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        isMahasiswa ? 'bg-blue-50 font-bold text-blue-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>🎓 Raden Satria (Mahasiswa)</span>
                      {isMahasiswa && <span className="text-blue-600 font-bold">✓</span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('admin')}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        !isMahasiswa ? 'bg-indigo-50 font-bold text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>🛡️ Biro Kampus (Admin)</span>
                      {!isMahasiswa && <span className="text-indigo-600 font-bold">✓</span>}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                    <Link
                      href={isMahasiswa ? '/dashboard' : '/admin'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="text-xs text-blue-600 font-bold hover:underline"
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
            className="px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all"
          >
            ← Beranda
          </Link>
        )}
      </div>
    </>
  );
}
