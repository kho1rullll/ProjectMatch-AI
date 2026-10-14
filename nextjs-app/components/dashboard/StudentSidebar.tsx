'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Home, Briefcase, Bookmark, LogOut, ArrowLeft } from 'lucide-react';
import { Github } from '@/components/icons/GithubIcon';

export type DashboardTab = 'overview' | 'github' | 'jobs' | 'bookmarks';

interface StudentSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function StudentSidebar({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}: StudentSidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const studentName = user?.name || user?.full_name || 'Raden Satria';
  const nim = user?.nim || 'V3925028';

  const navItems: Array<{
    id: DashboardTab;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'overview', label: 'Ringkasan & Radar', icon: <Home className="w-4 h-4" /> },
    { id: 'github', label: 'Tautkan Akun GitHub', icon: <Github className="w-4 h-4" /> },
    { id: 'jobs', label: 'Eksplorasi Lowongan', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Lowongan Tersimpan', icon: <Bookmark className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: DashboardTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
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
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                P
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm tracking-tight block">
                  ProjectMatch <span className="text-blue-600">AI</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium -mt-0.5 block">
                  Portal Mahasiswa
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

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Mahasiswa (SKPL V12)
            </p>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
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

        {/* Bottom User Info & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              {studentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {studentName}
              </p>
              <p className="text-[11px] text-slate-500 font-mono truncate">
                NIM: {nim}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 font-medium">
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
