'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Button, Textarea, Card } from '@/components/ui';
import { useTransformState, type TransformFn } from '@/lib/hooks/useTransformState';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { useToast } from '@/contexts';

/**
 * Transform option configuration
 */
export interface TransformOption {
  /** Unique key for the option */
  key: string;
  /** Display label */
  label: string;
  /** Input type */
  type: 'text' | 'number' | 'select' | 'checkbox';
  /** Default value */
  defaultValue?: unknown;
  /** Options for select type */
  options?: { label: string; value: string }[];
  /** Placeholder for text/number inputs */
  placeholder?: string;
  /** Min value for number inputs */
  min?: number;
  /** Max value for number inputs */
  max?: number;
}

/**
 * TransformPanel component props
 */
export interface TransformPanelProps {
  /** Title displayed at the top */
  title: string;
  /** Description text */
  description?: string;
  /** The transformation function */
  transformFn: TransformFn<Record<string, unknown>>;
  /** Placeholder for input textarea */
  inputPlaceholder?: string;
  /** Placeholder for output textarea */
  outputPlaceholder?: string;
  /** Configurable options for the transform */
  options?: TransformOption[];
  /** Show swap button to exchange input/output */
  showSwapButton?: boolean;
  /** Enable real-time transformation */
  realtime?: boolean;
  /** Maximum input size */
  maxInputSize?: number;
  /** Generator mode - no input required, auto-generates on mount */
  isGenerator?: boolean;
}

/**
 * Copy icon SVG
 */
function CopyIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

/**
 * Swap icon SVG
 */
function SwapIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
      />
    </svg>
  );
}

/**
 * Clear icon SVG
 */
function ClearIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

/**
 * Refresh/Regenerate icon SVG
 */
function RefreshIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

/**
 * Download icon SVG
 */
function DownloadIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}

/**
 * Paste/Clipboard icon SVG
 */
function PasteIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}

/**
 * Download text content as a file
 */
function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a filename from the tool title
 */
function generateFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const timestamp = new Date().toISOString().slice(0, 10);
  return `${slug}-output-${timestamp}.txt`;
}

/**
 * Main transformation interface component
 */
export function TransformPanel({
  title,
  description,
  transformFn,
  inputPlaceholder = 'Enter text to transform...',
  outputPlaceholder = 'Transformed output will appear here...',
  options = [],
  showSwapButton = true,
  realtime = false,
  maxInputSize,
  isGenerator = false,
}: TransformPanelProps) {
  // Build initial options from config
  const initialOptions: Record<string, unknown> = {};
  options.forEach((opt) => {
    initialOptions[opt.key] = opt.defaultValue;
  });

  // Use the transform state hook
  const {
    input,
    output,
    error,
    isLoading,
    options: transformOptions,
    setInput,
    setOptions,
    transform,
    clear,
    swap,
    copyOutput,
    pasteInput,
    inputLength,
    outputLength,
  } = useTransformState({
    transformFn,
    realtime,
    initialOptions,
    maxInputSize,
    isGenerator,
  });

  // Toast notifications
  const toast = useToast();

  // Detect if user is on Mac for shortcut display
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  // Auto-generate on mount for generator tools
  const [hasAutoGenerated, setHasAutoGenerated] = useState(false);
  useEffect(() => {
    if (isGenerator && !hasAutoGenerated) {
      setHasAutoGenerated(true);
      transform();
    }
  }, [isGenerator, hasAutoGenerated, transform]);

  // Shortcut modifier symbol
  const modKey = isMac ? '⌘' : 'Ctrl';

  // Handle copy with toast feedback
  const handleCopy = useCallback(async () => {
    const success = await copyOutput();
    if (success) {
      toast.success('Copied to clipboard');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  }, [copyOutput, toast]);

  // Handle download output as file
  const handleDownload = useCallback(() => {
    if (!output) return;
    const filename = generateFilename(title);
    downloadAsFile(output, filename);
    toast.success(`Downloaded as ${filename}`);
  }, [output, title, toast]);

  // Handle paste from clipboard
  const handlePaste = useCallback(async () => {
    try {
      await pasteInput();
      toast.success('Pasted from clipboard');
    } catch {
      toast.error('Failed to paste from clipboard');
    }
  }, [pasteInput, toast]);

  // Keyboard shortcuts
  const shortcuts = useMemo(
    () => [
      // Cmd/Ctrl + Enter: Transform/Generate (only for non-realtime mode)
      ...(!realtime
        ? [
            {
              key: 'Enter',
              modifiers: ['meta' as const],
              callback: () => {
                if (isGenerator) {
                  transform();
                } else if (input.trim()) {
                  transform();
                }
              },
              allowInInputs: true,
            },
          ]
        : []),
      // Cmd/Ctrl + Shift + C: Copy output
      {
        key: 'c',
        modifiers: ['meta' as const, 'shift' as const],
        callback: handleCopy,
        allowInInputs: true,
      },
      // Cmd/Ctrl + Shift + X: Clear all (not for generators)
      ...(!isGenerator
        ? [
            {
              key: 'x',
              modifiers: ['meta' as const, 'shift' as const],
              callback: clear,
              allowInInputs: true,
            },
          ]
        : []),
      // Cmd/Ctrl + Shift + S: Swap (if enabled)
      ...(showSwapButton
        ? [
            {
              key: 's',
              modifiers: ['meta' as const, 'shift' as const],
              callback: () => {
                if (output) swap();
              },
              allowInInputs: true,
            },
          ]
        : []),
      // Cmd/Ctrl + Shift + D: Download output
      {
        key: 'd',
        modifiers: ['meta' as const, 'shift' as const],
        callback: () => {
          if (output) handleDownload();
        },
        allowInInputs: true,
      },
      // Cmd/Ctrl + Shift + V: Paste to input (not for generators)
      ...(!isGenerator
        ? [
            {
              key: 'v',
              modifiers: ['meta' as const, 'shift' as const],
              callback: handlePaste,
              allowInInputs: true,
            },
          ]
        : []),
    ],
    [realtime, input, transform, handleCopy, clear, showSwapButton, output, swap, isGenerator, handleDownload, handlePaste]
  );

  useKeyboardShortcuts(shortcuts);

  // Handle option change
  const handleOptionChange = useCallback(
    (key: string, value: unknown) => {
      setOptions({ [key]: value });
    },
    [setOptions]
  );

  // Render option input based on type
  const renderOptionInput = (option: TransformOption) => {
    const value = transformOptions[option.key];

    switch (option.type) {
      case 'checkbox':
        return (
          <label key={option.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleOptionChange(option.key, e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {option.label}
            </span>
          </label>
        );

      case 'select':
        return (
          <label key={option.key} className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {option.label}
            </span>
            <select
              value={String(value ?? '')}
              onChange={(e) => handleOptionChange(option.key, e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            >
              {option.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        );

      case 'number':
        return (
          <label key={option.key} className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {option.label}
            </span>
            <input
              type="number"
              value={Number(value ?? 0)}
              min={option.min}
              max={option.max}
              onChange={(e) => handleOptionChange(option.key, Number(e.target.value))}
              placeholder={option.placeholder}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 w-24"
            />
          </label>
        );

      case 'text':
      default:
        return (
          <label key={option.key} className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {option.label}
            </span>
            <input
              type="text"
              value={String(value ?? '')}
              onChange={(e) => handleOptionChange(option.key, e.target.value)}
              placeholder={option.placeholder}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        );
    }
  };

  return (
    <Card variant="bordered" padding="lg" className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {/* Options bar */}
      {options.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {options.map(renderOptionInput)}
        </div>
      )}

      {/* Main content: Input and Output panels */}
      {isGenerator ? (
        /* Generator mode: Single output panel with generate button */
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Output
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={transform}
                leftIcon={<RefreshIcon />}
                disabled={isLoading}
                title={`Regenerate (${modKey}+Enter)`}
              >
                Regenerate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                leftIcon={<CopyIcon />}
                disabled={!output}
                title={`Copy to clipboard (${modKey}+Shift+C)`}
              >
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                leftIcon={<DownloadIcon />}
                disabled={!output}
                title={`Download as file (${modKey}+Shift+D)`}
              >
                Download
              </Button>
            </div>
          </div>
          <Textarea
            value={output}
            placeholder={outputPlaceholder}
            monospace
            showCharCount
            showLineCount
            readOnly
            className="flex-1"
            rows={10}
          />
        </div>
      ) : (
        /* Transform mode: Input and Output panels side by side */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Input
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePaste}
                  leftIcon={<PasteIcon />}
                  title={`Paste from clipboard (${modKey}+Shift+V)`}
                >
                  Paste
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  leftIcon={<ClearIcon />}
                  disabled={!input}
                  title={`Clear input (${modKey}+Shift+X)`}
                >
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              value={input}
              onValueChange={setInput}
              placeholder={inputPlaceholder}
              monospace
              showCharCount
              showLineCount
              className="flex-1"
              rows={10}
            />
          </div>

          {/* Output Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </span>
              <div className="flex gap-2">
                {showSwapButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={swap}
                    leftIcon={<SwapIcon />}
                    disabled={!output}
                    title={`Swap input and output (${modKey}+Shift+S)`}
                  >
                    Swap
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  leftIcon={<CopyIcon />}
                  disabled={!output}
                  title={`Copy to clipboard (${modKey}+Shift+C)`}
                >
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  leftIcon={<DownloadIcon />}
                  disabled={!output}
                  title={`Download as file (${modKey}+Shift+D)`}
                >
                  Download
                </Button>
              </div>
            </div>
            <Textarea
              value={output}
              placeholder={outputPlaceholder}
              monospace
              showCharCount
              showLineCount
              readOnly
              className="flex-1"
              rows={10}
            />
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Transform button (for non-realtime, non-generator mode) */}
      {!realtime && !isGenerator && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={transform}
            isLoading={isLoading}
            disabled={!input.trim()}
            title={`Transform (${modKey}+Enter)`}
          >
            Transform
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {isGenerator ? (
          <span>Output: {outputLength.toLocaleString()} characters</span>
        ) : (
          <>
            <span>Input: {inputLength.toLocaleString()} characters</span>
            <span>Output: {outputLength.toLocaleString()} characters</span>
          </>
        )}
      </div>
    </Card>
  );
}

export default TransformPanel;
