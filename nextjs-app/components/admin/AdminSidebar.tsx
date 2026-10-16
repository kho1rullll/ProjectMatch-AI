'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BarChart3, Users, ArrowLeft, LogOut, Shield } from 'lucide-react';

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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                P
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm tracking-tight block">
                  ProjectMatch <span className="text-indigo-600">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-indigo-600 font-bold -mt-0.5 block flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Super Admin
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              aria-label="Tutup menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Administrasi Sistem (FR-11, FR-12)
            </p>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
              ADM
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {adminName}
              </p>
              <p className="text-[10px] text-slate-500 truncate font-mono">
                {adminEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 font-semibold">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-700 transition-colors cursor-pointer flex items-center gap-1"
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
