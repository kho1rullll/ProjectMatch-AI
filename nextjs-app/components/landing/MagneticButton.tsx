'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  magneticStrength?: number;
  glowOnHover?: boolean;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  magneticStrength = 0.3,
  glowOnHover = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  // Motion coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth kinetic spring physics
  const springX = useSpring(mouseX, { stiffness: 200, damping: 15, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    mouseX.set(distanceX * magneticStrength);
    mouseY.set(distanceY * magneticStrength);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e: React.MouseEvent) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
    if (onClick) onClick();
  };

  const content = (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.94 }}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none ${className}`}
    >
      {/* Click ripple / border neon flash */}
      {isClicked && (
        <span
          className="absolute inset-0 rounded-full animate-ping pointer-events-none border-2 border-accent-lime-glow/80 bg-accent-lime-glow/20"
          style={{ animationDuration: '400ms' }}
        />
      )}

      {/* Ambient hover glow halo */}
      {glowOnHover && (
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500/20 via-lime-400/20 to-purple-600/20 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}

      {children}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block" onClick={onClick}>
        {content}
      </Link>
    );
  }

  return content;
}
