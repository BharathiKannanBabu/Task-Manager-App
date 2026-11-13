import React from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { GlassCard } from '../ui/GlassCard.js';
import { CheckSquare, CheckCircle2, Clock, AlertTriangle, CalendarDays } from 'lucide-react';
import { ViewMode } from '../../types/index.js';

export const StatCards: React.FC = () => {
  const { stats, setActiveView } = useTaskStore();

  const cards: Array<{
    title: string;
    value: number;
    subtext: string;
    icon: React.FC<{ className?: string }>;
    color: string;
    glow: 'blue' | 'purple' | 'green' | 'amber';
    viewTarget: ViewMode;
  }> = [
    {
      title: 'Total Tasks',
      value: stats?.summary?.totalTasks ?? 0,
      subtext: 'Across all workflows',
      icon: CheckSquare,
      color: 'from-blue-500 to-indigo-600 text-blue-500',
      glow: 'blue',
      viewTarget: 'all',
    },
    {
      title: 'Completed',
      value: stats?.summary?.completedTasks ?? 0,
      subtext: `${stats?.summary?.completionRate ?? 0}% overall efficiency`,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600 text-emerald-500',
      glow: 'green',
      viewTarget: 'completed',
    },
    {
      title: 'Pending',
      value: stats?.summary?.pendingTasks ?? 0,
      subtext: 'Active in flight',
      icon: Clock,
      color: 'from-sky-500 to-cyan-600 text-sky-500',
      glow: 'blue',
      viewTarget: 'all',
    },
    {
      title: 'Overdue',
      value: stats?.summary?.overdueTasks ?? 0,
      subtext: 'Requires immediate action',
      icon: AlertTriangle,
      color: 'from-rose-500 to-red-600 text-rose-500',
      glow: 'amber',
      viewTarget: 'overdue',
    },
    {
      title: "Today's Tasks",
      value: stats?.summary?.todayTasks ?? 0,
      subtext: 'Scheduled for today',
      icon: CalendarDays,
      color: 'from-purple-500 to-pink-600 text-purple-500',
      glow: 'purple',
      viewTarget: 'today',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <GlassCard
            key={c.title}
            interactive
            glow={c.glow}
            onClick={() => setActiveView(c.viewTarget)}
            className="p-4 sm:p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl bg-gradient-to-tr ${c.color} bg-opacity-10 text-white shadow-sm flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {c.value}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                {c.subtext}
              </p>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
