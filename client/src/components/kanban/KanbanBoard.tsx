import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { ITask, Status } from '../../types/index.js';
import { TaskCard } from '../tasks/TaskCard.js';
import { GlassCard } from '../ui/GlassCard.js';
import {
  CircleDot,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ColumnDef {
  id: Status;
  title: string;
  icon: React.FC<{ className?: string }>;
  headerColor: string;
}

const COLUMNS: ColumnDef[] = [
  {
    id: 'Todo',
    title: 'To Do',
    icon: CircleDot,
    headerColor: 'text-slate-600 dark:text-slate-300',
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    icon: Clock,
    headerColor: 'text-blue-600 dark:text-sky-400',
  },
  {
    id: 'Review',
    title: 'Review',
    icon: AlertCircle,
    headerColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'Completed',
    title: 'Completed',
    icon: CheckCircle2,
    headerColor: 'text-emerald-600 dark:text-emerald-400',
  },
];

export const KanbanBoard: React.FC = () => {
  const { tasks, reorderKanban, setIsCreateModalOpen } = useTaskStore();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<Status | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== status) {
      setActiveDropColumn(status);
    }
  };

  const handleDragLeave = () => {
    setActiveDropColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Status) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;

    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) {
      setDraggedTaskId(null);
      return;
    }

    // Reorder/update status
    await reorderKanban(taskId, newStatus);
    setDraggedTaskId(null);

    if (newStatus === 'Completed') {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Interactive Kanban Board</span>
            <span className="p-1 rounded-lg bg-blue-500/10 text-blue-500">
              <Sparkles className="w-4 h-4" />
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag and drop tasks freely between pipeline workflow phases
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl liquid-btn-primary text-xs sm:text-sm font-semibold tracking-wide self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const Icon = col.icon;
          const isOver = activeDropColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col rounded-3xl p-3 sm:p-4 min-h-[500px] transition-all duration-200 ${
                isOver
                  ? 'liquid-glass ring-2 ring-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 shadow-xl'
                  : 'liquid-glass bg-white/40 dark:bg-slate-900/40'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${col.headerColor}`} />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {col.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/10 font-bold text-slate-600 dark:text-slate-300">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Tasks */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-300/50 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-xs text-slate-400">
                    Drop tasks here
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className={`cursor-grab active:cursor-grabbing transition-transform active:scale-[0.98] ${
                        draggedTaskId === task._id ? 'opacity-40' : ''
                      }`}
                    >
                      <TaskCard task={task} layout="grid" />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
