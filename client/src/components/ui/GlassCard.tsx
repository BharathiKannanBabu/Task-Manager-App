import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  glow?: 'blue' | 'purple' | 'green' | 'amber' | 'none';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  interactive = false,
  glow = 'none',
  className,
  ...props
}) => {
  const glowClasses = {
    none: '',
    blue: 'hover:shadow-[0_0_35px_-8px_rgba(0,113,227,0.35)]',
    purple: 'hover:shadow-[0_0_35px_-8px_rgba(175,82,222,0.35)]',
    green: 'hover:shadow-[0_0_35px_-8px_rgba(52,199,89,0.35)]',
    amber: 'hover:shadow-[0_0_35px_-8px_rgba(255,149,0,0.35)]',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl relative overflow-hidden backdrop-blur-xl',
          // Light theme
          'bg-white/60 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
          // Dark theme
          'dark:bg-slate-900/50 dark:border-white/[0.08] dark:shadow-[0_16px_36px_rgba(0,0,0,0.45)]',
          interactive &&
            'transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 dark:hover:bg-slate-900/70 cursor-pointer',
          glowClasses[glow],
          className
        )
      )}
      {...props}
    >
      {/* Specular highlight glare border line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
