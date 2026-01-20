/**
 * Analytics utility for tracking user events
 * Integrates with Google Analytics 4 when configured
 */

// GA4 Measurement ID - set via environment variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Check if analytics is enabled and user hasn't opted out
 */
function isAnalyticsEnabled(): boolean {
  // Check if GA ID is configured
  if (!GA_MEASUREMENT_ID) {
    return false;
  }

  // Respect Do Not Track
  if (typeof window !== 'undefined' && navigator.doNotTrack === '1') {
    return false;
  }

  return true;
}

/**
 * Track a page view
 */
export function trackPageView(url: string): void {
  if (!isAnalyticsEnabled()) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID!, { page_path: url });
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  if (!isAnalyticsEnabled()) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Track tool usage
 */
export function trackToolUsage(toolName: string, categoryName: string): void {
  trackEvent('tool_used', categoryName, toolName);
}

/**
 * Track copy to clipboard
 */
export function trackCopy(toolName: string): void {
  trackEvent('copy_output', 'engagement', toolName);
}

/**
 * Track search
 */
export function trackSearch(query: string, resultCount: number): void {
  trackEvent('search', 'navigation', query, resultCount);
}

/**
 * Track theme change
 */
export function trackThemeChange(theme: string): void {
  trackEvent('theme_changed', 'preferences', theme);
}

// Type definitions for gtag
type GtagCommand =
  | ['config', string, Record<string, unknown>?]
  | ['event', string, Record<string, unknown>?]
  | ['js', Date]
  | ['set', Record<string, unknown>];

interface GtagFunction {
  (...args: GtagCommand): void;
}

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}
