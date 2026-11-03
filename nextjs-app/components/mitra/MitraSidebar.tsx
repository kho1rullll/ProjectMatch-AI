'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import BrandHeaderLink from '@/components/BrandLogo';

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Logo & Nav Links */}
        <div>
          {/* Header Brand */}
          <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between">
            <BrandHeaderLink
              href="/"
              variant="light"
              size="md"
              subtitle={<span className="text-[10px] uppercase tracking-wider text-purple-600 font-extrabold block">Portal Mitra Industri</span>}
            />

            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer"
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-primary-container text-white shadow-md shadow-purple-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base leading-none">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-lime-100 text-lime-900 border border-lime-300'
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-container to-indigo-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md shadow-purple-500/20">
              {partnerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {partnerName}
              </p>
              <p className="text-[10px] text-primary-container font-extrabold truncate">
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
