'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, PRESET_ACCOUNTS, UserRole } from '@/lib/auth-context';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>('MAHASISWA');
  const [email, setEmail] = useState('satria@student.itb.ac.id');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  // Quick switch role default email
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'MAHASISWA') {
      setEmail(PRESET_ACCOUNTS.MAHASISWA.email);
    } else if (newRole === 'MITRA') {
      setEmail(PRESET_ACCOUNTS.MITRA.email);
    } else if (newRole === 'ADMIN') {
      setEmail(PRESET_ACCOUNTS.ADMIN.email);
    }
  };

  const handleQuickLogin = (targetRole: UserRole) => {
    const account = PRESET_ACCOUNTS[targetRole];
    setRole(targetRole);
    setEmail(account.email);
    setPassword('password123');
    login(targetRole, account.email);

    if (targetRole === 'ADMIN') {
      router.push('/admin');
    } else if (targetRole === 'MITRA') {
      router.push('/projects');
    } else {
      router.push('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      // Call authentication API
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isRegister ? 'register' : 'login',
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.success) {
        setFeedback({ message: data.error || 'Autentikasi gagal', isError: true });
        setLoading(false);
        return;
      }

      // Update Auth Context & Cookie
      login(role, email);

      setFeedback({ message: 'Login berhasil! Mengalihkan...', isError: false });

      setTimeout(() => {
        if (role === 'ADMIN') {
          router.push('/admin');
        } else if (role === 'MITRA') {
          router.push('/projects');
        } else {
          router.push('/dashboard');
        }
      }, 400);
    } catch {
      // Fallback local login if API is unreachable
      login(role, email);
      if (role === 'ADMIN') router.push('/admin');
      else if (role === 'MITRA') router.push('/projects');
      else router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-2xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-blue-500/25">
            P
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            {isRegister ? 'Buat Akun ProjectMatch' : 'Masuk ke ProjectMatch AI'}
          </h1>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Daftar untuk mengakses sistem Link & Match berbasis AI'
              : 'Pilih peran dan masuk untuk mengeksplorasi ekosistem riset industri'}
          </p>
        </div>

        {/* 1-Click Fast Demo Login Pills (account.text) */}
        <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800 text-center">
            ⚡ 1-Click Login Cepat (Akun Uji SKPL)
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => handleQuickLogin('MAHASISWA')}
              className="p-2 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition-all text-center shadow-xs cursor-pointer"
            >
              🎓 Mahasiswa
              <span className="block text-[8px] opacity-75 font-normal">Raden Satria</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('MITRA')}
              className="p-2 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white transition-all text-center shadow-xs cursor-pointer"
            >
              🏢 Mitra
              <span className="block text-[8px] opacity-75 font-normal">Dr. Hendra G.</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="p-2 rounded-xl bg-white border border-blue-200 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all text-center shadow-xs cursor-pointer"
            >
              🛡️ Admin
              <span className="block text-[8px] opacity-75 font-normal">Biro UNS</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              feedback.isError
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* 3-Role Switcher Pill */}
        <div className="grid grid-cols-3 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => handleRoleChange('MAHASISWA')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              role === 'MAHASISWA'
                ? 'bg-white text-blue-700 shadow-xs border border-blue-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎓 Mahasiswa
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('MITRA')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              role === 'MITRA'
                ? 'bg-white text-blue-700 shadow-xs border border-blue-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏢 Mitra
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('ADMIN')}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              role === 'ADMIN'
                ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛡️ Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === 'MAHASISWA'
                    ? 'Raden Satria'
                    : role === 'MITRA'
                    ? 'Dr. Hendra Gunawan'
                    : 'Admin Biro Kemahasiswaan'
                }
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700">
              {role === 'MAHASISWA'
                ? 'Email Kampus (.ac.id)'
                : role === 'MITRA'
                ? 'Email Perusahaan'
                : 'Email Administrator Kampus'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-700">
              <label>Kata Sandi</label>
              {!isRegister && (
                <span className="text-slate-400 text-[11px]">
                  Default: <code>password123</code>
                </span>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white btn-primary-shimmer shadow-lg hover:opacity-95 transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : isRegister ? (
              'Daftar Akun Sekarang'
            ) : role === 'ADMIN' ? (
              'Masuk ke Dasbor Admin'
            ) : role === 'MITRA' ? (
              'Masuk ke Portal Mitra'
            ) : (
              'Masuk ke Dashboard Mahasiswa'
            )}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          {isRegister ? (
            <p>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Masuk di sini
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Daftar sekarang
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
