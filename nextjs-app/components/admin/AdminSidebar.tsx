'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BarChart3, Users, ArrowLeft, LogOut, Shield } from 'lucide-react';
import BrandHeaderLink from '@/components/BrandLogo';
import { useTheme } from '@/lib/theme-context';

export type AdminTab = 'overview' | 'users';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isDim = theme === 'dim';

  const adminName = user?.name || user?.full_name || 'Biro Kemahasiswaan UNS';
  const adminEmail = user?.email || 'admin@projectmatch.ac.id';

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'overview',
      label: 'Monitoring & Statistik Agregasi',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'users',
      label: 'Manajemen Akun & Hak Akses',
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (tab: AdminTab) => {
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 backdrop-blur-xl border-r flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${isDark ? 'bg-[#0F172A]/95 border-white/10 text-white' : isDim ? 'bg-[#1E1038]/95 border-purple-500/20 text-purple-50' : 'bg-white/95 border-slate-200/80 text-slate-800'} ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className={`h-20 px-6 border-b flex items-center justify-between ${isDark ? 'border-white/10' : isDim ? 'border-purple-500/20' : 'border-slate-100'}`}>
            <BrandHeaderLink
              href="/"
              variant={theme === 'light' ? 'light' : 'dark'}
              size="md"
              subtitle={
                <span className="text-[10px] uppercase tracking-wider text-purple-600 font-extrabold flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Super Admin
                </span>
              }
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
              Administrasi Sistem
            </p>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-primary-container text-white shadow-md shadow-purple-500/25'
                      : isDark ? 'text-slate-300 hover:text-white hover:bg-white/10' : isDim ? 'text-purple-200 hover:text-white hover:bg-purple-900/40' : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/60'
                  }`}
                >
                  <span className="leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Admin User Info */}
        <div className={`p-4 space-y-3 ${
    isDark
      ? 'border-t border-white/10 bg-slate-900/60 text-white'
      : isDim
      ? 'border-t border-purple-500/20 bg-[#160c2b]/80 text-purple-50'
      : 'border-t border-slate-100 bg-slate-50/70 text-slate-900'
  }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-primary-container font-black text-xs flex items-center justify-center shrink-0 border border-purple-200/50">
              ADM
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : isDim ? 'text-purple-50' : 'text-slate-900'}`}>

                {adminName}
              </p>
              <p className={`text-[10px] truncate font-mono ${isDark ? 'text-slate-400' : isDim ? 'text-purple-300' : 'text-slate-500'}`}>

                {adminEmail}
              </p>
            </div>
          </div>

          <div className={`flex items-center justify-between text-xs pt-2 border-t font-semibold ${isDark ? 'border-white/10' : isDim ? 'border-purple-500/20' : 'border-slate-200/60'}`}>

            <Link
              href="/"
              className={`transition-colors flex items-center gap-1.5 ${isDark ? 'text-slate-300 hover:text-white' : isDim ? 'text-purple-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-primary-container" />
              <span>Beranda</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
