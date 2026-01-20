/**
 * State management hook for transformation tools
 * Handles input, output, error, loading states with debouncing
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { validateInputSize, DEFAULT_DEBOUNCE_MS } from '@/lib/validation';
import { isTransformationError } from '@/lib/errors';

/**
 * Transform function type - can be sync or async
 */
export type TransformFn<TOptions = Record<string, unknown>> = (
  input: string,
  options?: TOptions
) => string | Promise<string>;

/**
 * Options for useTransformState hook
 */
export interface UseTransformStateOptions<TOptions = Record<string, unknown>> {
  /** The transformation function to execute */
  transformFn: TransformFn<TOptions>;
  /** Debounce delay in milliseconds (default: 150ms) */
  debounceMs?: number;
  /** Enable real-time transformation as user types */
  realtime?: boolean;
  /** Initial input value */
  initialInput?: string;
  /** Initial options for the transform function */
  initialOptions?: TOptions;
  /** Maximum input size in characters */
  maxInputSize?: number;
}

/**
 * State returned by useTransformState hook
 */
export interface TransformState<TOptions = Record<string, unknown>> {
  /** Current input value */
  input: string;
  /** Current output value */
  output: string;
  /** Current error message (null if no error) */
  error: string | null;
  /** Whether a transformation is in progress */
  isLoading: boolean;
  /** Current transform options */
  options: TOptions;
  /** Set the input value */
  setInput: (value: string) => void;
  /** Set transform options */
  setOptions: (options: Partial<TOptions>) => void;
  /** Manually trigger transformation */
  transform: () => Promise<void>;
  /** Clear both input and output */
  clear: () => void;
  /** Swap input and output values */
  swap: () => void;
  /** Copy output to clipboard */
  copyOutput: () => Promise<boolean>;
  /** Paste from clipboard to input */
  pasteInput: () => Promise<void>;
  /** Character count of input */
  inputLength: number;
  /** Character count of output */
  outputLength: number;
}

/**
 * Hook for managing transformation state
 */
export function useTransformState<TOptions = Record<string, unknown>>(
  config: UseTransformStateOptions<TOptions>
): TransformState<TOptions> {
  const {
    transformFn,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    realtime = false,
    initialInput = '',
    initialOptions = {} as TOptions,
    maxInputSize,
  } = config;

  const [input, setInputState] = useState(initialInput);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptionsState] = useState<TOptions>(initialOptions);

  // Ref to track the latest transform function (avoids stale closures)
  const transformFnRef = useRef(transformFn);
  transformFnRef.current = transformFn;

  // Ref to track debounce timeout
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Core transform logic
  const executeTransform = useCallback(async (inputValue: string, opts: TOptions) => {
    // Clear previous error
    setError(null);

    // Validate input size
    if (maxInputSize) {
      try {
        validateInputSize(inputValue, maxInputSize);
      } catch (e) {
        if (isTransformationError(e)) {
          setError(e.message);
          return;
        }
      }
    }

    // Skip empty input
    if (!inputValue.trim()) {
      setOutput('');
      return;
    }

    setIsLoading(true);

    try {
      const result = await Promise.resolve(transformFnRef.current(inputValue, opts));
      setOutput(result);
    } catch (e) {
      if (isTransformationError(e)) {
        setError(e.message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred');
      }
      setOutput('');
    } finally {
      setIsLoading(false);
    }
  }, [maxInputSize]);

  // Debounced transform for real-time mode
  const debouncedTransform = useCallback((inputValue: string, opts: TOptions) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      executeTransform(inputValue, opts);
    }, debounceMs);
  }, [debounceMs, executeTransform]);

  // Set input with optional real-time transform
  const setInput = useCallback((value: string) => {
    setInputState(value);

    if (realtime) {
      debouncedTransform(value, options);
    }
  }, [realtime, debouncedTransform, options]);

  // Set options with optional real-time transform
  const setOptions = useCallback((newOptions: Partial<TOptions>) => {
    setOptionsState(prev => {
      const updated = { ...prev, ...newOptions };

      if (realtime && input.trim()) {
        debouncedTransform(input, updated);
      }

      return updated;
    });
  }, [realtime, input, debouncedTransform]);

  // Manual transform trigger
  const transform = useCallback(async () => {
    await executeTransform(input, options);
  }, [input, options, executeTransform]);

  // Clear both input and output
  const clear = useCallback(() => {
    setInputState('');
    setOutput('');
    setError(null);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  // Swap input and output
  const swap = useCallback(() => {
    setInputState(output);
    setOutput(input);
    setError(null);
  }, [input, output]);

  // Copy output to clipboard
  const copyOutput = useCallback(async (): Promise<boolean> => {
    if (!output) return false;

    try {
      await navigator.clipboard.writeText(output);
      return true;
    } catch {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = output;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      } catch {
        return false;
      }
    }
  }, [output]);

  // Paste from clipboard to input
  const pasteInput = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard access denied or not available
      console.warn('Could not access clipboard');
    }
  }, [setInput]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    input,
    output,
    error,
    isLoading,
    options,
    setInput,
    setOptions,
    transform,
    clear,
    swap,
    copyOutput,
    pasteInput,
    inputLength: input.length,
    outputLength: output.length,
  };
}

/**
 * Simplified hook for basic transformations without options
 */
export function useSimpleTransform(
  transformFn: (input: string) => string | Promise<string>,
  config?: Omit<UseTransformStateOptions, 'transformFn'>
): TransformState {
  return useTransformState({
    transformFn,
    ...config,
  });
}
