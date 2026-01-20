'use client';

import { useEffect, useCallback } from 'react';

type ModifierKey = 'ctrl' | 'meta' | 'alt' | 'shift';

interface ShortcutConfig {
  key: string;
  modifiers?: ModifierKey[];
  callback: () => void;
  preventDefault?: boolean;
  /** Allow this shortcut to trigger even when focused on input/textarea */
  allowInInputs?: boolean;
}

/**
 * Hook for handling keyboard shortcuts
 *
 * @example
 * useKeyboardShortcuts([
 *   { key: 'k', modifiers: ['meta'], callback: openSearch },
 *   { key: 'c', modifiers: ['meta', 'shift'], callback: copyOutput, allowInInputs: true },
 * ]);
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const {
          key,
          modifiers = [],
          callback,
          preventDefault = true,
          allowInInputs = false,
        } = shortcut;

        // Skip if in input and shortcut doesn't allow it (except Escape)
        if (isInInput && !allowInInputs && event.key !== 'Escape') {
          continue;
        }

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
  preventDefault = true,
  allowInInputs = false
) {
  useKeyboardShortcuts([{ key, modifiers, callback, preventDefault, allowInInputs }]);
}

export type { ShortcutConfig, ModifierKey };
export default useKeyboardShortcuts;
