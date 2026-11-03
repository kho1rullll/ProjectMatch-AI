'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import BrandHeaderLink from '@/components/BrandLogo';
import MagneticButton from './MagneticButton';
import InteractiveHeroCard from './InteractiveHeroCard';
import ScrollKineticPath from './ScrollKineticPath';
import InteractiveFeatureCard from './InteractiveFeatureCard';

export default function GoogleStitchLanding() {
  const { user } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [squadSize, setSquadSize] = useState(4);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const testimonials = [
    {
      id: 1,
      quote:
        '“ProjectMatch AI matched our team with a live fintech ML pipeline project in 18 hours. We gained genuine production experience and mentorship before graduating!”',
      name: 'Sarah Althea',
      role: 'CS Student, Institut Teknologi Bandung',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqrgO9Gmx2UOJRP-R3QNGQQVCu-XyoWLNfyO6dGJ5UB7fOWC0HcNhkgZXpLu0_CBctEvMWRV23OEOH8x0rIT-mIG_Vac9Wr5CWpKcaQxbPSbJ-2W3oWx5EMkBtMRFiZHpMX-85Bdv0a-1qGNebtRbuWi2nQ3-UvCB7ZhQOxD_4aOA7OU3EgNblUPYTVh70-HRrcC1muNddSIST0ifeO_Nb1c78FXCrue-3C3i55x7yDAs5M_z5D-Q',
    },
    {
      id: 2,
      quote:
        '“We skipped 3 weeks of clumsy screening interviews. The students matched had exact FastAPI and Docker proficiencies, committing clean pull requests on day one.”',
      name: 'Budi Santoso',
      role: 'VP of Engineering at ScaleTech',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnUD2lzF712qZ41muUJFKHZ2j20lsty1YntyKlp8MotuHTz4QvKu0RwhtZdDm1_QSBHSzGIXtPz103N1T54ZWitlXPKWRb4VH2EYf0m8WZmkKnK81P03b4mwvVWrHBStozPWIPktR_9X8WjyqicKczmDn3MX4M-VzrPk1G46_KliImRNn3ohtPXmYJ4e6W9lCm8xJ3IbA5caI8os7CrpFjiEW8Z9Y86NdWi8bXpu6qfStj-NNop7Y',
    },
    {
      id: 3,
      quote:
        '“The automated team formation paired me with the exact backend developer our UI prototype needed to ship. The cross-disciplinary synergy was remarkable.”',
      name: 'Kevin Wijaya',
      role: 'Product Design Student, UI',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgSKukeoelFJ6AJvQMEdzAqcutgrClWBZg3Covfo_3QjGMFSP4q6NB_tDWiCUxi6khXVQMnjV1jyDAo4fLGRO_P6pKpOwU8gRGwskZehn3S_U0w_0VgHtG_ZiWG6PUCtTOztjoDpRHXkX6qeYOKto4CGJKwbJU7Qd9k3_u80r8VGfXLVnWvRyEXgELHGgmNBeNQ0wdInvS5bD-9Z9-o1jow7Dq7as82-nBQZpnEJHpjyxVJb4FV5k',
    },
  ];

  const dashboardUrl = user?.role === 'admin' ? '/admin' : '/dashboard';
  const displayName = user?.name || user?.full_name || 'User';

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

  return (
    <div className="bg-canvas-light text-on-surface font-body-md text-body-md antialiased relative selection:bg-primary-light selection:text-primary min-h-screen">
      
      {/* ======================================================================= */}
      {/* FLOATING AMBIENT BACKGROUND LAYER                                       */}
      {/* ======================================================================= */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[72rem] h-[36rem] bg-gradient-to-b from-primary-light/40 via-surface-container-low/30 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-lime-glow/10 rounded-full blur-3xl" />
      </div>

      {/* ======================================================================= */}
      {/* FLOATING PILL HEADER                                                    */}
      {/* ======================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 px-gutter-mobile lg:px-gutter pt-4">
        <div className="h-20 max-w-7xl mx-auto">
          <div className="h-full bg-surface-white/85 backdrop-blur-md rounded-full shadow-[0_1px_8px_rgba(15,23,42,0.06)] px-space-lg flex items-center justify-between border border-border-light">
            
            {/* Logo */}
            <BrandHeaderLink href="/" variant="light" size="md" />

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-space-xs">
              <Link
                className="px-space-md py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                href="/projects"
              >
                Projects
              </Link>
              <a
                className="px-space-md py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                href="#ai-matching"
              >
                AI Matching
              </a>
              <Link
                className="px-space-md py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                href="/post-project"
              >
                For Partners
              </Link>
              <a
                className="px-space-md py-space-xs rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                href="#about"
              >
                About
              </a>
            </nav>

            {/* Auth Actions */}
            <div className="flex items-center gap-space-sm">
              {user ? (
                <>
                  <Link
                    href={dashboardUrl}
                    className="hidden sm:inline-flex px-space-lg py-space-xs rounded-full font-label-md text-label-md text-text-heading hover:bg-surface-container-low transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={dashboardUrl}
                    className="inline-flex items-center justify-center px-space-lg py-space-xs rounded-full bg-primary-container text-on-primary hover:bg-primary-hover font-label-md text-label-md shadow-[0_10px_25px_-5px_rgba(124,58,237,0.25)] transition-all font-semibold"
                  >
                    {displayName.split(' ')[0]}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className="hidden sm:inline-flex px-space-lg py-space-xs rounded-full font-label-md text-label-md text-text-heading hover:bg-surface-container-low transition-colors"
                    href="/auth"
                  >
                    Sign In
                  </Link>
                  <MagneticButton
                    href="/auth?register=true"
                    className="inline-flex items-center justify-center px-space-lg py-space-xs rounded-full bg-primary-container text-on-primary hover:bg-primary-hover font-label-md text-label-md shadow-[0_10px_25px_-5px_rgba(124,58,237,0.25)] font-semibold"
                  >
                    Get Started
                  </MagneticButton>
                </>
              )}

              <Link
                href={user ? dashboardUrl : '/auth'}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 ml-1 hover:opacity-90 transition-opacity"
                title={user ? `Dashboard: ${displayName}` : 'Login'}
              >
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* MAIN CONTENT CONTAINER                                                  */}
      {/* ======================================================================= */}
      <main className="relative z-10 w-full pt-20 bg-transparent min-h-screen">
        <div className="flex flex-col w-full">
          
          {/* Top Ambient Atmosphere Layer */}
          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-primary-light/60 rounded-full blur-3xl opacity-60" />
            <div className="pointer-events-none absolute top-48 -right-20 w-[30rem] h-[30rem] bg-secondary-container/25 rounded-full blur-3xl opacity-50" />
            
            {/* 1. HERO SECTION */}
            <section className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin pt-space-xl lg:pt-space-2xl pb-space-3xl relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
                
                {/* Left Column (Copy + Action) */}
                <div className="lg:col-span-7 flex flex-col items-start">
                  
                  {/* Overline Pill Badge */}
                  <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-primary-light/70 text-primary border border-primary/20 mb-space-lg shadow-sm">
                    <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                      Semantic AI Matching v2.4 • Next-Gen Career Launch
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="font-display text-display text-text-heading tracking-tight leading-[1.08] max-w-2xl font-extrabold">
                    Match your skills, land your dream{' '}
                    <span className="relative inline-block mt-1">
                      <span className="inline-block bg-primary-container text-surface-white px-space-md py-1 rounded-2xl shadow-xl shadow-primary-container/30 transform -rotate-1">
                        project
                      </span>
                    </span>
                  </h1>

                  {/* Body Text */}
                  <p className="font-body-lg text-body-lg text-text-body max-w-xl mt-space-lg leading-relaxed">
                    Platform kurasi proyek berbasis semantic AI yang menghubungkan mahasiswa dan talenta teknologi dengan proyek industri terverifikasi secara presisi tanpa screening manual yang lambat.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-space-md mt-space-xl w-full sm:w-auto">
                    <MagneticButton
                      href="/projects"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-full bg-primary-container hover:bg-primary-hover text-surface-white font-label-md text-label-md shadow-[0_10px_25px_-5px_rgba(124,58,237,0.35)] font-bold"
                    >
                      <span>Find Projects</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </MagneticButton>

                    <MagneticButton
                      href="#ai-matching"
                      magneticStrength={0.2}
                      glowOnHover={false}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-full text-text-heading hover:text-primary-container font-label-md text-label-md transition-colors hover:bg-surface-container-low font-semibold"
                    >
                      <span>How AI Match Works</span>
                      <span className="material-symbols-outlined text-[18px]">east</span>
                    </MagneticButton>
                  </div>

                  {/* Micro Social Proof */}
                  <div className="flex flex-wrap items-center gap-space-md mt-space-2xl pt-space-lg border-t border-border-light w-full">
                    <div className="flex -space-x-3 items-center">
                      <img
                        className="w-10 h-10 rounded-full border-2 border-surface-white object-cover"
                        alt="Portrait of young male computer science student"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpQphIAqRLKDJcEqNr5iRRmhzLGcZgDBO7icnT5agVGY3HLRZN2egMR6AZQty2O7E_exlbK30FHb1Ci3fk5tOtC7E6TSxbsVsu6mypvIPDoNuJwzwmBMgaUlAYwpjos6Hk1DtvfHduavzAmjQPia_R9X1qHvy-yAYSzc6dP5G_EXxmMJG4NM1DcJBpesOaJVVnaV4m0zm8QYJQIfa-QC1Dtb_VsfwA9hkmMZbMpXlkL9_JpKq8rto"
                      />
                      <img
                        className="w-10 h-10 rounded-full border-2 border-surface-white object-cover"
                        alt="Portrait of Southeast Asian female AI software developer"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLR_EWFg8LhdiJKlACTcelwgseHVRxv1ZehFQw6DqZT_tB0WabhDIFuOG5iHdzJzN0xLVbaNm0q2gD1CKN7-m73eKRHpoM7gd-GFMVIIBN2lbbkG9AEX3twszHHhZDIodPoNhLj3_cf2COlMer6Z0iriOvRVj8cAbI2gNbRqqH7AYdLu-2atFWjzmbmFJq0Q99zgy4rP590NiG6QGxhR9mSn2fHJXwpTMO2UHdPSuzgRX7WNQU4E"
                      />
                      <img
                        className="w-10 h-10 rounded-full border-2 border-surface-white object-cover"
                        alt="Portrait of young product designer"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdLjI67HWADux8jdGaoeIQP7mL1mdFTH4drSS0pPMwbsUwvl1-8HvN0rCKEWnDtS7DNa3DoBOEZduQAlVtmLmg_RJusa_ZRJ65O2merwJ2J2a7w651uL1r-05ioj1MN8lVDG-nk_wBFfHYaPMaDTP5M18TbjEXOtL2JmU0EK0-cr7vodg0xkK4wLj0VW-8EueRhuajE6Qmkp8UJw3YAtyjOvoPXtOAfUtmYplRPl1WoECHpCkhsIU"
                      />
                      <div className="w-10 h-10 rounded-full bg-surface-dark text-accent-lime-glow border-2 border-surface-white flex items-center justify-center font-label-sm text-label-sm font-bold">
                        +15k
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-label-sm text-label-sm font-bold text-text-heading ml-1">4.9/5</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-text-body">
                        Joined by 15,400+ tech students from <span className="font-semibold text-text-heading">ITB, UI, UGM &amp; NUS</span>
                      </p>
                    </div>
                  </div>

                </div>

                {/* Right Column (Interactive 3D Perspective Card with Mouse Tracking & Live Match Simulator) */}
                <div className="lg:col-span-5 relative">
                  <InteractiveHeroCard />
                </div>

              </div>
            </section>
          </div>

          {/* Scroll-Linked Interactive Pathway (Kinetic Beam / Connector) */}
          <ScrollKineticPath />

          {/* ======================================================================= */}
          {/* 2. STATS & TRUST STRIP (High Contrast Dark Navy Container)               */}
          {/* ======================================================================= */}
          <section className="max-w-7xl mx-auto w-full px-gutter-mobile lg:px-margin my-space-xl">
            <div className="bg-surface-dark text-surface-white rounded-3xl p-space-lg lg:p-space-2xl shadow-2xl border border-border-glass-dark relative overflow-hidden">
              
              {/* Background Architectural Grid SVG Overlay */}
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
                
                {/* Partner Headline & Monochrome Logos */}
                <div className="text-center max-w-3xl mx-auto">
                  <p className="font-label-sm text-label-sm uppercase tracking-widest text-text-muted font-bold">
                    Trusted by innovation labs, venture-backed tech startups, and premier universities
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-space-md text-surface-white/60 font-headline-sm text-headline-sm tracking-tighter">
                    <span className="hover:text-surface-white transition-colors cursor-default">
                      MANDIRI <span className="font-normal text-xs ml-0.5 tracking-normal opacity-80">DIGITAL</span>
                    </span>
                    <span className="text-border-glass-dark">/</span>
                    <span className="hover:text-surface-white transition-colors cursor-default">
                      GoTo <span className="text-xs font-normal opacity-80">FINANCIAL</span>
                    </span>
                    <span className="text-border-glass-dark">/</span>
                    <span className="hover:text-surface-white transition-colors cursor-default">Traveloka</span>
                    <span className="text-border-glass-dark">/</span>
                    <span className="hover:text-surface-white transition-colors cursor-default">
                      Telkom <span className="text-xs font-normal opacity-80">INDONESIA</span>
                    </span>
                    <span className="text-border-glass-dark">/</span>
                    <span className="hover:text-surface-white transition-colors cursor-default">UI</span>
                    <span className="text-border-glass-dark">/</span>
                    <span className="hover:text-surface-white transition-colors cursor-default">ITB</span>
                    <span className="text-border-glass-dark">/</span>
                    <span className="hover:text-surface-white transition-colors cursor-default">UGM</span>
                  </div>
                </div>

                {/* 4 High-Contrast White Metric Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mt-space-2xl">
                  
                  <div className="bg-surface-white text-text-heading rounded-2xl p-space-lg shadow-md border border-border-light flex flex-col justify-between">
                    <div className="flex items-center justify-between text-primary">
                      <span className="material-symbols-outlined text-[28px]">rocket_launch</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Scale</span>
                    </div>
                    <div className="mt-space-md">
                      <div className="font-display text-display leading-none text-text-heading font-extrabold">500+</div>
                      <p className="font-label-md text-label-md text-text-heading mt-1 font-bold">Active Industry Projects</p>
                      <p className="font-body-sm text-body-sm text-text-body mt-0.5">Rp 4.2B+ Total Project Grants</p>
                    </div>
                  </div>

                  <div className="bg-surface-white text-text-heading rounded-2xl p-space-lg shadow-md border border-border-light flex flex-col justify-between">
                    <div className="flex items-center justify-between text-primary">
                      <span className="material-symbols-outlined text-[28px]">group</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Selectivity</span>
                    </div>
                    <div className="mt-space-md">
                      <div className="font-display text-display leading-none text-text-heading font-extrabold">15k+</div>
                      <p className="font-label-md text-label-md text-text-heading mt-1 font-bold">Verified Student Talents</p>
                      <p className="font-body-sm text-body-sm text-text-body mt-0.5">Top 5% tech applicants</p>
                    </div>
                  </div>

                  <div className="bg-surface-white text-text-heading rounded-2xl p-space-lg shadow-md border border-border-light flex flex-col justify-between">
                    <div className="flex items-center justify-between text-secondary">
                      <span className="material-symbols-outlined text-[28px]">target</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Accuracy</span>
                    </div>
                    <div className="mt-space-md">
                      <div className="font-display text-display leading-none text-text-heading font-extrabold">98.4%</div>
                      <p className="font-label-md text-label-md text-text-heading mt-1 font-bold">AI Match Precision</p>
                      <p className="font-body-sm text-body-sm text-text-body mt-0.5">Multi-vector semantic scoring</p>
                    </div>
                  </div>

                  <div className="bg-surface-white text-text-heading rounded-2xl p-space-lg shadow-md border border-border-light flex flex-col justify-between">
                    <div className="flex items-center justify-between text-primary-container">
                      <span className="material-symbols-outlined text-[28px]">schedule</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Latency</span>
                    </div>
                    <div className="mt-space-md">
                      <div className="font-display text-display leading-none text-text-heading font-extrabold">&lt; 24h</div>
                      <p className="font-label-md text-label-md text-text-heading mt-1 font-bold">Average Matching Speed</p>
                      <p className="font-body-sm text-body-sm text-text-body mt-0.5">From CV upload to team offer</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 3. "WHAT WE PROVIDE" (Value Proposition with 4 Capsule Cards)            */}
          {/* ======================================================================= */}
          <section id="ai-matching" className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin py-space-3xl relative scroll-mt-24">
            
            {/* Flowing ambient curve behind cards */}
            <div className="pointer-events-none absolute -top-10 left-1/3 w-[45rem] h-[22rem] bg-gradient-to-r from-primary-light/40 to-transparent blur-3xl opacity-60" aria-hidden="true" />
            
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-space-2xl">
              <div className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-primary-light text-primary font-label-sm text-label-sm mb-space-sm font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                Core Architecture
              </div>
              <h2 className="font-headline-lg text-headline-lg text-text-heading tracking-tight font-extrabold">
                Built to Eliminate Friction in Tech Talent Matching
              </h2>
              <p className="font-body-lg text-body-lg text-text-body mt-space-xs">
                Replace subjective job boards and delayed candidate reviews with high-precision vector algorithms.
              </p>
            </div>

            {/* 4 Capsule Cards Grid with Hover Morphism */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg relative z-10">
              <InteractiveFeatureCard
                icon="document_scanner"
                iconGradient="from-primary-container to-primary"
                title="Smart Resume Parser"
                description="Automated deep skill extraction from PDF resumes, GitHub commits, and code repos without keyword stuffing bias."
                actionText="Vector embedding →"
                accentColor="primary"
                stepNumber="01"
                highlightBadge="Deep Extraction"
              />

              <InteractiveFeatureCard
                icon="hub"
                iconGradient="from-secondary-container to-secondary"
                title="Vector Semantic Matching"
                description="Multi-dimensional embedding algorithms mapping developer strengths to nuanced project requirements."
                actionText="AI match scoring →"
                accentColor="secondary"
                stepNumber="02"
                highlightBadge="Vector AI"
              />

              <InteractiveFeatureCard
                icon="verified_user"
                iconGradient="from-tertiary-fixed-dim to-tertiary"
                title="Verified Industry Projects"
                description="Real-world sprint deliverables from certified corporate tech teams with dedicated industry mentors."
                actionText="Enterprise grade only →"
                accentColor="tertiary"
                stepNumber="03"
                highlightBadge="Corporate"
              />

              <InteractiveFeatureCard
                icon="groups"
                iconGradient="from-amber-400 to-amber-600"
                title="Auto Team Formation"
                description="Complementary peer pairing across Frontend, Backend, AI Engineering, and UI/UX to form autonomous squads."
                actionText="Balanced squad dynamics →"
                accentColor="amber"
                stepNumber="04"
                highlightBadge="Squad Synergy"
              />
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 4. DUAL FEATURE SHOWCASE (Alternating Modern Grid)                       */}
          {/* ======================================================================= */}
          <section id="about" className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin py-space-2xl flex flex-col gap-space-3xl scroll-mt-24">
            
            {/* Showcase A (Dashboard & Real-Time Tracking) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
              
              {/* Left Details */}
              <div className="lg:col-span-5 flex flex-col items-start">
                <span className="px-space-md py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-space-sm font-bold">
                  Candidate &amp; Project Dashboard
                </span>
                <h3 className="font-headline-lg text-headline-lg text-text-heading tracking-tight leading-snug font-bold">
                  Track matching progress and offer invitations with zero latency
                </h3>
                <p className="font-body-md text-body-md text-text-body mt-space-sm mb-space-lg">
                  No ghosting. Receive structured feedback, milestone approvals, and direct communication channels with project engineering leads.
                </p>

                {/* Bullet Points with Icons */}
                <ul className="flex flex-col gap-space-sm w-full">
                  <li className="flex items-start gap-space-sm">
                    <div className="w-6 h-6 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-text-heading font-bold">Automated Milestone Payouts</p>
                      <p className="font-body-sm text-body-sm text-text-body">Stipends and grants held safely in escrow and disbursed upon mentor code review.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-space-sm">
                    <div className="w-6 h-6 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-text-heading font-bold">Digital IP &amp; NDA Signing</p>
                      <p className="font-body-sm text-body-sm text-text-body">One-click legally compliant student intellectual property protection and confidentiality.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-space-sm">
                    <div className="w-6 h-6 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-text-heading font-bold">Live Sprint Health Analytics</p>
                      <p className="font-body-sm text-body-sm text-text-body">Continuous commit syncing and burndown velocity reporting for university credit.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Right Dashboard Card Mockup */}
              <div className="lg:col-span-7">
                <div className="bg-surface-white rounded-3xl p-space-lg lg:p-space-xl border border-border-light shadow-xl">
                  
                  {/* Window Mockup Bar */}
                  <div className="flex items-center justify-between pb-space-md border-b border-border-light">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="font-label-sm text-label-sm text-text-muted flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      app.projectmatch.ai/inbox/live
                    </div>
                    <span className="material-symbols-outlined text-text-muted text-[18px]">more_horiz</span>
                  </div>

                  {/* Mockup Content: Active Sprint Items */}
                  <div className="mt-space-md flex flex-col gap-space-sm">
                    
                    {/* Item 1 */}
                    <div className="p-space-md rounded-2xl bg-surface-container-low border border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm hover:border-primary-container transition-colors">
                      <div className="flex items-center gap-space-md">
                        <div className="w-10 h-10 rounded-xl bg-primary-container text-surface-white flex items-center justify-center font-bold text-sm">
                          FL
                        </div>
                        <div>
                          <h5 className="font-headline-sm text-headline-sm text-text-heading font-bold">Federated Learning Fraud Detector</h5>
                          <p className="font-body-sm text-body-sm text-text-body">GoTo Financial Lab • Lead: Dr. Aris Munandar</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-secondary-fixed text-surface-dark font-label-sm text-label-sm font-bold">
                          Match Accepted
                        </span>
                        <span className="text-text-muted text-xs font-mono">Sprint W3</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-space-md rounded-2xl bg-surface-white border border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-md">
                        <div className="w-10 h-10 rounded-xl bg-tertiary-container text-surface-white flex items-center justify-center font-bold text-sm">
                          AQ
                        </div>
                        <div>
                          <h5 className="font-headline-sm text-headline-sm text-text-heading font-bold">Autonomous Flight Drone Pathing</h5>
                          <p className="font-body-sm text-body-sm text-text-body">Telkom GeoSpatial • Lead: Maya S.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary-light text-primary font-label-sm text-label-sm font-bold">
                          Interview Requested
                        </span>
                        <span className="text-text-muted text-xs font-mono">Today</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-space-md rounded-2xl bg-surface-white border border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-md">
                        <div className="w-10 h-10 rounded-xl bg-surface-dark text-accent-lime-glow flex items-center justify-center font-bold text-sm">
                          KG
                        </div>
                        <div>
                          <h5 className="font-headline-sm text-headline-sm text-text-heading font-bold">Semantic Knowledge Graph for Tourism</h5>
                          <p className="font-body-sm text-body-sm text-text-body">Traveloka R&amp;D • Lead: Hendra K.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-bold">
                          In Evaluation
                        </span>
                        <span className="text-text-muted text-xs font-mono">2d ago</span>
                      </div>
                    </div>

                  </div>

                  {/* Micro Activity Feeds */}
                  <div className="mt-space-md pt-space-sm border-t border-border-light flex items-center justify-between text-xs text-text-muted font-body-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Synchronized with GitHub Enterprise Classroom
                    </span>
                    <Link className="text-primary font-bold hover:underline" href="/dashboard">
                      Open Live Workspace →
                    </Link>
                  </div>

                </div>
              </div>

            </div>

            {/* Showcase B (Custom Project Builder - Dark Surface Module) */}
            <div className="bg-surface-dark rounded-3xl p-space-lg lg:p-space-2xl border border-border-glass-dark text-surface-white relative overflow-hidden shadow-2xl">
              
              {/* Glow ambient background */}
              <div className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 bg-primary-container/30 rounded-full blur-3xl" aria-hidden="true" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center relative z-10">
                
                {/* Left: Project Configuration Interactive Simulation Preview */}
                <div className="lg:col-span-6 bg-surface-dark-subtle border border-border-glass-dark rounded-2xl p-space-lg">
                  <div className="flex items-center justify-between pb-space-sm border-b border-border-glass-dark">
                    <span className="font-label-sm text-label-sm text-accent-lime-glow uppercase tracking-wider flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[16px]">tune</span>
                      Auto-Squad Assembler
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-dark border border-border-glass-dark text-xs text-text-muted font-mono">
                      v4.2 Simulation
                    </span>
                  </div>

                  {/* Interactive Style Slider Mockup */}
                  <div className="mt-space-md">
                    <div className="flex justify-between text-sm mb-1.5">
                      <label htmlFor="squad-size-range" className="text-surface-white font-medium">Desired Squad Size</label>
                      <span className="text-accent-lime-glow font-bold">{squadSize} Engineers + 1 Tech Lead</span>
                    </div>
                    <input
                      id="squad-size-range"
                      type="range"
                      min={2}
                      max={8}
                      value={squadSize}
                      onChange={(e) => setSquadSize(Number(e.target.value))}
                      className="w-full accent-accent-lime-glow cursor-pointer h-2 bg-surface-dark rounded-lg appearance-none"
                    />
                  </div>

                  {/* Stack Tags Selection */}
                  <div className="mt-space-md">
                    <span className="text-xs text-text-muted uppercase tracking-wider block mb-2 font-semibold">
                      Required Vector Capacities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-dark text-surface-white border border-border-glass-dark text-xs flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Rust / WebAssembly
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-surface-dark text-surface-white border border-border-glass-dark text-xs flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-lime-glow" /> Llama 3 Fine-Tuning
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-surface-dark text-surface-white border border-border-glass-dark text-xs flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim" /> Distributed Redis
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-surface-dark text-surface-white border border-border-glass-dark text-xs flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" /> Kubernetes / Terraform
                      </span>
                    </div>
                  </div>

                  {/* Matching Estimate Output */}
                  <div className="mt-space-lg p-space-sm rounded-xl bg-surface-dark border border-border-glass-dark flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted font-medium">Predicted Candidate Pool</p>
                      <p className="text-base font-bold text-surface-white">
                        {Math.round(42 * (squadSize / 4))} Qualified Candidates Matched
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-muted font-medium">Est. Squad Formation</p>
                      <p className="text-base font-bold text-accent-lime-glow">
                        &lt; {Math.max(2, Math.round(squadSize * 1.5))} Hours
                      </p>
                    </div>
                  </div>

                </div>

                {/* Right: Partner Callout & CTA */}
                <div className="lg:col-span-6 flex flex-col items-start">
                  <span className="px-space-md py-1 rounded-full bg-surface-dark-subtle text-accent-lime-glow border border-accent-lime-glow/30 font-label-sm text-label-sm uppercase tracking-wider mb-space-sm font-bold">
                    For Industry Partners &amp; Labs
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-surface-white tracking-tight font-extrabold">
                    Launch a project in 3 clicks. Our AI automatically ranks and assembles student squads.
                  </h3>
                  <p className="font-body-md text-body-md text-text-muted mt-space-sm mb-space-xl leading-relaxed">
                    Offload months of campus recruiting visits and endless resume filtering. Connect directly with university engineering teams calibrated precisely to your stack and roadmap.
                  </p>
                  <Link
                    className="inline-flex items-center gap-space-xs px-space-xl py-3.5 rounded-full bg-accent-lime-glow hover:bg-secondary-fixed-dim text-surface-dark font-label-md text-label-md transition-all shadow-lg hover:scale-105 font-bold"
                    href="/post-project"
                  >
                    <span>Post a Project Request</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                </div>

              </div>
            </div>

          </section>

          {/* ======================================================================= */}
          {/* 5. TESTIMONIAL & SOCIAL PROOF                                            */}
          {/* ======================================================================= */}
          <section className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin py-space-3xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-2xl gap-space-md">
              <div>
                <span className="px-space-md py-1 rounded-full bg-primary-light text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold">
                  Student &amp; Partner Voices
                </span>
                <h2 className="font-headline-lg text-headline-lg text-text-heading tracking-tight mt-space-xs font-extrabold">
                  Loved by ambitious students and hiring managers alike
                </h2>
              </div>

              {/* Carousel Navigation Controls */}
              <div className="flex items-center gap-space-xs">
                <button
                  aria-label="Previous Testimonial"
                  className="w-12 h-12 rounded-full border border-border-light bg-surface-white text-text-heading flex items-center justify-center hover:bg-surface-container-low transition-colors shadow-sm cursor-pointer"
                  type="button"
                  onClick={() =>
                    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button
                  aria-label="Next Testimonial"
                  className="w-12 h-12 rounded-full border border-border-light bg-surface-white text-text-heading flex items-center justify-center hover:bg-surface-container-low transition-colors shadow-sm cursor-pointer"
                  type="button"
                  onClick={() =>
                    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* 3 Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {testimonials.map((item, idx) => {
                const isActive = activeTestimonial === idx;
                return (
                  <div
                    key={item.id}
                    className={`bg-surface-white rounded-3xl p-space-lg lg:p-space-xl border transition-all duration-300 flex flex-col justify-between ${
                      isActive
                        ? 'border-primary-container scale-[1.02] shadow-xl ring-2 ring-primary-container/20'
                        : 'border-border-light shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1 text-secondary mb-space-md">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="material-symbols-outlined text-[18px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <p className="font-body-md text-body-md text-text-heading leading-relaxed italic">
                        {item.quote}
                      </p>
                    </div>

                    <div className="flex items-center gap-space-sm mt-space-xl pt-space-md border-t border-border-light">
                      <img
                        className="w-12 h-12 rounded-full object-cover border border-border-light"
                        alt={item.name}
                        src={item.img}
                      />
                      <div>
                        <h5 className="font-headline-sm text-headline-sm text-text-heading font-bold">{item.name}</h5>
                        <p className="font-body-sm text-body-sm text-text-body">{item.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 6. CALL TO ACTION BANNER (Pre-Footer)                                    */}
          {/* ======================================================================= */}
          <section className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin my-space-2xl w-full">
            <div className="bg-gradient-to-r from-primary to-primary-container text-surface-white p-space-xl lg:p-space-3xl text-center rounded-3xl shadow-2xl relative overflow-hidden">
              
              {/* Subtle Decorative SVG Grid Pattern */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" aria-hidden="true">
                <svg className="w-full h-full" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern height="32" id="grid-pattern-cta" patternUnits="userSpaceOnUse" width="32">
                      <circle cx="2" cy="2" fill="currentColor" r="1.5" />
                    </pattern>
                  </defs>
                  <rect fill="url(#grid-pattern-cta)" height="100%" width="100%" />
                </svg>
              </div>

              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-surface-white/10 text-on-primary border border-border-glass-dark font-label-sm text-label-sm mb-space-md font-bold">
                  <span className="w-2 h-2 rounded-full bg-accent-lime-glow animate-pulse" />
                  Spring 2025 Match Cohort Open
                </div>

                <h2 className="font-display text-display leading-tight tracking-tight text-surface-white font-extrabold">
                  Ready to Build Your Real-World Portfolio?
                </h2>

                <p className="font-body-lg text-body-lg text-on-primary-container mt-space-sm max-w-xl">
                  Join thousands of developers and product creators matching with high-impact industry projects today.
                </p>

                {/* Dual CTA */}
                <div className="flex flex-wrap items-center justify-center gap-space-md mt-space-xl w-full">
                  <MagneticButton
                    href="/auth?register=true"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-space-xl py-4 rounded-full bg-surface-white text-surface-dark hover:bg-surface-container-low font-label-md text-label-md shadow-xl font-bold"
                  >
                    <span>Start Matching Free</span>
                    <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                  </MagneticButton>

                  <Link
                    className="w-full sm:w-auto inline-flex items-center justify-center px-space-xl py-4 rounded-full bg-transparent hover:bg-surface-white/10 text-surface-white border border-border-glass-dark font-label-md text-label-md transition-colors font-semibold"
                    href="/post-project"
                  >
                    <span>Schedule Partner Demo</span>
                  </Link>
                </div>

                <p className="font-body-sm text-body-sm text-on-primary-container/80 mt-space-md">
                  No credit card required • Free for verified university students
                </p>
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* ======================================================================= */}
      {/* 7. FOOTER                                                               */}
      {/* ======================================================================= */}
      <footer className="relative z-10 w-full bg-surface-dark text-surface-white mt-space-3xl border-t border-border-glass-dark">
        <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin py-space-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-2xl">
            
            {/* Col 1: Brand & Status */}
            <div className="lg:col-span-2 flex flex-col gap-space-md">
              <BrandHeaderLink href="/" variant="dark" size="md" />
              <p className="font-body-sm text-body-sm text-text-muted max-w-sm leading-relaxed">
                High-fidelity semantic matching uniting vetted engineering talent with institutional tech initiatives and deep-tech founders.
              </p>
              <div className="flex items-center gap-space-xs mt-space-xs">
                <span className="inline-flex items-center px-space-sm py-1 rounded-full font-label-sm text-label-sm bg-surface-dark-subtle text-accent-lime-glow border border-accent-lime-glow/30 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-lime-glow mr-1.5 animate-pulse" />
                  Engine 4.2 Online
                </span>
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-surface-white uppercase tracking-wider font-bold">Platform</span>
              <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-text-muted">
                <li>
                  <Link className="hover:text-surface-white transition-colors" href="/projects">
                    Verified Projects
                  </Link>
                </li>
                <li>
                  <a className="hover:text-surface-white transition-colors" href="#ai-matching">
                    Semantic Engine
                  </a>
                </li>
                <li>
                  <Link className="hover:text-surface-white transition-colors" href="/dashboard">
                    Talent Graph
                  </Link>
                </li>
                <li>
                  <a className="hover:text-surface-white transition-colors" href="#ai-matching">
                    Scoring Model
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Ecosystem Links */}
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-surface-white uppercase tracking-wider font-bold">Ecosystem</span>
              <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-text-muted">
                <li>
                  <Link className="hover:text-surface-white transition-colors" href="/post-project">
                    University Labs
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-surface-white transition-colors" href="/post-project">
                    Enterprise Leads
                  </Link>
                </li>
                <li>
                  <a className="hover:text-surface-white transition-colors" href="#about">
                    Governance &amp; Ethics
                  </a>
                </li>
                <li>
                  <a className="hover:text-surface-white transition-colors" href="#about">
                    Security &amp; Privacy
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Intelligence Dispatch Newsletter */}
            <div className="flex flex-col gap-space-sm">
              <span className="font-label-md text-label-md text-surface-white uppercase tracking-wider font-bold">
                Intelligence Dispatch
              </span>
              <p className="font-body-sm text-body-sm text-text-muted leading-relaxed">
                Weekly semantic match telemetry and engineering initiative trends.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-space-xs mt-space-xs">
                <input
                  aria-label="Email dispatch"
                  className="w-full px-space-md py-space-xs rounded-full bg-surface-dark-subtle text-surface-white placeholder:text-text-muted border border-border-glass-dark text-body-sm focus:outline-none focus:border-primary-container"
                  placeholder="lead@domain.edu"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button
                  className="px-space-md py-space-xs rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary-hover shrink-0 transition-colors font-bold cursor-pointer"
                  type="submit"
                >
                  Join
                </button>
              </form>
              {newsletterSubscribed && (
                <p className="text-xs text-accent-lime-glow font-bold animate-pulse mt-1">
                  ✓ Berhasil bergabung dalam dispatches mingguan!
                </p>
              )}
            </div>

          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="mt-space-3xl pt-space-xl border-t border-border-glass-dark flex flex-col md:flex-row items-center justify-between gap-space-md text-text-muted font-body-sm text-body-sm">
            <div>© 2025 ProjectMatch AI Inc. Architected for engineering integrity.</div>
            <div className="flex items-center gap-space-lg">
              <a className="hover:text-surface-white transition-colors" href="#about">
                Privacy Policy
              </a>
              <a className="hover:text-surface-white transition-colors" href="#about">
                Terms of Service
              </a>
              <a className="hover:text-surface-white transition-colors" href="#ai-matching">
                Status Telemetry
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
