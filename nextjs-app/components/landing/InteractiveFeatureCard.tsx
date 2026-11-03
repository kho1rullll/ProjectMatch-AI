'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface InteractiveFeatureCardProps {
  icon: string;
  iconGradient: string;
  title: string;
  description: string;
  actionText: string;
  accentColor: 'primary' | 'secondary' | 'tertiary' | 'amber';
  highlightBadge?: string;
  stepNumber: string;
}

export default function InteractiveFeatureCard({
  icon,
  iconGradient,
  title,
  description,
  actionText,
  accentColor,
  highlightBadge,
  stepNumber,
}: InteractiveFeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Micro tilt on icon and card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const iconRotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 250, damping: 15 });
  const iconScale = useSpring(isHovered ? 1.15 : 1, { stiffness: 250, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Border glow colors based on accent
  const borderGlowClass =
    accentColor === 'secondary'
      ? 'from-lime-400 via-emerald-400 to-purple-500'
      : accentColor === 'tertiary'
      ? 'from-purple-500 via-indigo-500 to-lime-400'
      : accentColor === 'amber'
      ? 'from-amber-400 via-purple-500 to-lime-400'
      : 'from-purple-600 via-lime-400 to-purple-500';

  const textAccentClass =
    accentColor === 'secondary'
      ? 'text-lime-700'
      : accentColor === 'tertiary'
      ? 'text-purple-700'
      : accentColor === 'amber'
      ? 'text-amber-700'
      : 'text-primary-container';

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ y: -8 }}
      className="relative rounded-3xl p-[1.5px] transition-all duration-300 group cursor-pointer"
    >
      {/* Moving Conic Gradient Glowing Border Ring on Hover */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${borderGlowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]`}
      />

      {/* Card Content Surface */}
      <div className="relative h-full bg-surface-white/95 backdrop-blur-xl rounded-3xl p-6 lg:p-7 border border-border-light group-hover:border-transparent shadow-sm group-hover:shadow-[0_20px_40px_rgba(124,58,237,0.12)] transition-all flex flex-col justify-between overflow-hidden">
        {/* Subtle background ambient corner glow on hover */}
        <div
          className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none ${
            isHovered ? 'opacity-30 bg-purple-500' : 'opacity-0'
          }`}
        />

        <div>
          {/* Top Row: 3D Animated Icon + Step Index */}
          <div className="flex items-center justify-between">
            <motion.div
              style={{
                scale: iconScale,
                rotateZ: iconRotateZ,
                transformStyle: 'preserve-3d',
              }}
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center text-surface-white shadow-md transition-shadow group-hover:shadow-lg`}
            >
              <span className="material-symbols-outlined text-[28px]">{icon}</span>
            </motion.div>

            <div className="flex items-center gap-2">
              {highlightBadge && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-100 text-lime-900 border border-lime-300">
                  {highlightBadge}
                </span>
              )}
              <span className="font-mono text-xs font-black text-slate-300 group-hover:text-primary-container transition-colors">
                {stepNumber}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="font-headline-sm text-headline-sm text-text-heading mt-6 font-bold group-hover:text-primary-container transition-colors">
            {title}
          </h3>

          <p className="font-body-sm text-body-sm text-text-body mt-2 leading-relaxed">
            {description}
          </p>

          {/* Expandable interactive insight */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1"
            >
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                <span>Spesifikasi Algoritma</span>
              </div>
              <p>Mendukung embedding 1536 dimensi dengan kecepatan kalkulasi sub-detik untuk kecocokan optimal.</p>
            </motion.div>
          )}
        </div>

        {/* Footer Link / Action */}
        <div className="mt-6 pt-3 border-t border-border-light/60 flex items-center justify-between">
          <div className={`flex items-center gap-1 font-label-sm text-label-sm font-bold ${textAccentClass} group-hover:translate-x-1 transition-transform`}>
            <span>{actionText}</span>
          </div>
          <span className="text-[11px] text-slate-400 group-hover:text-slate-600 transition-colors">
            {isExpanded ? 'Tutup' : 'Rincian'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
