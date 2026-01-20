'use client';

import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react';

/**
 * Toast variants
 */
export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast component props
 */
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  /** Unique identifier for the toast */
  id: string;
  /** Toast message */
  message: string;
  /** Color variant */
  variant?: ToastVariant;
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss?: (id: string) => void;
}

/**
 * Icon components for each variant
 */
function SuccessIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
 * Get icon for variant
 */
function getVariantIcon(variant: ToastVariant) {
  const icons: Record<ToastVariant, React.ReactNode> = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    info: <InfoIcon />,
    warning: <WarningIcon />,
  };
  return icons[variant];
}

/**
 * Get CSS classes for toast variant
 */
function getVariantClasses(variant: ToastVariant): string {
  const variants: Record<ToastVariant, string> = {
    success: [
      'bg-green-50 text-green-800 border-green-200',
      'dark:bg-green-900/90 dark:text-green-100 dark:border-green-800',
    ].join(' '),
    error: [
      'bg-red-50 text-red-800 border-red-200',
      'dark:bg-red-900/90 dark:text-red-100 dark:border-red-800',
    ].join(' '),
    info: [
      'bg-blue-50 text-blue-800 border-blue-200',
      'dark:bg-blue-900/90 dark:text-blue-100 dark:border-blue-800',
    ].join(' '),
    warning: [
      'bg-yellow-50 text-yellow-800 border-yellow-200',
      'dark:bg-yellow-900/90 dark:text-yellow-100 dark:border-yellow-800',
    ].join(' '),
  };
  return variants[variant];
}

/**
 * Get icon color classes for variant
 */
function getIconClasses(variant: ToastVariant): string {
  const classes: Record<ToastVariant, string> = {
    success: 'text-green-500 dark:text-green-400',
    error: 'text-red-500 dark:text-red-400',
    info: 'text-blue-500 dark:text-blue-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
  };
  return classes[variant];
}

/**
 * Individual toast notification component
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      message,
      variant = 'info',
      duration = 3000,
      onDismiss,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    // Animate in on mount
    useEffect(() => {
      // Small delay to trigger enter animation
      const showTimer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(showTimer);
    }, []);

    const handleDismiss = () => {
      setIsLeaving(true);
      // Wait for exit animation before calling onDismiss
      setTimeout(() => {
        onDismiss?.(id);
      }, 200);
    };

    // Auto-dismiss after duration
    useEffect(() => {
      if (duration <= 0) return;

      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          onDismiss?.(id);
        }, 200);
      }, duration);

      return () => clearTimeout(timer);
    }, [duration, id, onDismiss]);

    const baseClasses = [
      'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg',
      'transform transition-all duration-200 ease-out',
      'max-w-sm w-full',
    ].join(' ');

    const animationClasses = isLeaving
      ? 'opacity-0 translate-y-2'
      : isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-2';

    const variantClasses = getVariantClasses(variant);
    const iconClasses = getIconClasses(variant);

    const combinedClasses = [
      baseClasses,
      animationClasses,
      variantClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={combinedClasses}
        {...props}
      >
        <span className={`flex-shrink-0 ${iconClasses}`}>
          {getVariantIcon(variant)}
        </span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Dismiss notification"
        >
          <CloseIcon />
        </button>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export default Toast;
