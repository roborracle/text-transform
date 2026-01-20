'use client';

import { forwardRef, type HTMLAttributes, type ElementType } from 'react';

/**
 * Card variants
 */
export type CardVariant = 'default' | 'elevated' | 'bordered';

/**
 * Card padding options
 */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Card component props
 */
export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Visual variant */
  variant?: CardVariant;
  /** Padding size */
  padding?: CardPadding;
  /** Render as different HTML element */
  as?: 'div' | 'article' | 'section';
  /** Enable hover effects for interactive cards */
  interactive?: boolean;
}

/**
 * Get CSS classes for card variant
 */
function getVariantClasses(variant: CardVariant): string {
  const variants: Record<CardVariant, string> = {
    default: 'bg-white dark:bg-gray-800',
    elevated: [
      'bg-white dark:bg-gray-800',
      'shadow-lg',
      'dark:shadow-gray-900/50',
    ].join(' '),
    bordered: [
      'bg-white dark:bg-gray-800',
      'border border-gray-200 dark:border-gray-700',
    ].join(' '),
  };

  return variants[variant];
}

/**
 * Get CSS classes for card padding
 */
function getPaddingClasses(padding: CardPadding): string {
  const paddings: Record<CardPadding, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return paddings[padding];
}

/**
 * Card container component for tool cards and panels
 */
export const Card = forwardRef<HTMLElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      as: Component = 'div',
      interactive = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'rounded-lg';

    const variantClasses = getVariantClasses(variant);
    const paddingClasses = getPaddingClasses(padding);

    const interactiveClasses = interactive
      ? [
          'cursor-pointer',
          'transition-all duration-200 ease-out',
          'hover:shadow-lg hover:-translate-y-1',
          'active:scale-[0.98] active:shadow-md',
        ].join(' ')
      : '';

    const combinedClasses = [
      baseClasses,
      variantClasses,
      paddingClasses,
      interactiveClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // TypeScript workaround for dynamic element type
    const Element = Component as ElementType;

    return (
      <Element ref={ref} className={combinedClasses} {...props}>
        {children}
      </Element>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header component
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`mb-4 ${className}`} {...props}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Content component
 */
export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

/**
 * Card Footer component
 */
export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export default Card;
