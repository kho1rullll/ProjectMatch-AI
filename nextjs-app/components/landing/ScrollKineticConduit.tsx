'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// High-precision sampled keyframes along the cubic bezier curve of the conduit
// Each keyframe provides exact progress (0 to 1), X coordinate, and Y coordinate.
const CONDUIT_KEYFRAMES = [
  { progress: 0, x: 760, y: 120 },
  { progress: 0.04, x: 740.4, y: 224.2 },
  { progress: 0.08, x: 680.9, y: 311.9 },
  { progress: 0.12, x: 599.2, y: 380.3 },
  { progress: 0.16, x: 525.1, y: 455.5 },
  { progress: 0.20, x: 504.7, y: 559.5 },
  { progress: 0.24, x: 449.5, y: 650.4 },
  { progress: 0.28, x: 377.4, y: 728.9 },
  { progress: 0.32, x: 304.4, y: 806.6 },
  { progress: 0.36, x: 249.1, y: 897.2 },
  { progress: 0.40, x: 245.7, y: 1002.4 },
  { progress: 0.44, x: 289.4, y: 1099.0 },
  { progress: 0.48, x: 360.8, y: 1177.9 },
  { progress: 0.52, x: 444.7, y: 1243.7 },
  { progress: 0.56, x: 533.6, y: 1302.7 },
  { progress: 0.60, x: 623.1, y: 1360.7 },
  { progress: 0.64, x: 708.2, y: 1424.9 },
  { progress: 0.68, x: 772.3, y: 1509.0 },
  { progress: 0.72, x: 774.5, y: 1614.4 },
  { progress: 0.76, x: 740.9, y: 1715.2 },
  { progress: 0.80, x: 681.4, y: 1803.4 },
  { progress: 0.84, x: 605.8, y: 1878.6 },
  { progress: 0.88, x: 523.5, y: 1946.4 },
  { progress: 0.92, x: 448.5, y: 2021.6 },
  { progress: 0.96, x: 453.6, y: 2125.0 },
  { progress: 1.0, x: 500.0, y: 2220.0 }
];

const Y_INPUTS = CONDUIT_KEYFRAMES.map((k) => k.y);
const X_OUTPUTS = CONDUIT_KEYFRAMES.map((k) => k.x);
const PROGRESS_OUTPUTS = CONDUIT_KEYFRAMES.map((k) => k.progress);

export default function ScrollKineticConduit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(750);

  // Dynamic window height measurement for screen-centering calculations
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setViewportHeight(window.innerHeight || 750);
      };
      handleResize();
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Track exact window scroll in pixels
  const { scrollY } = useScroll();

  // Screen centering calibration:
  // - Center of viewport in document coordinates: scrollY + (viewportHeight * 0.48)
  // - Conduit starts at Y = 120 and ends at Y = 2220 (right above the Live Matching Playground).
  // - As the user scrolls, the indicator tracks at exactly 48% (middle of the screen).
  // - When the end of the conduit (Y=2220) reaches the screen center, the indicator reaches 2220 (the exact end of the line).
  const centerOffset = viewportHeight * 0.48;
  const scrollEnd = Math.max(1400, 2220 - centerOffset);
  const initialScroll = 240;

  const rawIndicatorY = useTransform(
    scrollY,
    [0, initialScroll, scrollEnd],
    [120, initialScroll + centerOffset, 2220],
    { clamp: true }
  );

  // Smooth kinetic spring response for tactile momentum
  const indicatorY = useSpring(rawIndicatorY, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.1,
  });

  // Calculate synchronized X coordinate and path progress from the Y position
  const tokenX = useTransform(indicatorY, Y_INPUTS, X_OUTPUTS);
  const pathProgress = useTransform(indicatorY, Y_INPUTS, PROGRESS_OUTPUTS);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-x-0 top-0 h-[2300px] hidden lg:block overflow-visible z-[1]"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto h-full relative">
        <svg
          viewBox="0 0 1000 2300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Linear Neon Gradient along the conduit */}
            <linearGradient id="conduitNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#84CC16" stopOpacity="1" />
              <stop offset="70%" stopColor="#A855F7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#84CC16" stopOpacity="1" />
            </linearGradient>

            {/* Neon Bloom Glow Filter */}
            <filter id="conduitBloom" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle Core Shadow */}
            <filter id="tokenDropShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#84CC16" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* 1. Conduit 3D Physical Groove / Outer Indentation */}
          <path
            d="M 760,120 C 760,350 520,380 520,480 C 520,680 240,780 240,950 C 240,1250 780,1350 780,1550 C 780,1850 440,1950 440,2050 C 440,2150 500,2180 500,2220"
            stroke="rgba(226, 232, 240, 0.55)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* 2. Conduit Inner Rail (Dotted Sub-track) */}
          <path
            d="M 760,120 C 760,350 520,380 520,480 C 520,680 240,780 240,950 C 240,1250 780,1350 780,1550 C 780,1850 440,1950 440,2050 C 440,2150 500,2180 500,2220"
            stroke="rgba(124, 58, 237, 0.18)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="6 8"
          />

          {/* 3. Kinetic Illuminated Neon Trail advancing with scroll */}
          <motion.path
            d="M 760,120 C 760,350 520,380 520,480 C 520,680 240,780 240,950 C 240,1250 780,1350 780,1550 C 780,1850 440,1950 440,2050 C 440,2150 500,2180 500,2220"
            stroke="url(#conduitNeonGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#conduitBloom)"
            style={{
              pathLength: pathProgress,
            }}
          />

          {/* 4. White Super-luminal Core Beam */}
          <motion.path
            d="M 760,120 C 760,350 520,380 520,480 C 520,680 240,780 240,950 C 240,1250 780,1350 780,1550 C 780,1850 440,1950 440,2050 C 440,2150 500,2180 500,2220"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              pathLength: pathProgress,
            }}
          />

          {/* Waypoint Junction Rings */}
          <circle cx="760" cy="120" r="7" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="520" cy="480" r="7" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="240" cy="950" r="8" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="780" cy="1550" r="8" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="440" cy="2050" r="8" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2.5" />

          {/* Terminal End-of-Line Target Junction with Active Radar Beacon */}
          <g>
            <circle cx="500" cy="2220" r="18" fill="none" stroke="#84CC16" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 3" />
            <circle cx="500" cy="2220" r="12" fill="#84CC16" fillOpacity="0.2" />
            <circle cx="500" cy="2220" r="9" fill="#84CC16" stroke="#FFFFFF" strokeWidth="3" />
          </g>

          {/* 5. Dynamic 3D Moving AI Match Core / Green Indicator Token */}
          <motion.g
            style={{
              x: tokenX,
              y: indicatorY,
            }}
            className="pointer-events-none"
          >
            {/* Outer Neon Bloom Halo */}
            <circle
              cx="0"
              cy="0"
              r="24"
              fill="#84CC16"
              opacity="0.35"
              filter="url(#conduitBloom)"
            />

            {/* Rotating Pulsing Radar Ring */}
            <circle
              cx="0"
              cy="0"
              r="17"
              fill="none"
              stroke="#84CC16"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-spin"
              style={{ animationDuration: '6s', transformOrigin: '0 0' }}
            />

            {/* Outer Physical 3D Token Disk */}
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="#0B0F19"
              stroke="#84CC16"
              strokeWidth="2.5"
              filter="url(#tokenDropShadow)"
            />

            {/* Vivid Lime Glowing Core Indicator */}
            <circle
              cx="0"
              cy="0"
              r="6"
              fill="#84CC16"
            />

            {/* Center Laser Specular White Highlight */}
            <circle
              cx="0"
              cy="0"
              r="2"
              fill="#FFFFFF"
            />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
