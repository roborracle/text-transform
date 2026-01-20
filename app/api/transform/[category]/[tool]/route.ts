/**
 * POST /api/transform/[category]/[tool]
 * Execute a transformation on input text
 */

import { NextRequest } from 'next/server';
import {
  successResponse,
  ApiErrors,
  checkRateLimit,
  getRateLimitKey,
  RateLimits,
  getTool,
} from '@/lib/api';

interface TransformRequest {
  input?: string;
  options?: Record<string, unknown>;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; tool: string }> }
) {
  const { category, tool: toolSlug } = await params;

  // Rate limiting
  const rateLimitKey = getRateLimitKey(request);
  const rateLimit = checkRateLimit(rateLimitKey, RateLimits.standard);

  if (!rateLimit.success) {
    return ApiErrors.tooManyRequests(rateLimit.retryAfter!);
  }

  // Get the tool
  const tool = getTool(category, toolSlug);
  if (!tool) {
    return ApiErrors.notFound(`Tool '${toolSlug}' in category '${category}'`);
  }

  // Parse request body
  let body: TransformRequest;
  try {
    body = await request.json();
  } catch {
    return ApiErrors.badRequest('Invalid JSON in request body');
  }

  const { input, options = {} } = body;

  // Validate input (generators don't need input)
  if (!tool.isGenerator && (input === undefined || input === null)) {
    return ApiErrors.validationError('input', 'Input text is required');
  }

  // Validate required params
  if (tool.params) {
    for (const param of tool.params) {
      if (param.required && options[param.name] === undefined) {
        return ApiErrors.validationError(
          param.name,
          `Parameter '${param.name}' is required: ${param.description}`
        );
      }
    }
  }

  // Execute transformation
  try {
    let result: string;

    if (tool.isGenerator) {
      // Generators may use options as first argument
      const firstParam = tool.params?.[0];
      if (firstParam) {
        const paramValue = options[firstParam.name] ?? firstParam.default;
        result = await Promise.resolve(tool.fn(paramValue));
      } else {
        result = await Promise.resolve(tool.fn());
      }
    } else if (tool.params && tool.params.length > 0) {
      // Tool with parameters
      const paramValues = tool.params.map(p => options[p.name] ?? p.default);
      result = await Promise.resolve(tool.fn(input!, ...paramValues));
    } else {
      // Simple transformation
      result = await Promise.resolve(tool.fn(input!));
    }

    return successResponse(
      {
        tool: tool.name,
        category: tool.category,
        input: input || null,
        output: result,
        options: Object.keys(options).length > 0 ? options : undefined,
      },
      { rateLimit: { remaining: rateLimit.remaining, reset: rateLimit.reset } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Transformation failed';
    return ApiErrors.badRequest(message, { tool: tool.name, category: tool.category });
  }
}

/**
 * GET /api/transform/[category]/[tool]
 * Get tool information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string; tool: string }> }
) {
  const { category, tool: toolSlug } = await params;

  // Rate limiting
  const rateLimitKey = getRateLimitKey(request);
  const rateLimit = checkRateLimit(rateLimitKey, RateLimits.generous);

  if (!rateLimit.success) {
    return ApiErrors.tooManyRequests(rateLimit.retryAfter!);
  }

  // Get the tool
  const tool = getTool(category, toolSlug);
  if (!tool) {
    return ApiErrors.notFound(`Tool '${toolSlug}' in category '${category}'`);
  }

  return successResponse(
    {
      name: tool.name,
      slug: tool.slug,
      category: tool.category,
      description: tool.description,
      endpoint: `/api/transform/${tool.category}/${tool.slug}`,
      method: 'POST',
      isGenerator: tool.isGenerator || false,
      params: tool.params || [],
      example: {
        request: {
          input: tool.isGenerator ? undefined : 'example input',
          options: tool.params?.reduce((acc, p) => {
            if (p.default !== undefined) {
              acc[p.name] = p.default;
            }
            return acc;
          }, {} as Record<string, unknown>),
        },
      },
    },
    { rateLimit: { remaining: rateLimit.remaining, reset: rateLimit.reset } }
  );
}
