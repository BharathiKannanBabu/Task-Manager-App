import React from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { GlassCard } from '../ui/GlassCard.js';
import { PriorityBadge } from '../ui/Badge.js';
import { Clock, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';

export const UpcomingDeadlines: React.FC = () => {
  const { stats, setSelectedTask, setIsDetailModalOpen, updateTaskStatus } = useTaskStore();
  const tasks = stats?.upcomingDeadlines || [];

  const formatDueDate = (dateStr?: string | null) => {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    if (isToday(d)) return 'Due Today';
    if (isTomorrow(d)) return 'Due Tomorrow';
    return `Due ${format(d, 'MMM d')}`;
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Upcoming Deadlines
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Prioritized tasks requiring focus
          </p>
        </div>
        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
          <Clock className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-2.5">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-500" />
            No immediate deadlines pending! All caught up.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              onClick={() => {
                setSelectedTask(task);
                setIsDetailModalOpen(true);
              }}
              className="group flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-white/[0.03] hover:bg-white/80 dark:hover:bg-white/[0.08] border border-white/60 dark:border-white/5 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTaskStatus(task._id, 'Completed');
                  }}
                  title="Mark as Completed"
                  className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-500/10 transition-colors flex-shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-transparent hover:text-emerald-500" />
                </button>

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-sky-400">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDueDate(task.dueDate)}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[100px]">
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <PriorityBadge priority={task.priority} size="sm" />
                <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};
