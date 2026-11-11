'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { Lock, Mail, User, BookOpen, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Github } from '@/components/icons/GithubIcon';
import Link from 'next/link';
import { BrandLogo, BrandTitle } from '@/components/BrandLogo';
import { useTheme } from '@/lib/theme-context';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isDim = theme === 'dim';

  const isRegister = searchParams.get('register') === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean; suggestLogin?: boolean } | null>(null);

  const switchAuthMode = (registerMode: boolean) => {
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFeedback(null);
    router.push(registerMode ? '/auth?register=true' : '/auth');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (isRegister) {
      if (password.length < 6) {
        setFeedback({ message: 'Kata sandi minimal terdiri dari 6 karakter.', isError: true });
        return;
      }
      if (password !== confirmPassword) {
        setFeedback({ message: 'Konfirmasi kata sandi tidak sama dengan kata sandi.', isError: true });
        return;
      }
    }

    setLoading(true);

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
        const loggedUser = await login(email.trim().toLowerCase(), password);
        setFeedback({
          message: 'Login berhasil! Mengalihkan...',
          isError: false,
        });

        const isUserAdmin = loggedUser?.role?.toLowerCase() === 'admin';
        setTimeout(() => {
          if (isUserAdmin) {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }, 500);
      }
    } catch (err: any) {
      let rawMsg = err.message || (isRegister ? 'Registrasi gagal. Pastikan email/NIM belum terdaftar.' : 'Email atau kata sandi tidak valid.');
      let suggestLogin = false;
      if (rawMsg === 'Failed to fetch' || rawMsg.includes('Failed to fetch')) {
        rawMsg = 'Gagal terhubung ke server backend FastAPI (Port 8000). Pastikan backend aktif.';
      } else if (isRegister && rawMsg.toLowerCase().includes('sudah terdaftar')) {
        suggestLogin = true;
      } else if (!isRegister && (err?.status === 401 || rawMsg.toLowerCase().includes('tidak valid'))) {
        rawMsg = 'Email atau kata sandi tidak valid. Periksa kembali ejaan sandi lewat ikon mata, atau hubungi Administrator untuk reset sandi jika lupa.';
      }
      setFeedback({
        message: rawMsg,
        isError: true,
        suggestLogin,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-primary-light/60 rounded-full blur-3xl opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-12 -right-20 w-[28rem] h-[28rem] bg-secondary-container/25 rounded-full blur-3xl opacity-50" aria-hidden="true" />

      <div className={`max-w-md w-full backdrop-blur-xl rounded-3xl p-6 sm:p-9 border space-y-6 relative z-10 transition-all duration-300 ${
    isDark
      ? 'bg-[#0F172A]/90 border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
      : isDim
      ? 'bg-[#1A1030]/90 border-purple-500/25 text-purple-50 shadow-[0_20px_50px_rgba(88,28,135,0.25)]'
      : 'bg-white/95 border-border-light text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.08)]'
  }`}>
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2.5 mb-2 group">
            <BrandLogo size="md" />
            <BrandTitle variant={theme === 'light' ? 'light' : 'dark'} size="lg" />
          </Link>
          <div>
            <h1 className={`text-2xl font-headline-md font-extrabold tracking-tight ${isDark ? 'text-white' : isDim ? 'text-purple-50' : 'text-slate-900'}`}>
              {isRegister ? 'Registrasi Mahasiswa' : 'Masuk ke Akun'}
            </h1>
            <p className={`text-xs mt-1 max-w-xs mx-auto leading-relaxed ${isDark ? 'text-slate-400' : isDim ? 'text-purple-300' : 'text-slate-500'}`}>
              {isRegister
                ? 'Daftar dengan username GitHub publik untuk analisis kompetensi riil'
                : 'ProjectMatch AI: Otomatisasi Karier Digital Berbasis Repositori'}
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-semibold flex flex-col gap-2 ${
              feedback.isError
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {feedback.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
            {feedback.suggestLogin && (
              <button
                type="button"
                onClick={() => switchAuthMode(false)}
                className="self-start ml-6 text-[11px] font-bold text-primary-container hover:underline cursor-pointer"
              >
                Lanjut ke halaman Masuk ke Akun →
              </button>
            )}
          </div>
        )}

        {/* Form */}
        <form key={isRegister ? 'register-form' : 'login-form'} onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Register-only Fields (SKPL FR-01 & FR-02) */}
          {isRegister && (
            <>
              <div className="space-y-1.5">
                <label className={`font-bold block ${isDark ? 'text-slate-200' : isDim ? 'text-purple-200' : 'text-slate-900'}`}>Nama Lengkap Mahasiswa</label>
                <div className="relative">
                  <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Nama Mahasiswa"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border transition-all ${
      isDark
        ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-purple-500'
        : isDim
        ? 'bg-[#251545]/80 border-purple-500/30 text-purple-50 placeholder:text-purple-300/40 focus:bg-[#2c1854] focus:border-purple-400'
        : 'bg-slate-50/80 border-border-light text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-container'
    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`font-bold block ${isDark ? 'text-slate-200' : isDim ? 'text-purple-200' : 'text-slate-900'}`}>Nomor Induk Mahasiswa (NIM)</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: V3925001"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border transition-all font-mono uppercase ${
      isDark
        ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-purple-500'
        : isDim
        ? 'bg-[#251545]/80 border-purple-500/30 text-purple-50 placeholder:text-purple-300/40 focus:bg-[#2c1854] focus:border-purple-400'
        : 'bg-slate-50/80 border-border-light text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-container'
    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`font-bold block ${isDark ? 'text-slate-200' : isDim ? 'text-purple-200' : 'text-slate-900'}`}>Username GitHub Publik (Portofolio)</label>
                <div className="relative">
                  <Github className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="Contoh: username-github"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border transition-all font-mono ${
      isDark
        ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-purple-500'
        : isDim
        ? 'bg-[#251545]/80 border-purple-500/30 text-purple-50 placeholder:text-purple-300/40 focus:bg-[#2c1854] focus:border-purple-400'
        : 'bg-slate-50/80 border-border-light text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-container'
    }`}
                  />
                </div>
                <p className="text-[10px] text-text-muted">
                  Sistem mengambil repositori publik untuk sintesis keahlian (tanpa CV PDF).
                </p>
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="auth-email" className={`font-bold block ${isDark ? 'text-slate-200' : isDim ? 'text-purple-200' : 'text-slate-900'}`}>Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border transition-all ${
      isDark
        ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-purple-500'
        : isDim
        ? 'bg-[#251545]/80 border-purple-500/30 text-purple-50 placeholder:text-purple-300/40 focus:bg-[#2c1854] focus:border-purple-400'
        : 'bg-slate-50/80 border-border-light text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-container'
    }`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor={isRegister ? 'register-password' : 'login-password'} className={`font-bold block ${isDark ? 'text-slate-200' : isDim ? 'text-purple-200' : 'text-slate-900'}`}>Kata Sandi (Argon2id)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id={isRegister ? 'register-password' : 'login-password'}
                name={isRegister ? 'new-password' : 'password'}
                type={showPassword ? 'text' : 'password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength={isRegister ? 6 : undefined}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border transition-all ${
      isDark
        ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-purple-500'
        : isDim
        ? 'bg-[#251545]/80 border-purple-500/30 text-purple-50 placeholder:text-purple-300/40 focus:bg-[#2c1854] focus:border-purple-400'
        : 'bg-slate-50/80 border-border-light text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-container'
    }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label htmlFor="register-confirm-password" className={`font-bold block ${isDark ? 'text-slate-200' : isDim ? 'text-purple-200' : 'text-slate-900'}`}>Konfirmasi Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-2xl border transition-all ${
      isDark
        ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800 focus:border-purple-500'
        : isDim
        ? 'bg-[#251545]/80 border-purple-500/30 text-purple-50 placeholder:text-purple-300/40 focus:bg-[#2c1854] focus:border-purple-400'
        : 'bg-slate-50/80 border-border-light text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary-container'
    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi kata sandi' : 'Lihat konfirmasi kata sandi'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full font-bold text-white bg-primary-container hover:bg-primary-hover shadow-lg shadow-purple-500/25 transition-all mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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

        {/* Toggle Login/Register */}
        <div className="text-center pt-2 text-xs text-text-body">
          {isRegister ? (
            <p>
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => switchAuthMode(false)}
                className="font-bold text-primary-container hover:underline cursor-pointer ml-1"
              >
                Masuk di sini
              </button>
            </p>
          ) : (
            <p>
              Mahasiswa baru?{' '}
              <button
                type="button"
                onClick={() => switchAuthMode(true)}
                className="font-bold text-primary-container hover:underline cursor-pointer ml-1"
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
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center"><div className="w-8 h-8 border-3 border-primary-container border-t-transparent rounded-full animate-spin" /></div>}>
      <AuthForm />
    </Suspense>
  );
}
