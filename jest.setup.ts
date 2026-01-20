/**
 * Jest setup file
 * This file runs before each test file
 */

// Extend Jest matchers (if using @testing-library/jest-dom for component tests)
// import '@testing-library/jest-dom';

// Mock browser APIs that might not be available in Node.js test environment
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock crypto.subtle for hash functions in Node environment
if (typeof crypto === 'undefined' || !crypto.subtle) {
  const { webcrypto } = require('crypto');
  global.crypto = webcrypto as Crypto;
}

// Mock crypto.randomUUID if not available
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
  Object.defineProperty(crypto, 'randomUUID', {
    value: (): `${string}-${string}-${string}-${string}-${string}` => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }) as `${string}-${string}-${string}-${string}-${string}`;
    },
    writable: true,
    configurable: true,
  });
}

// Set test timeout
jest.setTimeout(10000);

// Console output configuration for tests
// Suppress console.log in tests unless explicitly needed
// const originalConsoleLog = console.log;
// console.log = jest.fn();

export {};
