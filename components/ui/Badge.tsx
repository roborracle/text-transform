'use client';

import { forwardRef, type HTMLAttributes } from 'react';

/**
 * Badge variants
 */
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

/**
 * Badge sizes
 */
export type BadgeSize = 'sm' | 'md';

/**
 * Badge component props
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Optional icon to show before text */
  icon?: React.ReactNode;
}

/**
 * Get CSS classes for badge variant
 */
function getVariantClasses(variant: BadgeVariant): string {
  const variants: Record<BadgeVariant, string> = {
    default: [
      'bg-gray-100 text-gray-800',
      'dark:bg-gray-700 dark:text-gray-200',
    ].join(' '),
    primary: [
      'bg-blue-100 text-blue-800',
      'dark:bg-blue-900 dark:text-blue-200',
    ].join(' '),
    success: [
      'bg-green-100 text-green-800',
      'dark:bg-green-900 dark:text-green-200',
    ].join(' '),
    warning: [
      'bg-yellow-100 text-yellow-800',
      'dark:bg-yellow-900 dark:text-yellow-200',
    ].join(' '),
    error: [
      'bg-red-100 text-red-800',
      'dark:bg-red-900 dark:text-red-200',
    ].join(' '),
  };

  return variants[variant];
}

/**
 * Get CSS classes for badge size
 */
function getSizeClasses(size: BadgeSize): string {
  const sizes: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return sizes[size];
}

/**
 * Badge component for category labels and status indicators
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'sm',
      icon,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center gap-1',
      'font-medium rounded-full',
    ].join(' ');

    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);

    const combinedClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={combinedClasses} {...props}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
