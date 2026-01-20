'use client';

import { useState, useCallback } from 'react';
import { Button, Textarea, Card } from '@/components/ui';
import { useTransformState, type TransformFn } from '@/lib/hooks/useTransformState';

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
    inputLength,
    outputLength,
  } = useTransformState({
    transformFn,
    realtime,
    initialOptions,
    maxInputSize,
  });

  // Copy feedback state
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Handle copy with feedback
  const handleCopy = useCallback(async () => {
    const success = await copyOutput();
    if (success) {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  }, [copyOutput]);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Input
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              leftIcon={<ClearIcon />}
              disabled={!input}
            >
              Clear
            </Button>
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
                  title="Swap input and output"
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
              >
                {copyFeedback ? 'Copied!' : 'Copy'}
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

      {/* Error display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Transform button (for non-realtime mode) */}
      {!realtime && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={transform}
            isLoading={isLoading}
            disabled={!input.trim()}
          >
            Transform
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Input: {inputLength.toLocaleString()} characters</span>
        <span>Output: {outputLength.toLocaleString()} characters</span>
      </div>
    </Card>
  );
}

export default TransformPanel;
