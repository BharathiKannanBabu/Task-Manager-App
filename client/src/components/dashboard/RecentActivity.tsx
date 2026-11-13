import React from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { GlassCard } from '../ui/GlassCard.js';
import { Activity, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const RecentActivity: React.FC = () => {
  const { stats } = useTaskStore();
  const activities = stats?.recentActivities || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'deadline':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'overdue':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Recent Activities
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time event stream
          </p>
        </div>
        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
          <Activity className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No recent activity logged yet.
          </div>
        ) : (
          activities.map((act) => (
            <div
              key={act._id}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-white/30 dark:bg-white/[0.02] border border-white/50 dark:border-white/5 text-xs"
            >
              <div className="p-1.5 rounded-lg bg-white/70 dark:bg-white/10 shadow-xs flex-shrink-0 mt-0.5">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {act.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {act.message}
                </p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};
