import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { GlassCard } from '../ui/GlassCard.js';
import { TrendingUp, BarChart3 } from 'lucide-react';

export const WeeklyChart: React.FC = () => {
  const { stats } = useTaskStore();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartData = stats?.weeklyChartData || [
    { day: 'Mon', completed: 0, date: '' },
    { day: 'Tue', completed: 0, date: '' },
    { day: 'Wed', completed: 0, date: '' },
    { day: 'Thu', completed: 0, date: '' },
    { day: 'Fri', completed: 0, date: '' },
    { day: 'Sat', completed: 0, date: '' },
    { day: 'Sun', completed: 0, date: '' },
  ];

  const maxVal = Math.max(...chartData.map((d) => d.completed), 4);
  const totalWeeklyCompleted = chartData.reduce((acc, curr) => acc + curr.completed, 0);

  return (
    <GlassCard className="p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              Weekly Productivity
            </h3>
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-500">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tasks completed over the last 7 days
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{totalWeeklyCompleted} completed</span>
        </div>
      </div>

      {/* Liquid Bar Visualization */}
      <div className="relative pt-6 pb-2">
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-44 px-2">
          {chartData.map((item, idx) => {
            const heightPercent = Math.max(8, Math.round((item.completed / maxVal) * 100));
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.day + idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Floating tooltip */}
                {isHovered && (
                  <div className="absolute -top-10 z-20 px-2 py-1 rounded-lg liquid-glass-modal text-[11px] font-bold text-slate-900 dark:text-white shadow-lg pointer-events-none whitespace-nowrap animate-fade-in">
                    {item.completed} {item.completed === 1 ? 'task' : 'tasks'}
                  </div>
                )}

                {/* Liquid Glass Pillar */}
                <div className="w-full max-w-[42px] bg-slate-200/50 dark:bg-white/[0.04] rounded-2xl p-1 h-full flex flex-col justify-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-xl transition-all duration-500 relative overflow-hidden ${
                      item.completed > 0
                        ? 'bg-gradient-to-t from-blue-600 to-sky-400 dark:from-blue-600 dark:to-cyan-400 shadow-md shadow-blue-500/30'
                        : 'bg-slate-300/40 dark:bg-white/[0.08]'
                    }`}
                  >
                    {/* Gloss specular line */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/40" />
                  </div>
                </div>

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2.5">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};
