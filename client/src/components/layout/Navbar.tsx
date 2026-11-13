import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useTaskStore } from "../../store/useTaskStore.js";
import { ThemeSwitcher } from "./ThemeSwitcher.js";
import { NotificationPopover } from "../notifications/NotificationPopover.js";
import {
  Search,
  Plus,
  Menu,
  Sparkles,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuthStore();
  const { setIsCreateModalOpen, setIsProfileModalOpen, filters, setFilter } =
    useTaskStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 liquid-glass rounded-2xl px-4 py-2.5">
        {/* Left Section: Mobile Menu + Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Toggle Navigation"
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1px] shadow-md shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 dark:from-white dark:via-slate-100 dark:to-sky-400 bg-clip-text text-transparent">
                Task Manager
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-wide uppercase px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder="Search tasks, descriptions, tags... (Press /)"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl liquid-input text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            {filters.search && (
              <button
                onClick={() => setFilter("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Task Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl liquid-btn-primary text-xs sm:text-sm font-semibold tracking-wide"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Theme switcher */}
          <ThemeSwitcher />

          {/* Notifications */}
          <NotificationPopover />

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
            >
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
                    user?.name || "Alex",
                  )}`
                }
                alt={user?.name}
                className="w-7 h-7 rounded-full object-cover border border-white/50 dark:border-white/20 shadow-sm"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-56 rounded-2xl liquid-glass-modal p-2 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-slate-200/60 dark:border-white/10 mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-500" />
                      Profile & Settings
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      Preferences
                    </button>

                    <div className="my-1 border-t border-slate-200/60 dark:border-white/10" />

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
