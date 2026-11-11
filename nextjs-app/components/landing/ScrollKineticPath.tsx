'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ScrollKineticPath() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across the pathway container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Smooth kinetic spring response to scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  // Path dashoffset / length
  const strokeDashoffset = useTransform(smoothProgress, [0, 1], [1000, 0]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.5]);

  // Orb position along vertical track
  const orbY = useTransform(smoothProgress, [0, 1], [40, 760]);
  const orbScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1.3, 1]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[480px] w-full max-w-5xl h-[800px] hidden md:block overflow-visible z-0"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Linear gradient for kinetic conduit */}
          <linearGradient id="kineticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#84CC16" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.8" />
          </linearGradient>

          {/* Radial glow for kinetic light particle */}
          <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#84CC16" stopOpacity="1" />
            <stop offset="40%" stopColor="#A3E635" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>

          {/* Filter for intense neon bloom */}
          <filter id="neonBloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Track Shadow / Groove (Base 3D Physical Indentation) */}
        <path
          d="M 500,20 C 500,220 200,320 200,480 C 200,640 500,680 500,780"
          stroke="rgba(148, 163, 184, 0.15)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* 2. Track Conduit Pipe Background */}
        <path
          d="M 500,20 C 500,220 200,320 200,480 C 200,640 500,680 500,780"
          stroke="rgba(124, 58, 237, 0.12)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 6"
        />

        {/* 3. Kinetic Illuminated Beam that advances with scroll */}
        <motion.path
          d="M 500,20 C 500,220 200,320 200,480 C 200,640 500,680 500,780"
          stroke="url(#kineticGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#neonBloom)"
          style={{
            pathLength: smoothProgress,
            opacity: glowOpacity,
          }}
        />

        {/* 4. Secondary glowing core line */}
        <motion.path
          d="M 500,20 C 500,220 200,320 200,480 C 200,640 500,680 500,780"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          style={{
            pathLength: smoothProgress,
            opacity: glowOpacity,
          }}
        />

        {/* 5. Waypoint Junction Rings */}
        <circle cx="500" cy="20" r="5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="200" cy="480" r="6" fill="#84CC16" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="500" cy="780" r="7" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
      </svg>

      {/* Floating Kinetic Energy Capsule / Particle following scroll */}
      <motion.div
        style={{
          y: orbY,
          scale: orbScale,
        }}
        className="absolute left-[492px] -top-3 w-6 h-6 rounded-full bg-accent-lime-glow shadow-[0_0_25px_8px_rgba(132,204,22,0.7)] flex items-center justify-center pointer-events-none"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
      </motion.div>
    </div>
  );
}
