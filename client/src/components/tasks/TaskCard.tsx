import React from 'react';
import { ITask } from '../../types/index.js';
import { useTaskStore } from '../../store/useTaskStore.js';
import { GlassCard } from '../ui/GlassCard.js';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../ui/Badge.js';
import {
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  CheckSquare2,
  Trash2,
  Edit3,
  Clock,
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: ITask;
  layout?: 'grid' | 'list';
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, layout = 'grid' }) => {
  const {
    setSelectedTask,
    setIsDetailModalOpen,
    updateTaskStatus,
    deleteTask,
    categories,
  } = useTaskStore();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const categoryObj = categories.find((c) => c.name === task.category);
  const categoryColor = categoryObj ? categoryObj.color : '#0071e3';

  const isCompleted = task.status === 'Completed';

  // Check overdue
  const isOverdue =
    task.dueDate && !isCompleted && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskProgress =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = isCompleted ? 'Todo' : 'Completed';
    updateTaskStatus(task._id, nextStatus);

    if (nextStatus === 'Completed') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleCardClick = () => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  if (layout === 'list') {
    return (
      <GlassCard
        interactive
        onClick={handleCardClick}
        className={`p-4 transition-all duration-200 border-l-4 ${
          isCompleted
            ? 'border-l-emerald-500 opacity-70'
            : isOverdue
            ? 'border-l-rose-500'
            : 'border-l-blue-500'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <button
              onClick={handleToggleComplete}
              className="text-slate-400 hover:text-emerald-500 transition-colors flex-shrink-0"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <h4
                className={`text-sm font-semibold truncate ${
                  isCompleted
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <CategoryBadge category={task.category} color={categoryColor} size="sm" />
            <PriorityBadge priority={task.priority} size="sm" />
            <StatusBadge status={task.status} size="sm" />

            {task.dueDate && (
              <span
                className={`text-xs flex items-center gap-1 font-medium ${
                  isOverdue
                    ? 'text-rose-500 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {format(new Date(task.dueDate), 'MMM d')}
                </span>
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task._id);
              }}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      interactive
      onClick={handleCardClick}
      className={`p-5 flex flex-col justify-between group transition-all duration-300 relative ${
        isCompleted ? 'opacity-70 dark:opacity-60' : ''
      }`}
    >
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <CategoryBadge category={task.category} color={categoryColor} size="sm" />
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={task.priority} size="sm" />

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                    }}
                  />
                  <div className="absolute right-0 top-6 w-36 rounded-xl liquid-glass-modal p-1.5 shadow-xl z-40 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        setSelectedTask(task);
                        setIsDetailModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        deleteTask(task._id);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Task
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Task Title & Complete toggle */}
        <div className="flex items-start gap-3 mb-2">
          <button
            onClick={handleToggleComplete}
            className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors flex-shrink-0"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
          <h4
            className={`text-sm sm:text-base font-semibold leading-snug ${
              isCompleted
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {task.title}
          </h4>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 pl-8">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3 pl-8">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="pt-3 border-t border-slate-200/50 dark:border-white/5 flex flex-col gap-2">
        {/* Subtask progress bar */}
        {totalSubtasks > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <CheckSquare2 className="w-3 h-3" />
                Subtasks
              </span>
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200/60 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                style={{ width: `${subtaskProgress}%` }}
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Due date & status */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <StatusBadge status={task.status} size="sm" />

          {task.dueDate && (
            <div
              className={`flex items-center gap-1 font-medium ${
                isOverdue
                  ? 'text-rose-500 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
