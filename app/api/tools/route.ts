/**
 * GET /api/tools
 * List all available transformation tools
 */

import { NextRequest } from 'next/server';
import {
  successResponse,
  ApiErrors,
  checkRateLimit,
  getRateLimitKey,
  RateLimits,
  getCategories,
  getAllTools,
  getToolsByCategory,
} from '@/lib/api';

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitKey = getRateLimitKey(request);
  const rateLimit = checkRateLimit(rateLimitKey, RateLimits.generous);

  if (!rateLimit.success) {
    return ApiErrors.tooManyRequests(rateLimit.retryAfter!);
  }

  // Check for category filter
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category) {
    const tools = getToolsByCategory(category);
    if (!tools) {
      return ApiErrors.notFound(`Category '${category}'`);
    }

    return successResponse(
      {
        category,
        tools: tools.map(t => ({
          name: t.name,
          slug: t.slug,
          description: t.description,
          endpoint: `/api/transform/${t.category}/${t.slug}`,
          params: t.params,
          isGenerator: t.isGenerator || false,
        })),
      },
      { rateLimit: { remaining: rateLimit.remaining, reset: rateLimit.reset } }
    );
  }

  // Return all categories and tools
  const categories = getCategories();
  const tools = getAllTools();

  return successResponse(
    {
      totalTools: tools.length,
      categories: categories.map(c => ({
        ...c,
        endpoint: `/api/tools?category=${c.slug}`,
      })),
      tools: tools.map(t => ({
        name: t.name,
        slug: t.slug,
        category: t.category,
        description: t.description,
        endpoint: `/api/transform/${t.category}/${t.slug}`,
        isGenerator: t.isGenerator || false,
      })),
    },
    { rateLimit: { remaining: rateLimit.remaining, reset: rateLimit.reset } }
  );
}
