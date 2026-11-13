import React from 'react';
import { Priority, Status } from '../../types/index.js';
import { AlertCircle, CheckCircle2, Clock, CircleDot, Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const configs = {
    Low: {
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CircleDot,
      label: 'Low',
    },
    Medium: {
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      icon: Clock,
      label: 'Medium',
    },
    High: {
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: AlertCircle,
      label: 'High',
    },
    Urgent: {
      color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse',
      icon: Flame,
      label: 'Urgent',
    },
  };

  const config = configs[priority] || configs.Medium;
  const Icon = config.icon;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-all ${config.color} ${padding}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs = {
    Todo: {
      color: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
      icon: CircleDot,
      label: 'To Do',
    },
    'In Progress': {
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: Clock,
      label: 'In Progress',
    },
    Review: {
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      icon: AlertCircle,
      label: 'Review',
    },
    Completed: {
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
      label: 'Completed',
    },
  };

  const config = configs[status] || configs.Todo;
  const Icon = config.icon;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md ${config.color} ${padding}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

interface CategoryBadgeProps {
  category: string;
  color?: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  color = '#0071e3',
  size = 'md',
}) => {
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium backdrop-blur-md 
      bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-200 ${padding}`}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
      />
      <span className="truncate max-w-[120px]">{category}</span>
    </span>
  );
};
