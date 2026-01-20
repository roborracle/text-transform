'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { isClient, useLocalStorage } from '@/lib/utils/ssr-safe';

/**
 * Available theme options
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Resolved theme (what's actually applied)
 */
export type ResolvedTheme = 'light' | 'dark';

/**
 * Theme context value
 */
export interface ThemeContextValue {
  /** Current theme setting */
  theme: Theme;
  /** Resolved theme (light or dark) */
  resolvedTheme: ResolvedTheme;
  /** Set the theme */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
}

const STORAGE_KEY = 'text-transform-theme';

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Get the system's preferred color scheme
 */
function getSystemTheme(): ResolvedTheme {
  if (!isClient()) return 'light';

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Apply theme to document
 */
function applyTheme(theme: ResolvedTheme): void {
  if (!isClient()) return;

  const root = document.documentElement;

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      theme === 'dark' ? '#1f2937' : '#ffffff'
    );
  }
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme if none saved */
  defaultTheme?: Theme;
  /** Force a specific theme (useful for testing) */
  forcedTheme?: ResolvedTheme;
}

/**
 * Theme provider component
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  forcedTheme,
}: ThemeProviderProps) {
  // Use localStorage for persistence
  const [theme, setThemeStorage] = useLocalStorage<Theme>(STORAGE_KEY, defaultTheme);

  // Track system theme changes
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');

  // Calculate resolved theme
  const resolvedTheme: ResolvedTheme = forcedTheme ?? (theme === 'system' ? systemTheme : theme);

  // Listen for system theme changes
  useEffect(() => {
    if (!isClient()) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Apply theme to DOM when resolved theme changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // Apply theme immediately on mount to prevent flash
  useEffect(() => {
    if (!isClient()) return;

    // Read from localStorage directly for immediate application
    const stored = localStorage.getItem(STORAGE_KEY);
    const savedTheme = stored ? JSON.parse(stored) : defaultTheme;
    const initialResolved: ResolvedTheme =
      savedTheme === 'system' ? getSystemTheme() : savedTheme;

    applyTheme(initialResolved);
  }, [defaultTheme]);

  // Set theme handler
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeStorage(newTheme);
    },
    [setThemeStorage]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

/**
 * Script to inject in head to prevent theme flash
 * This runs before React hydration to set the correct theme class
 */
export const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('${STORAGE_KEY}');
    if (theme) theme = JSON.parse(theme);
    var isDark = theme === 'dark' ||
      (theme === 'system' || !theme) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default ThemeProvider;
