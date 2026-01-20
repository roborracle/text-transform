'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Make it circular */
  circle?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Number of lines to render */
  lines?: number;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

/**
 * Skeleton loading component
 * Used as a placeholder while content is loading
 */
export function Skeleton({
  width,
  height,
  circle = false,
  className,
  lines = 1,
  'aria-label': ariaLabel = 'Loading...',
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (lines > 1) {
    return (
      <div
        className="space-y-2"
        role="status"
        aria-label={ariaLabel}
        aria-busy="true"
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4 rounded',
              i === lines - 1 && 'w-3/4', // Last line is shorter
              className
            )}
            style={i === lines - 1 ? undefined : style}
          />
        ))}
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        circle ? 'rounded-full' : 'rounded',
        className
      )}
      style={style}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

/**
 * Skeleton for a tool card
 */
export function ToolCardSkeleton() {
  return (
    <div
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      role="status"
      aria-label="Loading tool card..."
      aria-busy="true"
    >
      <div className="flex items-start gap-3">
        <Skeleton width={40} height={40} circle className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton width="60%" height={20} className="mb-2" />
          <Skeleton lines={2} />
        </div>
      </div>
      <span className="sr-only">Loading tool card...</span>
    </div>
  );
}

/**
 * Skeleton for a category card
 */
export function CategoryCardSkeleton() {
  return (
    <div
      className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      role="status"
      aria-label="Loading category card..."
      aria-busy="true"
    >
      <div className="flex items-center gap-4 mb-4">
        <Skeleton width={48} height={48} className="rounded-lg" />
        <div className="flex-1">
          <Skeleton width="50%" height={24} className="mb-2" />
          <Skeleton width="30%" height={16} />
        </div>
      </div>
      <Skeleton lines={2} />
      <span className="sr-only">Loading category card...</span>
    </div>
  );
}

/**
 * Skeleton for the transform panel
 */
export function TransformPanelSkeleton() {
  return (
    <div
      className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      role="status"
      aria-label="Loading transformation tool..."
      aria-busy="true"
    >
      <div className="mb-6">
        <Skeleton width="40%" height={28} className="mb-2" />
        <Skeleton width="60%" height={16} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton height={200} className="rounded-lg" />
        <Skeleton height={200} className="rounded-lg" />
      </div>
      <div className="mt-4 flex justify-center">
        <Skeleton width={120} height={44} className="rounded-lg" />
      </div>
      <span className="sr-only">Loading transformation tool...</span>
    </div>
  );
}

export default Skeleton;
