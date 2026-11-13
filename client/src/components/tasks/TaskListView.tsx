import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { TaskCard } from './TaskCard.js';
import { TaskFilterBar } from './TaskFilterBar.js';
import { GlassCard } from '../ui/GlassCard.js';
import { CheckSquare, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskListView: React.FC = () => {
  const { tasks, isLoading, activeView, setIsCreateModalOpen } = useTaskStore();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const getTitle = () => {
    switch (activeView) {
      case 'today':
        return "Today's Focus";
      case 'upcoming':
        return 'Upcoming Tasks';
      case 'overdue':
        return 'Overdue Attention';
      case 'completed':
        return 'Completed Archive';
      default:
        return 'All Tasks';
    }
  };

  const getSubtitle = () => {
    switch (activeView) {
      case 'today':
        return 'Tasks scheduled for completion today';
      case 'upcoming':
        return 'Deadlines and milestones on the horizon';
      case 'overdue':
        return 'Tasks that passed their scheduled due date';
      case 'completed':
        return 'Accomplishments and delivered objectives';
      default:
        return 'Comprehensive registry of all workflows';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>{getTitle()}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
              {tasks.length}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {getSubtitle()}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl liquid-btn-primary text-xs sm:text-sm font-semibold tracking-wide self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter and layout controls */}
      <TaskFilterBar layout={layout} onLayoutChange={setLayout} />

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className={`grid ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-4`}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <GlassCard key={i} className="p-5 h-44 animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-24 h-4 bg-slate-200/70 dark:bg-white/10 rounded-full" />
                <div className="w-3/4 h-5 bg-slate-300/70 dark:bg-white/15 rounded-lg" />
                <div className="w-full h-3 bg-slate-200/50 dark:bg-white/10 rounded-md" />
              </div>
              <div className="w-1/3 h-4 bg-slate-200/70 dark:bg-white/10 rounded-full" />
            </GlassCard>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <GlassCard className="p-12 text-center max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-sm">
            <CheckSquare className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No tasks found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
            There are no tasks matching your current view or filter criteria. Create your next objective!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl liquid-btn-primary text-xs sm:text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </GlassCard>
      ) : (
        /* Task Cards Container */
        <motion.div
          layout
          className={`grid ${
            layout === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
              : 'grid-cols-1'
          } gap-4`}
        >
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard task={task} layout={layout} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
