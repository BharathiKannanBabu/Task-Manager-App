import React from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { ViewMode } from '../../types/index.js';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  KanbanSquare,
  Clock,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  Tag,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeView,
    setActiveView,
    categories,
    tasks,
    filters,
    setFilter,
    setIsCategoryModalOpen,
  } = useTaskStore();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // Compute live counts
  const totalCount = tasks.length;
  const todayCount = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate);
    return d >= startOfToday && d <= endOfToday;
  }).length;
  const overdueCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'Completed') return false;
    return new Date(t.dueDate) < startOfToday;
  }).length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  const navItems: Array<{
    id: ViewMode;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all', label: 'All Tasks', icon: CheckSquare, badge: totalCount },
    {
      id: 'today',
      label: "Today's Tasks",
      icon: Clock,
      badge: todayCount,
      badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: AlertCircle,
      badge: overdueCount,
      badgeColor: overdueCount > 0 ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold' : undefined,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      badge: completedCount,
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
    { id: 'kanban', label: 'Kanban Board', icon: KanbanSquare },
    { id: 'calendar', label: 'Interactive Calendar', icon: Calendar },
  ];

  const handleSelectView = (view: ViewMode) => {
    setActiveView(view);
    if (mobileOpen) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-5 select-none">
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between pb-4 mb-2 border-b border-slate-200/60 dark:border-white/10">
        <span className="font-bold text-slate-900 dark:text-white">Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Views Section */}
      <div className="mb-6">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 px-3 mb-2">
          Views & Workflows
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Categories Filter Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Categories
          </span>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            title="Create Custom Category"
            className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-1">
          {/* All categories option */}
          <button
            onClick={() => setFilter('category', 'All')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              filters.category === 'All'
                ? 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>All Categories</span>
            </div>
            <span className="text-[11px] text-slate-400">{tasks.length}</span>
          </button>

          {categories.map((cat) => {
            const count = tasks.filter((t) => t.category === cat.name).length;
            const isSelected = filters.category === cat.name;
            return (
              <button
                key={cat._id}
                onClick={() => setFilter('category', cat.name)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color, boxShadow: `0 0 6px ${cat.color}80` }}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-[11px] text-slate-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority Filters */}
      <div className="mt-auto pt-4 border-t border-slate-200/60 dark:border-white/10">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 px-3 mb-2 flex items-center gap-1.5">
          <Tag className="w-3 h-3" />
          Filter Priority
        </div>
        <div className="grid grid-cols-2 gap-1.5 px-1">
          {['All', 'Urgent', 'High', 'Medium', 'Low'].map((p) => {
            const isSelected = filters.priority === p;
            return (
              <button
                key={p}
                onClick={() => setFilter('priority', p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium text-center transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-sm'
                    : 'bg-black/[0.03] dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Floating Glass Dock) */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-5.5rem)] sticky top-20 pl-6 pr-2 py-2">
        <div className="h-full liquid-glass rounded-3xl overflow-hidden shadow-lg">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full liquid-glass-modal shadow-2xl z-10 flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
