'use client';

import { useEffect, useCallback } from 'react';

type ModifierKey = 'ctrl' | 'meta' | 'alt' | 'shift';

interface ShortcutConfig {
  key: string;
  modifiers?: ModifierKey[];
  callback: () => void;
  preventDefault?: boolean;
}

/**
 * Hook for handling keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only allow escape in inputs
        if (event.key !== 'Escape') {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const { key, modifiers = [], callback, preventDefault = true } = shortcut;

        // Check if the key matches
        if (event.key.toLowerCase() !== key.toLowerCase()) {
          continue;
        }

        // Check modifiers
        const ctrlOrMeta = modifiers.includes('ctrl') || modifiers.includes('meta');
        const hasCtrlOrMeta = event.ctrlKey || event.metaKey;
        const needsCtrlOrMeta = ctrlOrMeta;

        const hasAlt = event.altKey;
        const needsAlt = modifiers.includes('alt');

        const hasShift = event.shiftKey;
        const needsShift = modifiers.includes('shift');

        if (
          needsCtrlOrMeta === hasCtrlOrMeta &&
          needsAlt === hasAlt &&
          needsShift === hasShift
        ) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Hook for a single keyboard shortcut
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: ModifierKey[] = [],
  preventDefault = true
) {
  useKeyboardShortcuts([{ key, modifiers, callback, preventDefault }]);
}

export default useKeyboardShortcuts;
