'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { Toast, type ToastVariant } from '@/components/ui/Toast';

/**
 * Toast item in the queue
 */
export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

/**
 * Options for showing a toast
 */
export interface ToastOptions {
  /** Toast message */
  message: string;
  /** Color variant */
  variant?: ToastVariant;
  /** Duration in ms before auto-dismiss (default: 3000, 0 = no auto-dismiss) */
  duration?: number;
}

/**
 * Toast context value
 */
export interface ToastContextValue {
  /** Show a toast notification */
  toast: (options: ToastOptions) => string;
  /** Show a success toast */
  success: (message: string, duration?: number) => string;
  /** Show an error toast */
  error: (message: string, duration?: number) => string;
  /** Show an info toast */
  info: (message: string, duration?: number) => string;
  /** Show a warning toast */
  warning: (message: string, duration?: number) => string;
  /** Dismiss a specific toast by id */
  dismiss: (id: string) => void;
  /** Dismiss all toasts */
  dismissAll: () => void;
}

/**
 * Generate unique toast ID
 */
let toastCounter = 0;
function generateId(): string {
  return `toast-${++toastCounter}-${Date.now()}`;
}

/**
 * Toast context
 */
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Maximum number of toasts visible at once
 */
const MAX_TOASTS = 5;

/**
 * Default toast duration in ms
 */
const DEFAULT_DURATION = 3000;

/**
 * Toast provider props
 */
export interface ToastProviderProps {
  children: ReactNode;
  /** Position of toast container */
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

/**
 * Get position classes for toast container
 */
function getPositionClasses(position: ToastProviderProps['position']): string {
  const positions: Record<NonNullable<ToastProviderProps['position']>, string> = {
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  return positions[position || 'bottom-right'];
}

/**
 * Toast provider component
 */
export function ToastProvider({
  children,
  position = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Add a toast
  const addToast = useCallback((options: ToastOptions): string => {
    const id = generateId();
    const newToast: ToastItem = {
      id,
      message: options.message,
      variant: options.variant || 'info',
      duration: options.duration ?? DEFAULT_DURATION,
    };

    setToasts((prev) => {
      // Limit to MAX_TOASTS, removing oldest if needed
      const updated = [...prev, newToast];
      if (updated.length > MAX_TOASTS) {
        return updated.slice(-MAX_TOASTS);
      }
      return updated;
    });

    return id;
  }, []);

  // Remove a toast
  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Remove all toasts
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const toast = useCallback(
    (options: ToastOptions) => addToast(options),
    [addToast]
  );

  const success = useCallback(
    (message: string, duration?: number) =>
      addToast({ message, variant: 'success', duration }),
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      addToast({ message, variant: 'error', duration }),
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) =>
      addToast({ message, variant: 'info', duration }),
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) =>
      addToast({ message, variant: 'warning', duration }),
    [addToast]
  );

  const value: ToastContextValue = {
    toast,
    success,
    error,
    info,
    warning,
    dismiss,
    dismissAll,
  };

  const positionClasses = getPositionClasses(position);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div
        className={`fixed z-50 flex flex-col gap-2 pointer-events-none ${positionClasses}`}
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast
              id={t.id}
              message={t.message}
              variant={t.variant}
              duration={t.duration}
              onDismiss={dismiss}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast context
 * @throws Error if used outside ToastProvider
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export default ToastProvider;
