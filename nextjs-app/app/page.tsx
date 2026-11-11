'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import BrandHeaderLink from '@/components/BrandLogo';
import InteractiveBackground from '@/components/landing/InteractiveBackground';
import ScrollKineticConduit from '@/components/landing/ScrollKineticConduit';
import DraggableHeroSection from '@/components/landing/DraggableHeroSection';
import TactileFeatureCards from '@/components/landing/TactileFeatureCards';
import LiveMatchingPlayground from '@/components/landing/LiveMatchingPlayground';
import ComparisonSliderSection from '@/components/landing/ComparisonSliderSection';
import MagneticButton from '@/components/landing/MagneticButton';
import { LiquidGlass, LiquidGlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button';
import { ThemeSwitcher, type Theme } from '@/components/ui/apple-liquid-glass-switcher';
import { useTheme } from '@/lib/theme-context';
import { motion } from 'framer-motion';

/**
 * Reusable Bi-Directional Scroll-Driven Reveal Component
 * Smoothly animates elements into view when scrolling down,
 * and automatically blurs/scales them back out when scrolled past in either direction.
 * Powered by Apple and Linear's cubic-bezier curve [0.16, 1, 0.3, 1].
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  scale?: number;
  blur?: number;
  amount?: number;
  margin?: string;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  direction = 'up',
  distance = 50,
  scale = 0.92,
  blur = 6,
  amount = 0.2,
  margin = '-40px',
}: ScrollRevealProps) {
  const getInitialOffset = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: scale,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{
        once: false,
        amount: amount,
        margin: margin,
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function RootHomePage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [squadSize, setSquadSize] = useState(4);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const testimonials = [
    {
      id: 1,
      quote:
        '“ProjectMatch AI matched our team with a live fintech ML pipeline project in 18 hours. We gained genuine production experience and mentorship before graduating!”',
      name: 'Sarah Althea',
      role: 'Fullstack ML Fellow • ITB Informatics',
      rating: 5,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD9f57Kz_p0-vN1yLqL30W3eK1e0uH0o0kH9jX5qL7eR1d2_j9c8g2b4e6h7i8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4',
    },
    {
      id: 2,
      quote:
        '“As a corporate lab sponsor, we previously spent weeks filtering through generic CVs. With ProjectMatch AI, candidate codebases are pre-verified with semantic precision.”',
      name: 'Dr. Hendra Gunawan',
      role: 'VP of AI Research • BioInformatika Nusantara',
      rating: 5,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDsWyKt_WeDrHHY7TDtVeFdHxlJFDU3lNfx6x6-lHdf_zKPIOV-BnQ6FX9Ocyrag6sS0EUcM8fOGX_PiwuxWlXllK1NLM0xIUkqf_CUkdtEH8iA0MbHZhzN9as-bpScR6ozzDxAOMZOCNPcQl01ciZEX3YdGchGxRsX92iCv7ttqOgUCHLRxaPZNRVpA7p33c0HTb7f4DZDHfbdU_n_gxqul0bhCGwkHgIMxSw53ZSo971qK7xI9T8',
    },
    {
      id: 3,
      quote:
        '“The squad formation feature paired me with backend and design peers who complemented my PyTorch skills. We shipped a production-ready system during our final term.”',
      name: 'Raden Satria',
      role: 'AI Systems Specialist • Universitas Indonesia',
      rating: 5,
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBLR_EWFg8LhdiJKlACTcelwgseHVRxv1ZehFQw6DqZT_tB0WabhDIFuOG5iHdzJzN0xLVbaNm0q2gD1CKN7-m73eKRHpoM7gd-GFMVIIBN2lbbkG9AEX3twszHHhZDIodPoNhLj3_cf2COlMer6Z0iriOvRVj8cAbI2gNbRqqH7AYdLu-2atFWjzmbmFJq0Q99zgy4rP590NiG6QGxhR9mSn2fHJXwpTMO2UHdPSuzgRX7WNQU4E',
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const displayName = user?.name || user?.full_name || user?.email?.split('@')[0] || 'User';
  const dashboardUrl = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <div
      data-theme={theme}
      className={`min-h-screen antialiased relative overflow-x-hidden transition-colors duration-500 ${
        theme === 'light'
          ? 'bg-[#fafafc] text-slate-900 selection:bg-purple-100 selection:text-purple-900'
          : theme === 'dark'
          ? 'bg-[#0b0f19] text-white selection:bg-purple-900 selection:text-white'
          : 'bg-[#120b22] text-purple-50 selection:bg-purple-900 selection:text-white'
      }`}
    >
      
      {/* 1. Global Interactive Spotlight Glow & Background Particles */}
      <InteractiveBackground />

      {/* 2. Global Scroll-Linked Kinetic Conduit Path with 3D Rolling Token */}
      <ScrollKineticConduit />

      {/* 3. Floating Pill Header with Apple Tahoe Liquid Glass & Theme Switcher */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
        <div className="h-16 max-w-7xl mx-auto">
          <LiquidGlass
            material="clear"
            appearance={theme === 'light' ? 'light' : 'dark'}
            refraction={16}
            bezel={18}
            blur={8}
            tint={theme === 'dim' ? '#180d2e' : undefined}
            className={`h-full rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.06)] px-4 sm:px-6 flex items-center justify-between border pointer-events-auto backdrop-blur-xl transition-all duration-300 ${
              theme === 'light'
                ? 'border-slate-200/70 bg-white/45 text-slate-800'
                : theme === 'dark'
                ? 'border-white/10 bg-[#0B0F19]/45 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                : 'border-purple-500/25 bg-[#140b27]/50 text-white shadow-[0_8px_32px_rgba(88,28,135,0.3)]'
            }`}
          >
            {/* Logo */}
            <BrandHeaderLink href="/" variant={theme === 'light' ? 'light' : 'dark'} size="md" />

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: 'AI Matching', href: '#ai-matching' },
                { label: 'Playground', href: '#playground' },
                { label: 'Comparison', href: '#comparison' },
                { label: 'Testimonials', href: '#testimonials' },
              ].map((item) => (
                <a
                  key={item.href}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                    theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  href={item.href}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Theme Switcher & Auth Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Apple Liquid Glass 3-way Theme Switcher */}
              <div className="flex items-center">
                <ThemeSwitcher value={theme} onValueChange={setTheme} />
              </div>

              {user ? (
                <div className="relative flex items-center gap-1.5 sm:gap-2">
                  <Link
                    href={dashboardUrl}
                    className={`hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                      theme === 'light'
                        ? 'text-slate-800 hover:bg-slate-100'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <LiquidGlassButton
                    type="button"
                    interactive
                    size="sm"
                    tint="#7C3AED"
                    className="text-white font-semibold shadow-md shadow-purple-500/20 cursor-pointer"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <span className="flex items-center gap-1">
                      {displayName.split(' ')[0]}
                      <span className="text-[10px] opacity-80">▾</span>
                    </span>
                  </LiquidGlassButton>

                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-0.5 hover:opacity-90 transition-opacity cursor-pointer ${
                      theme === 'light' ? 'bg-slate-900 text-white' : 'bg-white/15 text-white border border-white/20'
                    }`}
                    title={`Akun: ${displayName}`}
                    aria-label="Menu Akun Pengguna"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className={`absolute right-0 top-12 w-64 rounded-2xl p-3 border shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl ${
                        theme === 'light'
                          ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50'
                          : 'bg-[#140b27]/95 border-purple-500/30 text-white shadow-black/80'
                      }`}
                    >
                      <div className="p-2 border-b border-white/10 mb-2">
                        <p className="text-xs font-bold truncate">{user.name || user.full_name || 'Pengguna'}</p>
                        <p className="text-[10px] opacity-75 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        href={dashboardUrl}
                        onClick={() => setUserDropdownOpen(false)}
                        className={`block px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          theme === 'light' ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-white/10 text-white'
                        }`}
                      >
                        Buka Dashboard →
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors mt-1 cursor-pointer"
                      >
                        Keluar (Logout)
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    className={`hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                      theme === 'light'
                        ? 'text-slate-800 hover:bg-slate-100'
                        : 'text-slate-200 hover:bg-white/10'
                    }`}
                    href="/auth"
                  >
                    Sign In
                  </Link>
                  <LiquidGlassButton
                    asChild
                    interactive
                    size="sm"
                    tint="#7C3AED"
                    className="text-white font-semibold shadow-md shadow-purple-500/20"
                  >
                    <Link href="/auth?register=true">
                      Get Started
                    </Link>
                  </LiquidGlassButton>

                  <Link
                    href="/auth"
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-1 hover:opacity-90 transition-opacity ${
                      theme === 'light' ? 'bg-slate-900 text-white' : 'bg-white/15 text-white border border-white/20'
                    }`}
                    title="Login"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </Link>
                </>
              )}
            </div>
          </LiquidGlass>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10 w-full pt-20">
        
        {/* SECTION 1: HERO SECTION with 3D Specular Tilt Card & Draggable Badges */}
        <DraggableHeroSection theme={theme} />

        {/* SECTION 2: STATS & TRUST STRIP with Bi-Directional Reveal & Apple Tahoe Liquid Glass */}
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8 relative z-20">
          <ScrollReveal direction="up" amount={0.15} distance={40}>
            <div
              className={`text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border relative overflow-hidden transition-colors duration-300 ${
                theme === 'dim' ? 'bg-[#160b2b] border-purple-500/20' : 'bg-[#0B0F19] border-white/10'
              }`}
            >
              
              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
                <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern height="40" id="grid-pattern-hero" patternUnits="userSpaceOnUse" width="40">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect fill="url(#grid-pattern-hero)" height="100%" width="100%" />
                </svg>
              </div>

              <div className="relative z-10">
                {/* Heading & Sub-heading with bi-directional reveal */}
                <ScrollReveal direction="up" delay={0.1} distance={30}>
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <p className="text-xs uppercase tracking-widest text-accent-lime-glow font-bold mb-2">
                      Enterprise Infrastructure
                    </p>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                      Telah Dipercaya oleh Kampus Unggulan &amp; Mitra Industri
                    </h3>
                  </div>
                </ScrollReveal>

                {/* 4 Stats Grid with Staggered Cascading Reveal & Apple Tahoe Liquid Glass */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/10">
                  <ScrollReveal delay={0.0} distance={35} scale={0.9} amount={0.1}>
                    <LiquidGlass
                      material="regular"
                      appearance={theme === 'light' ? 'light' : 'dark'}
                      refraction={14}
                      bezel={16}
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">15,400+</div>
                      <p className="text-xs font-bold text-white mt-1">Mahasiswa Terdaftar</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Dari 42 politeknik &amp; universitas</p>
                    </LiquidGlass>
                  </ScrollReveal>

                  <ScrollReveal delay={0.12} distance={35} scale={0.9} amount={0.1}>
                    <LiquidGlass
                      material="regular"
                      appearance={theme === 'light' ? 'light' : 'dark'}
                      refraction={14}
                      bezel={16}
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-white/10 hover:border-accent-lime-glow/30 transition-colors"
                    >
                      <div className="text-3xl sm:text-4xl font-extrabold text-accent-lime-glow font-mono">98.4%</div>
                      <p className="text-xs font-bold text-white mt-1">Akurasi Match AI</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Cosine distance &lt; 0.08</p>
                    </LiquidGlass>
                  </ScrollReveal>

                  <ScrollReveal delay={0.24} distance={35} scale={0.9} amount={0.1}>
                    <LiquidGlass
                      material="regular"
                      appearance={theme === 'light' ? 'light' : 'dark'}
                      refraction={14}
                      bezel={16}
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">140+</div>
                      <p className="text-xs font-bold text-white mt-1">Proyek Industri Aktif</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Sponsor korporat &amp; hibah riset</p>
                    </LiquidGlass>
                  </ScrollReveal>

                  <ScrollReveal delay={0.36} distance={35} scale={0.9} amount={0.1}>
                    <LiquidGlass
                      material="regular"
                      appearance={theme === 'light' ? 'light' : 'dark'}
                      refraction={14}
                      bezel={16}
                      className="flex flex-col items-center text-center p-4 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-colors"
                    >
                      <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono">&lt; 24h</div>
                      <p className="text-xs font-bold text-white mt-1">Kecepatan Matching</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Dari penautan repo ke tawaran</p>
                    </LiquidGlass>
                  </ScrollReveal>
                </div>

              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* SECTION 3: WHAT WE PROVIDE with Expandable Tactile Cards & Staggered Bi-Directional Reveal */}
        <TactileFeatureCards theme={theme} />

        {/* SECTION 4: LIVE AI MATCHING PLAYGROUND (Interactive Simulator Widget) with Bi-Directional Reveal */}
        <div id="playground" className="scroll-mt-24">
          <ScrollReveal direction="up" delay={0.1} amount={0.15}>
            <LiveMatchingPlayground />
          </ScrollReveal>
        </div>

        {/* SECTION 5: SHOWCASE COMPARISON SLIDER (Cara Lama vs ProjectMatch AI) with Bi-Directional Reveal */}
        <div id="comparison" className="scroll-mt-24">
          <ScrollReveal direction="up" delay={0.1} amount={0.15}>
            <ComparisonSliderSection theme={theme} />
          </ScrollReveal>
        </div>

        {/* SECTION 6: DUAL FEATURE SHOWCASE (Dashboard & Squad Builder) with Bi-Directional Reveal */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          
          {/* Showcase A: Real-Time Tracking Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <ScrollReveal direction="right" delay={0.1} className="lg:col-span-5 space-y-4">
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                theme === 'light' ? 'bg-slate-100 text-slate-800' : 'bg-white/10 text-slate-200'
              }`}>
                Candidate &amp; Project Dashboard
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Pantau progres lamaran dan tawaran kolaborasi secara instan
              </h3>
              <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                Tidak ada lagi ghosting. Terima feedback transparan, validasi milestone tugas, dan saluran komunikasi langsung dengan lead engineer proyek.
              </p>
              <div className="pt-2">
                <MagneticButton
                  href={user ? dashboardUrl : '/auth'}
                  className="px-6 py-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Jelajahi Dashboard Talenta →
                </MagneticButton>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.2} className="lg:col-span-7">
              <div
                className={`rounded-3xl p-6 sm:p-8 border shadow-xl space-y-4 transition-colors duration-300 ${
                  theme === 'light'
                    ? 'bg-white border-slate-200/80'
                    : theme === 'dark'
                    ? 'bg-[#0f172a] border-white/10 text-white'
                    : 'bg-[#1a1030] border-purple-500/20 text-purple-50'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100/20">
                  <span className={`text-xs font-bold ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Active Match Streams
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ● 3 Sesi Aktif
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    theme === 'light'
                      ? 'bg-purple-50/60 border-purple-100'
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                        BM
                      </div>
                      <div>
                        <p className="font-extrabold text-xs">Fintech AI Risk Engine</p>
                        <p className={`text-[11px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                          Bank Mandiri • Stage: Code Review
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-purple-500">98.4% Match</span>
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-100'
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-accent-lime-glow font-bold flex items-center justify-center text-xs">
                        BF
                      </div>
                      <div>
                        <p className="font-extrabold text-xs">Deep Bio-Informatics Pipeline</p>
                        <p className={`text-[11px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                          BioFarma • Stage: Interview Scheduled
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-black ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      94.2% Match
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Showcase B: Squad Assembly Builder with Obsidian Dark Liquid Glass */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <ScrollReveal direction="right" delay={0.2} className="lg:col-span-7 order-2 lg:order-1">
              <LiquidGlass
                material="clear"
                appearance="dark"
                refraction={36}
                bezel={30}
                tint={theme === 'dim' ? '#1E1038' : '#0B0F19'}
                className={`text-white rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 ${
                  theme === 'dim' ? 'border-purple-500/20' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-accent-lime-glow">Dynamic Squad Assembler</span>
                  <span className="text-xs font-mono text-slate-400">Target Size: {squadSize} Engineers</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Atur Jumlah Anggota Tim:</span>
                    <span className="text-accent-lime-glow font-mono">{squadSize} Orang</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="1"
                    value={squadSize}
                    onChange={(e) => setSquadSize(Number(e.target.value))}
                    className="w-full accent-lime-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-lg font-black text-white">{Math.round(42 * (squadSize / 4))}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Kandidat Siap</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-lg font-black text-accent-lime-glow">&lt; {Math.max(2, Math.round(squadSize * 1.5))}h</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Formasi Tim</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-lg font-black text-white">100%</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Kelengkapan Peran</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-lg font-black text-purple-400">0.98</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Sinergi Vektor</p>
                  </div>
                </div>
              </LiquidGlass>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.1} className="lg:col-span-5 order-1 lg:order-2 space-y-4">
              <span className="px-3.5 py-1.5 rounded-full bg-lime-100 text-lime-900 text-xs font-extrabold uppercase tracking-wider">
                Autonomous Squad Builder
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Bentuk tim multidisiplin dengan sinergi optimal
              </h3>
              <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                Algoritma secara otomatis memasangkan profil frontend, backend, AI engineer, dan perancang produk tanpa kesenjangan keterampilan.
              </p>
            </ScrollReveal>
          </div>

        </section>

        {/* SECTION 7: TESTIMONIALS CAROUSEL with Bi-Directional Reveal */}
        <section id="testimonials" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <ScrollReveal direction="up" delay={0.1} amount={0.15}>
            <div
              className={`rounded-3xl p-6 sm:p-10 border shadow-xl space-y-8 transition-colors duration-300 ${
                theme === 'light'
                  ? 'bg-white border-slate-200/80'
                  : theme === 'dark'
                  ? 'bg-[#0f172a] border-white/10 text-white'
                  : 'bg-[#1a1030] border-purple-500/20 text-purple-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100/20">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-container font-extrabold">
                    Testimoni Talenta &amp; Mitra
                  </p>
                  <h3 className="text-2xl font-black mt-1">
                    Apa Kata Mereka yang Telah Menggunakan Platform Ini
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className={`p-3 rounded-full transition-colors cursor-pointer ${
                      theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title="Sebelumnya"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                    className={`p-3 rounded-full transition-colors cursor-pointer ${
                      theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title="Selanjutnya"
                  >
                    ▶
                  </button>
                </div>
              </div>

              <div className="min-h-[140px] flex flex-col justify-between">
                <p className={`text-base sm:text-lg leading-relaxed italic ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                  {testimonials[activeTestimonial]?.quote}
                </p>
                
                <div className="pt-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm">
                      {testimonials[activeTestimonial]?.name}
                    </h4>
                    <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {testimonials[activeTestimonial]?.role}
                    </p>
                  </div>
                  <span className="text-amber-500 font-bold text-sm">★★★★★</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* SECTION 8: PRE-FOOTER CTA BANNER with Apple Tahoe Liquid Glass CTA & Bi-Directional Reveal */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
          <ScrollReveal direction="up" delay={0.1} amount={0.2}>
            <div className="bg-gradient-to-br from-primary-container via-purple-700 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden text-center space-y-6">
              <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-md inline-block">
                  Tahun Akademik 2025 • Cohort Match Dibuka
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display">
                  Siap Membangun Portofolio &amp; Karier Nyata?
                </h2>
                <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                  Bergabunglah bersama ribuan mahasiswa dan inovator teknologi yang telah terhubung dengan proyek industri kredibel hari ini.
                </p>
                
                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <LiquidGlassButton
                    asChild
                    interactive
                    size="lg"
                    refraction={20}
                    tint="#FFFFFF"
                    className="text-slate-900 font-extrabold shadow-xl"
                  >
                    <Link href="/auth?register=true" className="flex items-center gap-2">
                      <span>Mulai Sekarang Gratis</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </LiquidGlassButton>

                  <a
                    href="#ai-matching"
                    className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-bold backdrop-blur-md transition-colors"
                  >
                    Pelajari Cara Kerja AI
                  </a>
                </div>

                <p className="text-xs text-purple-200/80 pt-2">
                  Gratis untuk mahasiswa kampus terverifikasi • Tanpa kartu kredit
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

      </main>

      {/* FOOTER */}
      <footer
        className={`relative z-10 border-t pt-16 pb-12 transition-colors duration-300 ${
          theme === 'dim'
            ? 'bg-[#0d071a] text-purple-100 border-purple-900/30'
            : 'bg-[#0B0F19] text-white border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            
            <div className="lg:col-span-2 space-y-4">
              <BrandHeaderLink href="/" variant="dark" size="md" />
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Platform kurasi dan inferensi kecocokan portofolio mahasiswa dengan lowongan riset dan proyek industri berbasis Semantic AI berstandar enterprise.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-accent-lime-glow">
                <span className="w-2 h-2 rounded-full bg-accent-lime-glow animate-pulse" />
                <span>Vector Ingestion Engine 4.2 Online</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Eksplorasi</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#ai-matching" className="hover:text-white transition-colors">AI Matching</a></li>
                <li><a href="#playground" className="hover:text-white transition-colors">Live Playground</a></li>
                <li><a href="#comparison" className="hover:text-white transition-colors">Perbandingan Sistem</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimoni Pengguna</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Teknologi</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span>Multi-Vector Matching</span></li>
                <li><span>GitHub Commit Parsing</span></li>
                <li><span>Squad Formation Engine</span></li>
                <li><span>Smart Campus RFID Kiosk</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Newsletter</h4>
              <p className="text-xs text-slate-400">Dapatkan rilis proyek industri terbaru setiap minggu.</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email kampus Anda..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-lime-glow"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-primary-container hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {newsletterSubscribed ? '✓ Berhasil Berlangganan' : 'Berlangganan'}
                </button>
              </form>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} ProjectMatch AI. Hak cipta dilindungi undang-undang.</p>
            <div className="flex items-center gap-4">
              <span>Keamanan Enkripsi TLS</span>
              <span>•</span>
              <span>Privasi Data Mahasiswa Terjamin</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}