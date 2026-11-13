import React from 'react';
import { useThemeStore } from '../../store/useThemeStore.js';
import { Sun, Moon, Laptop } from 'lucide-react';
import { Theme } from '../../types/index.js';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const themes: Array<{ id: Theme; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ];

  return (
    <div className="flex items-center p-1 rounded-full bg-slate-200/50 dark:bg-white/[0.08] backdrop-blur-md border border-slate-300/40 dark:border-white/10 shadow-inner">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={`${t.label} Mode`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
