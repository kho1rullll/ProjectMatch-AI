'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { Lock, Mail, User, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Github } from '@/components/icons/GithubIcon';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  useEffect(() => {
    setIsRegister(searchParams.get('register') === 'true');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      if (isRegister) {
        // FR-01: Registrasi mahasiswa baru dengan penautan GitHub
        const res = await api.auth.register({
          email: email.trim().toLowerCase(),
          password,
          full_name: fullName.trim(),
          nim: nim.trim().toUpperCase(),
          github_username: githubUsername.trim(),
        });

        await login(res.user.email, password);
        setFeedback({
          message: 'Akun Mahasiswa berhasil dibuat! Mengalihkan ke dasbor...',
          isError: false,
        });
        setTimeout(() => router.push('/dashboard'), 600);
      } else {
        // FR-01: Login dengan email & password
        await login(email.trim().toLowerCase(), password);
        setFeedback({
          message: 'Login berhasil! Mengalihkan...',
          isError: false,
        });

        const isUserAdmin = email.toLowerCase().includes('admin');
        setTimeout(() => {
          if (isUserAdmin) {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }, 500);
      }
    } catch (err: any) {
      setFeedback({
        message: err.message || (isRegister ? 'Registrasi gagal. Pastikan email/NIM belum terdaftar.' : 'Email atau kata sandi tidak valid.'),
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-blue-500/20">
            P
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isRegister ? 'Registrasi Mahasiswa (FR-01)' : 'Masuk ke Akun'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {isRegister
                ? 'Daftar dengan username GitHub publik untuk analisis kompetensi riil'
                : 'ProjectMatch AI: Otomatisasi Karier Digital Berbasis Repositori'}
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
              feedback.isError
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}
          >
            {feedback.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Register-only Fields (SKPL FR-01 & FR-02) */}
          {isRegister && (
            <>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Nama Lengkap Mahasiswa</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Raden Satria"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Nomor Induk Mahasiswa (NIM)</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: V3925028"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Username GitHub Publik (Portofolio)</label>
                <div className="relative">
                  <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="Contoh: kho1rullll"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Sesuai batasan SKPL, sistem mengambil repositori publik untuk sintesis keahlian (tanpa CV PDF).
                </p>
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@student.itb.ac.id atau admin@projectmatch.ac.id"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Kata Sandi (Argon2id)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all mt-3 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isRegister ? (
              'Daftar Akun Mahasiswa'
            ) : (
              'Masuk ke Akun'
            )}
          </button>
        </form>

        {/* Preset Akun Demo Cepat (Dari Panduan Sistem) */}
        {!isRegister && (
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
              Pilihan Akun Cepat (Panduan Sistem):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('satria@student.itb.ac.id')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 text-left transition-all cursor-pointer"
              >
                <p className="font-bold text-[11px] text-slate-900">🎓 Mahasiswa</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">satria@student.itb.ac.id</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('admin@projectmatch.ac.id')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-slate-700 text-left transition-all cursor-pointer"
              >
                <p className="font-bold text-[11px] text-slate-900">🛡️ Admin Kampus</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">admin@projectmatch.ac.id</p>
              </button>
            </div>
          </div>
        )}

        {/* Toggle Login/Register */}
        <div className="text-center pt-2 text-xs text-slate-500">
          {isRegister ? (
            <p>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => {
                  router.push('/auth');
                  setFeedback(null);
                }}
                className="font-bold text-blue-600 hover:underline cursor-pointer ml-1"
              >
                Masuk di sini
              </button>
            </p>
          ) : (
            <p>
              Mahasiswa baru?{' '}
              <button
                type="button"
                onClick={() => {
                  router.push('/auth?register=true');
                  setFeedback(null);
                }}
                className="font-bold text-blue-600 hover:underline cursor-pointer ml-1"
              >
                Daftar akun di sini
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <AuthForm />
    </Suspense>
  );
}
