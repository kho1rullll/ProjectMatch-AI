import React from 'react';
import Link from 'next/link';

interface BrandTitleProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function BrandTitle({ variant = 'light', size = 'md', className = '' }: BrandTitleProps) {
  const isDark = variant === 'dark';

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
  };

  const badgeSizes = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded-md ml-1.5',
    md: 'text-xs px-2 py-0.5 rounded-lg ml-2',
    lg: 'text-xs sm:text-sm px-2.5 py-0.5 rounded-lg ml-2',
    xl: 'text-sm px-3 py-1 rounded-xl ml-2.5',
  };

  return (
    <span className={`inline-flex items-center tracking-tight font-extrabold ${textSizes[size]} ${className}`}>
      <span className={isDark ? 'text-white' : 'text-slate-900'}>Project</span>
      <span className={isDark ? 'text-[#8B5CF6]' : 'text-purple-600'}>Match</span>
      <span
        className={`bg-[#84CC16] text-slate-950 font-black uppercase tracking-wider inline-flex items-center justify-center leading-none shadow-xs ${badgeSizes[size]}`}
      >
        AI
      </span>
    </span>
  );
}

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function BrandLogo({ className = '', size = 'md' }: BrandLogoProps) {
  const sizes = {
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-8 w-8 sm:h-9 sm:w-9 rounded-xl',
    lg: 'h-10 w-10 sm:h-11 sm:w-11 rounded-2xl',
    xl: 'h-12 w-12 sm:h-14 sm:w-14 rounded-2xl',
  };

  return (
    <img
      src="/logo.png"
      alt="ProjectMatch AI Logo"
      className={`object-contain shadow-xs transition-transform group-hover:scale-105 shrink-0 ${sizes[size]} ${className}`}
    />
  );
}

interface BrandHeaderLinkProps {
  href?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  subtitle?: React.ReactNode;
  className?: string;
}

export default function BrandHeaderLink({
  href = '/',
  variant = 'light',
  size = 'md',
  subtitle,
  className = '',
}: BrandHeaderLinkProps) {
  return (
    <Link href={href} className={`flex items-center gap-2.5 sm:gap-3 group ${className}`} aria-label="ProjectMatch AI">
      <BrandLogo size={size} />
      <div className="flex flex-col">
        <BrandTitle variant={variant} size={size} />
        {subtitle && (
          <div className="mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
    </Link>
  );
}
