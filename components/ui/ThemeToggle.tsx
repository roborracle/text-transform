'use client';

import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { Button } from './Button';

/**
 * Sun icon for light mode
 */
function SunIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

/**
 * Moon icon for dark mode
 */
function MoonIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

/**
 * Computer icon for system theme
 */
function ComputerIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

/**
 * ThemeToggle component props
 */
export interface ThemeToggleProps {
  /** Show as dropdown with all options */
  showDropdown?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Simple theme toggle button
 */
export function ThemeToggle({ showDropdown = false, className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (showDropdown) {
    return (
      <div className={`relative inline-block ${className}`}>
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <ThemeButton
            currentTheme={theme}
            targetTheme="light"
            onClick={() => setTheme('light')}
            icon={<SunIcon />}
            label="Light"
          />
          <ThemeButton
            currentTheme={theme}
            targetTheme="dark"
            onClick={() => setTheme('dark')}
            icon={<MoonIcon />}
            label="Dark"
          />
          <ThemeButton
            currentTheme={theme}
            targetTheme="system"
            onClick={() => setTheme('system')}
            icon={<ComputerIcon />}
            label="System"
          />
        </div>
      </div>
    );
  }

  // Simple toggle button
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}

/**
 * Theme button for dropdown mode
 */
interface ThemeButtonProps {
  currentTheme: Theme;
  targetTheme: Theme;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ThemeButton({ currentTheme, targetTheme, onClick, icon, label }: ThemeButtonProps) {
  const isActive = currentTheme === targetTheme;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center p-2 rounded-md transition-colors
        ${isActive
          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }
      `}
      aria-label={`Switch to ${label} theme`}
      title={label}
    >
      {icon}
    </button>
  );
}

export default ThemeToggle;
