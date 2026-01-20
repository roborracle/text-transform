/**
 * Utility for conditionally joining class names
 * A lightweight alternative to clsx/classnames
 */
export function cn(
  ...classes: (string | undefined | null | false | 0)[]
): string {
  return classes.filter(Boolean).join(' ');
}

export default cn;
