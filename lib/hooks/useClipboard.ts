'use client';

import { useState, useCallback } from 'react';

interface UseClipboardOptions {
  /** Duration to show success state in milliseconds */
  successDuration?: number;
}

interface UseClipboardReturn {
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Whether copy was recently successful */
  copied: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Reset the copied state */
  reset: () => void;
}

/**
 * Hook for clipboard operations with copy feedback
 */
export function useClipboard(
  options: UseClipboardOptions = {}
): UseClipboardReturn {
  const { successDuration = 2000 } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      // Reset previous state
      setError(null);
      setCopied(false);

      try {
        // Check if clipboard API is available
        if (!navigator?.clipboard) {
          throw new Error('Clipboard API not available');
        }

        await navigator.clipboard.writeText(text);
        setCopied(true);

        // Reset copied state after duration
        setTimeout(() => {
          setCopied(false);
        }, successDuration);

        return true;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to copy to clipboard');
        setError(error);
        return false;
      }
    },
    [successDuration]
  );

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  return { copy, copied, error, reset };
}

export default useClipboard;
