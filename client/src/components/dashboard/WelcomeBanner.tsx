import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useTaskStore } from '../../store/useTaskStore.js';
import { GlassCard } from '../ui/GlassCard.js';
import { Sparkles, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuthStore();
  const { stats, setActiveView } = useTaskStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const completionRate = stats?.summary?.completionRate ?? 0;

  return (
    <GlassCard glow="blue" className="p-6 sm:p-8 mb-6 relative overflow-hidden">
      {/* Background soft ambient blur */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 right-48 w-48 h-48 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-sky-400 text-xs font-semibold mb-3 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Liquid Flow Productivity Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()},{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300 bg-clip-text text-transparent">
              {user?.name?.split(' ')[0] || 'Maker'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{format(currentTime, 'EEEE, MMMM do, yyyy')}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
              {format(currentTime, 'hh:mm:ss a')}
            </span>
          </p>
        </div>

        {/* Productivity progress widget */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-white/[0.05] border border-white/60 dark:border-white/10 backdrop-blur-md">
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 dark:text-sky-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${completionRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-800 dark:text-white">
              {completionRate}%
            </span>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completion Rate
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {stats?.summary?.completedTasks ?? 0} of {stats?.summary?.totalTasks ?? 0} Done
            </div>
            <button
              onClick={() => setActiveView('today')}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-sky-400 hover:underline mt-0.5"
            >
              <span>View today's focus</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
