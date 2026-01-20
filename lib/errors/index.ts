/**
 * Custom error types for transformation functions
 *
 * Error Handling Strategy:
 * - Transformation functions can either throw TransformationError or return error strings
 * - For user-facing errors (invalid input), return error strings for graceful UI handling
 * - For programmer errors (invalid options), throw TransformationError
 * - All errors should use defined error codes for consistency
 */

/**
 * Error codes for transformation operations
 */
export const ErrorCodes = {
  // Input validation errors
  INVALID_INPUT: 'INVALID_INPUT',
  INPUT_TOO_LARGE: 'INPUT_TOO_LARGE',
  INPUT_EMPTY: 'INPUT_EMPTY',

  // Encoding/Decoding errors
  ENCODING_FAILED: 'ENCODING_FAILED',
  DECODING_FAILED: 'DECODING_FAILED',
  INVALID_BASE64: 'INVALID_BASE64',
  INVALID_HEX: 'INVALID_HEX',
  INVALID_BINARY: 'INVALID_BINARY',

  // Format errors
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_JSON: 'INVALID_JSON',
  INVALID_XML: 'INVALID_XML',
  INVALID_CSV: 'INVALID_CSV',
  INVALID_YAML: 'INVALID_YAML',

  // Crypto errors
  HASH_FAILED: 'HASH_FAILED',
  INVALID_JWT: 'INVALID_JWT',
  INVALID_TIMESTAMP: 'INVALID_TIMESTAMP',

  // Color errors
  INVALID_COLOR: 'INVALID_COLOR',
  INVALID_HEX_COLOR: 'INVALID_HEX_COLOR',
  INVALID_RGB: 'INVALID_RGB',
  INVALID_HSL: 'INVALID_HSL',

  // Generator errors
  INVALID_OPTIONS: 'INVALID_OPTIONS',
  GENERATION_FAILED: 'GENERATION_FAILED',

  // Cipher errors
  INVALID_KEY: 'INVALID_KEY',
  INVALID_SHIFT: 'INVALID_SHIFT',
  CIPHER_FAILED: 'CIPHER_FAILED',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Custom error class for transformation operations
 */
export class TransformationError extends Error {
  public readonly code: ErrorCode;
  public readonly input?: string;

  constructor(message: string, code: ErrorCode, input?: string) {
    super(message);
    this.name = 'TransformationError';
    this.code = code;
    this.input = input;

    // Maintains proper stack trace for where error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TransformationError);
    }
  }

  /**
   * Create a user-friendly error message string
   */
  toUserMessage(): string {
    return this.message;
  }

  /**
   * Create a detailed error object for logging/debugging
   */
  toDetailedObject(): {
    name: string;
    message: string;
    code: ErrorCode;
    input?: string;
  } {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      input: this.input,
    };
  }
}

/**
 * Type guard to check if an error is a TransformationError
 */
export function isTransformationError(
  error: unknown
): error is TransformationError {
  return error instanceof TransformationError;
}

/**
 * Helper to create common error messages
 */
export const ErrorMessages = {
  invalidInput: (details?: string) =>
    details ? `Invalid input: ${details}` : 'Invalid input',

  inputTooLarge: (maxSize: number) =>
    `Input exceeds maximum size of ${maxSize.toLocaleString()} characters`,

  invalidBase64: () => 'Invalid Base64 input',

  invalidHex: () => 'Invalid hexadecimal input',

  invalidBinary: () => 'Invalid binary input - must contain only 0s and 1s',

  invalidJson: (details?: string) =>
    details ? `Invalid JSON: ${details}` : 'Invalid JSON',

  invalidTimestamp: () => 'Invalid timestamp',

  invalidJwt: (details?: string) =>
    details ? `Invalid JWT: ${details}` : 'Invalid JWT format',

  invalidColor: (format: string) => `Invalid ${format} color format`,

  invalidKey: () => 'Invalid or missing key',

  encodingFailed: (encoding: string, details?: string) =>
    details
      ? `${encoding} encoding failed: ${details}`
      : `${encoding} encoding failed`,

  decodingFailed: (encoding: string, details?: string) =>
    details
      ? `${encoding} decoding failed: ${details}`
      : `${encoding} decoding failed`,
} as const;

/**
 * Result type for operations that can fail
 * Use this for functions where you want explicit error handling
 */
export type TransformResult<T> =
  | { success: true; value: T }
  | { success: false; error: TransformationError };

/**
 * Helper to create success result
 */
export function success<T>(value: T): TransformResult<T> {
  return { success: true, value };
}

/**
 * Helper to create failure result
 */
export function failure<T>(
  message: string,
  code: ErrorCode,
  input?: string
): TransformResult<T> {
  return {
    success: false,
    error: new TransformationError(message, code, input),
  };
}
