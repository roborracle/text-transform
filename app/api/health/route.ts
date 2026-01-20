/**
 * GET /api/health
 * Health check endpoint
 */

import { NextResponse } from 'next/server';
import { getAllTools, getCategories } from '@/lib/api';

export async function GET() {
  const tools = getAllTools();
  const categories = getCategories();

  return NextResponse.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    stats: {
      totalTools: tools.length,
      categories: categories.length,
    },
    endpoints: {
      tools: '/api/tools',
      transform: '/api/transform/{category}/{tool}',
      health: '/api/health',
      docs: '/api/docs',
    },
  });
}
