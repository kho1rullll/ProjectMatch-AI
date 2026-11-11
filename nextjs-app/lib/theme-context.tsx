'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'dim';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const THEME_STORAGE_KEY = 'projectmatch_theme';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (stored === 'light' || stored === 'dark' || stored === 'dim') {
        setThemeState(stored);
        document.documentElement.setAttribute('data-theme', stored);
        document.body.setAttribute('data-theme', stored);
      } else {
        const currentDocTheme = document.documentElement.getAttribute('data-theme') as Theme;
        if (currentDocTheme === 'dark' || currentDocTheme === 'dim') {
          setThemeState(currentDocTheme);
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          document.body.setAttribute('data-theme', 'light');
        }
      }
    } catch {
      // Fallback in case localStorage is blocked
    }
    setIsInitialized(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light' as Theme,
      setTheme: () => {},
    };
  }
  return context;
}

