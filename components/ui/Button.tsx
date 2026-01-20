'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Show loading spinner and disable button */
  isLoading?: boolean;
  /** Icon to show on the left side */
  leftIcon?: ReactNode;
  /** Icon to show on the right side */
  rightIcon?: ReactNode;
  /** Make button full width */
  fullWidth?: boolean;
}

/**
 * Loading spinner component
 */
function LoadingSpinner({ size }: { size: ButtonSize }) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Get CSS classes for button variant
 */
function getVariantClasses(variant: ButtonVariant): string {
  const variants: Record<ButtonVariant, string> = {
    primary: [
      'bg-blue-600 text-white',
      'hover:bg-blue-700',
      'focus:ring-blue-500',
      'dark:bg-blue-500 dark:hover:bg-blue-600',
      'disabled:bg-blue-400 disabled:dark:bg-blue-800',
    ].join(' '),
    secondary: [
      'bg-gray-200 text-gray-900',
      'hover:bg-gray-300',
      'focus:ring-gray-500',
      'dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
      'disabled:bg-gray-100 disabled:dark:bg-gray-800',
    ].join(' '),
    outline: [
      'bg-transparent border-2 border-gray-300 text-gray-700',
      'hover:bg-gray-100',
      'focus:ring-gray-500',
      'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
      'disabled:border-gray-200 disabled:text-gray-400',
    ].join(' '),
    ghost: [
      'bg-transparent text-gray-700',
      'hover:bg-gray-100',
      'focus:ring-gray-500',
      'dark:text-gray-300 dark:hover:bg-gray-800',
      'disabled:text-gray-400',
    ].join(' '),
  };

  return variants[variant];
}

/**
 * Get CSS classes for button size
 */
function getSizeClasses(size: ButtonSize): string {
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  return sizes[size];
}

/**
 * Reusable Button component with variants, sizes, and loading state
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-60',
    ].join(' ');

    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    const widthClasses = fullWidth ? 'w-full' : '';

    const combinedClasses = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size={size} />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
