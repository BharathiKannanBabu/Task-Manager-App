import React from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { ViewMode } from '../../types/index.js';
import { LayoutDashboard, CheckSquare, KanbanSquare, Calendar, Plus } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, setIsCreateModalOpen } = useTaskStore();

  const tabs: Array<{ id: ViewMode; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'all', label: 'Tasks', icon: CheckSquare },
    { id: 'kanban', label: 'Kanban', icon: KanbanSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 inset-x-4 z-40">
      <div className="flex items-center justify-around py-2 px-3 rounded-2xl liquid-glass shadow-2xl border border-white/60 dark:border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-sky-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        {/* Quick Add Floating Button in Bottom Bar */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/40 hover:bg-blue-700 transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
