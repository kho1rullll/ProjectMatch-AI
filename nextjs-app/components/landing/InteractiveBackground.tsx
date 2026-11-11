'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function InteractiveBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for subtle spotlight trailing
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 25 });

  // Inverse parallax for ambient micro particles
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Global Interactive Spotlight Glow following cursor */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-40"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(132, 204, 22, 0.12) 45%, transparent 75%)',
        }}
      />

      {/* 2. Top-right & Bottom-left Ambient Color Pods */}
      <div className="absolute -top-32 -left-32 w-[38rem] h-[38rem] bg-gradient-to-b from-purple-200/40 via-purple-100/20 to-transparent rounded-full blur-3xl opacity-60" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-lime-200/30 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-indigo-100/30 rounded-full blur-3xl opacity-40" />

      {/* 3. Subtle Animated Micro-Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f00a_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f00a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
