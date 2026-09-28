'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export type MitraTab = 'overview' | 'my-projects' | 'post-project' | 'applicants' | 'talents';

interface MitraSidebarProps {
  activeTab: MitraTab;
  onSelectTab: (tab: MitraTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  pendingApplicantsCount?: number;
}

export default function MitraSidebar({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  pendingApplicantsCount = 0,
}: MitraSidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const partnerName = user?.name || 'Dr. Hendra Gunawan';
  const companyName = user?.organization || 'BioInformatika Nusantara';

  const navItems: Array<{
    id: MitraTab;
    label: string;
    icon: string;
    badge?: number | string;
  }> = [
    { id: 'overview', label: 'Ringkasan & Metrik', icon: '📊' },
    { id: 'my-projects', label: 'Lowongan Proyek Saya', icon: '💼' },
    { id: 'post-project', label: 'Pasang Lowongan Baru', icon: '➕' },
    {
      id: 'applicants',
      label: 'Tinjau Pelamar Mahasiswa',
      icon: '👥',
      badge: pendingApplicantsCount > 0 ? pendingApplicantsCount : undefined,
    },
    { id: 'talents', label: 'Eksplorasi Talenta 5D', icon: '🎯' },
  ];

  const handleNavClick = (tab: MitraTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Logo & Nav Links */}
        <div>
          {/* Header Brand */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
                P
              </div>
              <div>
                <span className="font-display font-black text-slate-900 text-sm tracking-tight block">
                  ProjectMatch <span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold -mt-0.5 block">
                  Portal Mitra Industri
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Tutup menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Navigasi Mitra
            </p>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base leading-none">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Partner User Info & Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {partnerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {partnerName}
              </p>
              <p className="text-[10px] text-blue-600 font-semibold truncate">
                {companyName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 font-semibold">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Beranda
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
