'use client';

/**
 * Skip Link Component
 * Allows keyboard users to skip directly to main content
 * Becomes visible only when focused
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;
