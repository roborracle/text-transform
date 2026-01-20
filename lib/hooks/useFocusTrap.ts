'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

/**
 * Hook to trap focus within a container element
 * Used for modals and dialogs to ensure keyboard accessibility
 */
export function useFocusTrap<T extends HTMLElement>(
  isActive: boolean,
  options: {
    /** Return focus to this element when trap is deactivated */
    returnFocusRef?: RefObject<HTMLElement | null>;
    /** Auto-focus first focusable element when activated */
    autoFocus?: boolean;
  } = {}
): RefObject<T | null> {
  const { returnFocusRef, autoFocus = true } = options;
  const containerRef = useRef<T | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  // Store returnFocusRef.current at effect start to avoid stale ref warning
  const returnFocusTarget = returnFocusRef?.current;

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);

    // Auto-focus first element
    if (autoFocus && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const elements = getFocusableElements(container);
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: going backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: going forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      // Return focus to previous element or specified element
      const returnTarget = returnFocusTarget || previousActiveElement.current;
      if (returnTarget && typeof returnTarget.focus === 'function') {
        returnTarget.focus();
      }
    };
  }, [isActive, autoFocus, returnFocusTarget]);

  return containerRef;
}

export default useFocusTrap;
