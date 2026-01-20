/**
 * API response utilities
 * Consistent response format for all API endpoints
 */

import { NextResponse } from 'next/server';

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  timestamp: string;
  version: string;
  rateLimit?: {
    remaining: number;
    reset: number;
  };
}

const API_VERSION = '1.0.0';

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  meta?: Partial<ApiMeta>,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        version: API_VERSION,
        ...meta,
      },
    },
    { status }
  );
}

/**
 * Create an error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: Record<string, unknown>
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: API_VERSION,
      },
    },
    { status }
  );
}

/**
 * Common error responses
 */
export const ApiErrors = {
  badRequest: (message: string, details?: Record<string, unknown>) =>
    errorResponse('BAD_REQUEST', message, 400, details),

  notFound: (resource: string) =>
    errorResponse('NOT_FOUND', `${resource} not found`, 404),

  methodNotAllowed: (allowed: string[]) =>
    errorResponse('METHOD_NOT_ALLOWED', `Method not allowed. Use: ${allowed.join(', ')}`, 405),

  tooManyRequests: (retryAfter: number) =>
    errorResponse('RATE_LIMIT_EXCEEDED', `Too many requests. Retry after ${retryAfter} seconds`, 429, { retryAfter }),

  internalError: (message: string = 'Internal server error') =>
    errorResponse('INTERNAL_ERROR', message, 500),

  validationError: (field: string, message: string) =>
    errorResponse('VALIDATION_ERROR', message, 400, { field }),
};
