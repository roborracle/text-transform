/**
 * SSR-safe utilities for handling browser-only APIs
 * Prevents hydration mismatches in Next.js
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Check if code is running in browser environment
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if code is running in server environment
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Hook that returns a value only on the client side
 * Prevents hydration mismatches for browser-only values
 */
export function useClientOnly<T>(fn: () => T, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(fn());
  }, [fn]);

  return value;
}

/**
 * Hook for safely accessing localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize from localStorage after mount
  useEffect(() => {
    if (isServer()) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function for same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (isClient()) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook that only runs effect on client side
 * Useful for browser-only side effects
 */
export function useClientEffect(
  effect: () => void | (() => void),
  deps?: React.DependencyList
): void {
  useEffect(() => {
    if (isClient()) {
      return effect();
    }
  }, deps);
}

/**
 * Safe wrapper for clipboard API
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (isServer()) return false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Safe wrapper for reading from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  if (isServer()) return null;

  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText();
    }
    return null;
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return null;
  }
}

/**
 * Get the preferred color scheme from system settings
 */
export function getSystemColorScheme(): 'light' | 'dark' {
  if (isServer()) return 'light';

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Hook for detecting system color scheme changes
 */
export function useSystemColorScheme(): 'light' | 'dark' {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (isServer()) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial value
    setScheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setScheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return scheme;
}

/**
 * List of transformation functions that are SSR-safe (work on server)
 * Most pure transformations work in both environments
 */
export const SSR_SAFE_TRANSFORMS = [
  // All naming conventions
  'toCamelCase', 'toPascalCase', 'toSnakeCase', 'toKebabCase',
  // Most encoding (except base64 which uses Buffer/btoa)
  'urlEncode', 'urlDecode', 'htmlEncode', 'htmlDecode',
  // Text manipulations
  'textToHex', 'hexToText', 'textToBinary', 'binaryToText',
  // Ciphers (all pure JS)
  'caesarEncode', 'caesarDecode', 'rot13', 'atbash',
  // Color conversions
  'hexToRgb', 'rgbToHex', 'hexToHsl',
  // Formatters
  'formatJSON', 'minifyJSON', 'formatSQL',
] as const;

/**
 * List of transformation functions that require client-side execution
 * These use browser APIs or crypto that may not work in SSR
 */
export const CLIENT_ONLY_TRANSFORMS = [
  // Hash functions (use Web Crypto)
  'sha1Hash', 'sha256Hash', 'sha512Hash', 'generateHMACSHA256',
  // Random generators (use crypto.getRandomValues)
  'generatePassword', 'generateUUIDv4', 'generateNanoID',
  // Clipboard operations
  'copyToClipboard', 'readFromClipboard',
] as const;
