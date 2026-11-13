import React, { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore.js';
import { useTaskStore } from './store/useTaskStore.js';
import { useNotificationStore } from './store/useNotificationStore.js';
import { LiquidBackground } from './components/ui/LiquidBackground.js';
import { Navbar } from './components/layout/Navbar.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { MobileNav } from './components/layout/MobileNav.js';
import { DashboardView } from './components/dashboard/DashboardView.js';
import { TaskListView } from './components/tasks/TaskListView.js';
import { KanbanBoard } from './components/kanban/KanbanBoard.js';
import { CalendarView } from './components/calendar/CalendarView.js';
import { CreateTaskModal } from './components/tasks/CreateTaskModal.js';
import { TaskDetailModal } from './components/tasks/TaskDetailModal.js';
import { CategoryManageModal } from './components/tasks/CategoryManageModal.js';
import { ProfileModal } from './components/profile/ProfileModal.js';
import { AuthScreen } from './components/auth/AuthScreen.js';

export function App() {
  const { isAuthenticated, isLoading, initAuth } = useAuthStore();
  const { activeView, fetchTasks, fetchCategories, fetchStats, setIsCreateModalOpen } =
    useTaskStore();
  const { fetchNotifications } = useNotificationStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initialize Auth
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // When authenticated, load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchCategories();
      fetchStats();
      fetchNotifications();
    }
  }, [isAuthenticated, fetchTasks, fetchCategories, fetchStats, fetchNotifications]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for new task, / for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCreateModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsCreateModalOpen]);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-slate-50 dark:bg-[#0a0d14]">
        <LiquidBackground />
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 animate-spin flex items-center justify-center p-1">
            <div className="w-full h-full bg-white/20 rounded-xl" />
          </div>
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase animate-pulse">
            Loading Liquid Flow...
          </span>
        </div>
      </div>
    );
  }

  // Auth Screen
  if (!isAuthenticated) {
    return (
      <>
        <LiquidBackground />
        <AuthScreen />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative text-slate-900 dark:text-slate-100 pb-20 lg:pb-8">
      {/* Background Animated Fluid Orbs */}
      <LiquidBackground />

      {/* Top Navigation */}
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

      {/* Main App Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start gap-4 px-4 sm:px-6">
        {/* Floating Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Dynamic Center Stage */}
        <main className="flex-1 w-full py-2 min-w-0">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'kanban' && <KanbanBoard />}
          {activeView === 'calendar' && <CalendarView />}
          {['all', 'today', 'upcoming', 'overdue', 'completed'].includes(activeView) && (
            <TaskListView />
          )}
        </main>
      </div>

      {/* Mobile Bottom Dock Bar */}
      <MobileNav />

      {/* Modals & Drawers */}
      <CreateTaskModal />
      <TaskDetailModal />
      <CategoryManageModal />
      <ProfileModal />
    </div>
  );
}

export default App;
