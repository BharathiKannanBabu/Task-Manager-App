import { create } from 'zustand';
import { Theme } from '../types/index.js';

interface ThemeState {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem('liquid_theme') as Theme | null;
  return stored || 'system';
};

const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeToDOM = (theme: Theme): 'light' | 'dark' => {
  const effective = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (effective === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  return effective;
};

export const useThemeStore = create<ThemeState>((set, get) => {
  const initialTheme = getStoredTheme();
  const initialEffective = applyThemeToDOM(initialTheme);

  // Listen to system theme changes if set to system
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (get().theme === 'system') {
        const effective = applyThemeToDOM('system');
        set({ effectiveTheme: effective });
      }
    });
  }

  return {
    theme: initialTheme,
    effectiveTheme: initialEffective,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem('liquid_theme', newTheme);
      const effective = applyThemeToDOM(newTheme);
      set({ theme: newTheme, effectiveTheme: effective });
    },
    toggleTheme: () => {
      const current = get().effectiveTheme;
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      get().setTheme(next);
    },
  };
});
