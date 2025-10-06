/**
 * @fileOverview Theme management hook for light/dark mode toggle.
 */

import { useEffect, useState } from 'react';
import { DEFAULTS, LOCAL_STORAGE_KEYS } from '../config/constants';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Custom hook for managing theme state and persistence.
 *
 * @returns Theme management utilities
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return DEFAULTS.THEME;
    return (
      (localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as Theme) ||
      DEFAULTS.THEME
    );
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as Theme;
    if (stored === 'light' || stored === 'dark') return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      setResolvedTheme(systemTheme);
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setResolvedTheme(theme);
      root.classList.toggle('dark', theme === 'dark');
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(systemTheme);
        document.documentElement.classList.toggle(
          'dark',
          systemTheme === 'dark'
        );
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    theme,
    setTheme,
    resolvedTheme,
  };
}
