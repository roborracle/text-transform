/**
 * Input validation utilities for security and performance
 * Prevents XSS, injection attacks, and DoS via large inputs
 */

import { TransformationError, ErrorCodes } from '@/lib/errors';

/**
 * Maximum input size in characters (1MB of text)
 */
export const MAX_INPUT_SIZE = 1_000_000;

/**
 * Maximum input size for display purposes
 */
export const MAX_INPUT_SIZE_DISPLAY = '1MB';

/**
 * Default debounce delay for real-time transforms (ms)
 */
export const DEFAULT_DEBOUNCE_MS = 150;

/**
 * Rate limit for generators (calls per minute)
 */
export const GENERATOR_RATE_LIMIT = 100;

/**
 * Validate that input doesn't exceed maximum size
 * @throws TransformationError if input is too large
 */
export function validateInputSize(input: string, maxSize: number = MAX_INPUT_SIZE): void {
  if (input.length > maxSize) {
    throw new TransformationError(
      `Input exceeds maximum size of ${maxSize.toLocaleString()} characters`,
      ErrorCodes.INPUT_TOO_LARGE,
      `[${input.length.toLocaleString()} characters]`
    );
  }
}

/**
 * Check if input size is valid without throwing
 */
export function isInputSizeValid(input: string, maxSize: number = MAX_INPUT_SIZE): boolean {
  return input.length <= maxSize;
}

/**
 * Get human-readable size of input
 */
export function getInputSizeDisplay(input: string): string {
  const bytes = new Blob([input]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Sanitize HTML input to prevent XSS attacks
 * Removes script tags, event handlers, and dangerous attributes
 */
export function sanitizeHtmlInput(input: string): string {
  return input
    // Remove script tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove style tags (can contain JS expressions in some contexts)
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove event handlers (onclick, onerror, etc.)
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: URLs
    .replace(/javascript\s*:/gi, '')
    // Remove data: URLs (can contain scripts)
    .replace(/data\s*:\s*text\/html/gi, '')
    // Remove vbscript: URLs
    .replace(/vbscript\s*:/gi, '');
}

/**
 * Sanitize URL to prevent javascript: and data: attacks
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('data:text/html')
  ) {
    return '';
  }
  return url;
}

/**
 * Validate that a string contains only printable ASCII characters
 */
export function isValidAscii(input: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /^[\x20-\x7E\t\n\r]*$/.test(input);
}

/**
 * Validate that a string is valid UTF-8
 */
export function isValidUtf8(input: string): boolean {
  try {
    // Try encoding and decoding
    const encoded = new TextEncoder().encode(input);
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
    return decoded === input;
  } catch {
    return false;
  }
}

/**
 * Validate hex string format
 */
export function isValidHex(input: string): boolean {
  return /^[0-9a-fA-F]*$/.test(input.replace(/\s/g, ''));
}

/**
 * Validate binary string format (0s and 1s with optional spaces)
 */
export function isValidBinary(input: string): boolean {
  return /^[01\s]*$/.test(input);
}

/**
 * Validate Base64 string format
 */
export function isValidBase64(input: string): boolean {
  if (input === '') return true;
  return /^[A-Za-z0-9+/]*={0,2}$/.test(input);
}

/**
 * Validate JSON string
 */
export function isValidJson(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate CSS color hex code
 */
export function isValidHexColor(input: string): boolean {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(input);
}

/**
 * Validate RGB color string
 */
export function isValidRgb(input: string): boolean {
  const match = input.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return false;
  const [, r, g, b] = match.map(Number);
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
}

/**
 * Rate limiter for generator functions
 */
export class RateLimiter {
  private calls: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = GENERATOR_RATE_LIMIT, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Check if a call is allowed
   * @returns true if allowed, false if rate limited
   */
  canCall(): boolean {
    const now = Date.now();
    // Remove old calls outside the window
    this.calls = this.calls.filter(time => now - time < this.windowMs);
    return this.calls.length < this.limit;
  }

  /**
   * Record a call
   */
  recordCall(): void {
    this.calls.push(Date.now());
  }

  /**
   * Check and record a call
   * @throws TransformationError if rate limited
   */
  checkAndRecord(): void {
    if (!this.canCall()) {
      throw new TransformationError(
        `Rate limit exceeded. Maximum ${this.limit} calls per minute.`,
        ErrorCodes.RATE_LIMITED
      );
    }
    this.recordCall();
  }

  /**
   * Get remaining calls in current window
   */
  getRemainingCalls(): number {
    const now = Date.now();
    this.calls = this.calls.filter(time => now - time < this.windowMs);
    return Math.max(0, this.limit - this.calls.length);
  }
}

/**
 * Truncate string if too long, adding ellipsis
 */
export function truncateString(input: string, maxLength: number = 100): string {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - 3) + '...';
}

/**
 * Count lines in a string
 */
export function countLines(input: string): number {
  if (input === '') return 0;
  return input.split('\n').length;
}

/**
 * Count words in a string
 */
export function countWords(input: string): number {
  const trimmed = input.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).length;
}
