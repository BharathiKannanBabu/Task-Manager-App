import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Light mode base soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#0a0d14] dark:via-[#0f1422] dark:to-[#080a0f] transition-colors duration-500" />

      {/* Floating Fluid Orb 1 - Cyan / Apple Blue */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full 
        bg-gradient-to-tr from-sky-400/20 via-blue-500/20 to-indigo-500/10 
        dark:from-blue-600/15 dark:via-sky-500/10 dark:to-transparent 
        blur-[120px] animate-liquid-pulse"
      />

      {/* Floating Fluid Orb 2 - Purple / Pink */}
      <div
        className="absolute top-[25%] -right-[15%] w-[50vw] h-[50vw] rounded-full 
        bg-gradient-to-bl from-purple-500/15 via-pink-400/15 to-transparent 
        dark:from-purple-900/20 dark:via-indigo-600/15 dark:to-transparent 
        blur-[130px] animate-liquid-pulse [animation-delay:3s]"
      />

      {/* Floating Fluid Orb 3 - Emerald / Mint Accent */}
      <div
        className="absolute -bottom-[20%] left-[20%] w-[45vw] h-[45vw] rounded-full 
        bg-gradient-to-t from-emerald-400/15 via-teal-400/10 to-transparent 
        dark:from-teal-800/15 dark:via-emerald-900/10 dark:to-transparent 
        blur-[140px] animate-liquid-pulse [animation-delay:6s]"
      />

      {/* Subtle subtle grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 dark:opacity-20" />
    </div>
  );
};
