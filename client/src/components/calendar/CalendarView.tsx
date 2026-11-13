import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { GlassCard } from '../ui/GlassCard.js';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
} from 'date-fns';

type CalendarSubView = 'month' | 'week' | 'day';

export const CalendarView: React.FC = () => {
  const { tasks, setSelectedTask, setIsDetailModalOpen, setIsCreateModalOpen } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [subView, setSubView] = useState<CalendarSubView>('month');

  // Month navigation
  const nextPeriod = () => setCurrentDate(addMonths(currentDate, 1));
  const prevPeriod = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Compute month days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDay = (day: Date) => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      return isSameDay(new Date(t.dueDate), day);
    });
  };

  const handleDayClick = (day: Date) => {
    setCurrentDate(day);
  };

  const handleTaskClick = (e: React.MouseEvent, task: any) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Interactive Calendar</span>
            <span className="p-1 rounded-lg bg-blue-500/10 text-blue-500">
              <Sparkles className="w-4 h-4" />
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track deadlines, schedule milestones, and inspect time-based deliverables
          </p>
        </div>

        {/* View mode switcher & controls */}
        <div className="flex items-center gap-2">
          {/* Subview pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-200/50 dark:bg-white/[0.06] border border-slate-300/40 dark:border-white/10 text-xs">
            {(['month', 'week', 'day'] as CalendarSubView[]).map((v) => (
              <button
                key={v}
                onClick={() => setSubView(v)}
                className={`capitalize px-3 py-1 rounded-lg font-medium transition-all ${
                  subView === v
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-btn-primary text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Card Container */}
      <GlassCard className="p-4 sm:p-6 overflow-hidden">
        {/* Navigation Toolbar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex items-center gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <button
              onClick={goToToday}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevPeriod}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextPeriod}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Month View Grid */}
        {subView === 'month' && (
          <div>
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {days.map((day, idx) => {
                const dayTasks = getTasksForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={day.toISOString() + idx}
                    onClick={() => handleDayClick(day)}
                    className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-2xl border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                      isCurrentDay
                        ? 'bg-blue-50/70 dark:bg-blue-950/25 border-blue-400/40 dark:border-blue-500/30 shadow-xs'
                        : isCurrentMonth
                        ? 'bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-white/5 hover:bg-white/70 dark:hover:bg-slate-800/50'
                        : 'opacity-40 bg-transparent border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                          isCurrentDay
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>

                      {dayTasks.length > 0 && (
                        <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                          {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                        </span>
                      )}
                    </div>

                    {/* Task pills in day */}
                    <div className="space-y-1 mt-1 overflow-y-auto max-h-[60px]">
                      {dayTasks.slice(0, 3).map((task) => {
                        const isTaskOverdue =
                          task.status !== 'Completed' &&
                          isPast(new Date(task.dueDate!)) &&
                          !isToday(new Date(task.dueDate!));

                        return (
                          <div
                            key={task._id}
                            onClick={(e) => handleTaskClick(e, task)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate transition-transform hover:scale-[1.02] shadow-2xs ${
                              task.status === 'Completed'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 line-through'
                                : isTaskOverdue
                                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold'
                                : 'bg-blue-500/15 text-blue-700 dark:text-sky-300'
                            }`}
                          >
                            {task.title}
                          </div>
                        );
                      })}
                      {dayTasks.length > 3 && (
                        <div className="text-[9px] text-slate-400 font-semibold pl-1">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Week View */}
        {subView === 'week' && (
          <div className="space-y-3">
            {eachDayOfInterval({
              start: startOfWeek(currentDate),
              end: endOfWeek(currentDate),
            }).map((day) => {
              const dayTasks = getTasksForDay(day);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`p-3 rounded-2xl border transition-all ${
                    isCurrentDay
                      ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-400/40'
                      : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isCurrentDay ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {format(day, 'EEEE, MMM d')}
                    </span>
                    <span className="text-xs text-slate-400">{dayTasks.length} tasks scheduled</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {dayTasks.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-1">No tasks due</p>
                    ) : (
                      dayTasks.map((task) => (
                        <div
                          key={task._id}
                          onClick={(e) => handleTaskClick(e, task)}
                          className="p-2.5 rounded-xl bg-white/60 dark:bg-white/[0.04] border border-white/60 dark:border-white/5 cursor-pointer hover:border-blue-500/40 transition-colors"
                        >
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{task.category}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Day View */}
        {subView === 'day' && (
          <div className="space-y-4">
            <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              <span>{format(currentDate, 'EEEE, MMMM do, yyyy')}</span>
            </div>

            <div className="space-y-2">
              {getTasksForDay(currentDate).length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">
                  No tasks due on this day. Click "+ Add Event" to plan one!
                </div>
              ) : (
                getTasksForDay(currentDate).map((task) => (
                  <div
                    key={task._id}
                    onClick={(e) => handleTaskClick(e, task)}
                    className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.04] border border-white/60 dark:border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/80 dark:hover:bg-white/[0.08] transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{task.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-sky-400">
                      {task.priority} Priority
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
