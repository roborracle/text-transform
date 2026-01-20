'use client';

import {
  forwardRef,
  type TextareaHTMLAttributes,
  useId,
  useMemo,
} from 'react';

/**
 * Textarea component props
 */
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text displayed above the textarea */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text displayed below the textarea */
  helperText?: string;
  /** Show character count */
  showCharCount?: boolean;
  /** Show line count */
  showLineCount?: boolean;
  /** Use monospace font */
  monospace?: boolean;
  /** Callback for value changes (convenience wrapper) */
  onValueChange?: (value: string) => void;
  /** Maximum character count (for display, doesn't enforce) */
  maxCharCount?: number;
}

/**
 * Count lines in a string
 */
function countLines(text: string): number {
  if (!text) return 0;
  return text.split('\n').length;
}

/**
 * Textarea component with label, character/line counts, and error states
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCharCount = false,
      showLineCount = false,
      monospace = false,
      onValueChange,
      maxCharCount,
      className = '',
      value,
      onChange,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    // Calculate counts
    const stringValue = String(value ?? '');
    const charCount = stringValue.length;
    const lineCount = countLines(stringValue);

    // Memoize character count display
    const charCountDisplay = useMemo(() => {
      if (maxCharCount) {
        return `${charCount.toLocaleString()} / ${maxCharCount.toLocaleString()}`;
      }
      return charCount.toLocaleString();
    }, [charCount, maxCharCount]);

    // Base classes
    const baseClasses = [
      'w-full px-3 py-2',
      'border rounded-lg',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:bg-gray-100 disabled:cursor-not-allowed',
      'dark:bg-gray-900 dark:disabled:bg-gray-800',
      'resize-y min-h-[120px]',
    ].join(' ');

    // Error state classes
    const stateClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600';

    // Font classes
    const fontClasses = monospace
      ? 'font-mono text-sm'
      : 'font-sans';

    const combinedClasses = [
      baseClasses,
      stateClasses,
      fontClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Handle change with onValueChange callback
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={handleChange}
          className={combinedClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            [error && errorId, helperText && helperId].filter(Boolean).join(' ') ||
            undefined
          }
          {...props}
        />

        {/* Footer: counts and helper/error text */}
        <div className="mt-1 flex justify-between items-start gap-4">
          {/* Left side: error or helper text */}
          <div className="flex-1 min-w-0">
            {error && (
              <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {!error && helperText && (
              <p
                id={helperId}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                {helperText}
              </p>
            )}
          </div>

          {/* Right side: counts */}
          {(showCharCount || showLineCount) && (
            <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              {showLineCount && (
                <span>
                  {lineCount.toLocaleString()} {lineCount === 1 ? 'line' : 'lines'}
                </span>
              )}
              {showCharCount && (
                <span
                  className={
                    maxCharCount && charCount > maxCharCount
                      ? 'text-red-500'
                      : ''
                  }
                >
                  {charCountDisplay} chars
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
