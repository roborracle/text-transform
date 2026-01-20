/**
 * GET /api/docs
 * OpenAPI specification for the Text Transform API
 */

import { NextResponse } from 'next/server';
import { getAllTools, getCategories } from '@/lib/api';

export async function GET() {
  const tools = getAllTools();
  const categories = getCategories();

  // Generate paths for each tool
  const paths: Record<string, unknown> = {
    '/api/health': {
      get: {
        summary: 'Health check',
        description: 'Check API health status',
        tags: ['System'],
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    version: { type: 'string', example: '1.0.0' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/tools': {
      get: {
        summary: 'List all tools',
        description: 'Get a list of all available transformation tools',
        tags: ['Tools'],
        parameters: [
          {
            name: 'category',
            in: 'query',
            description: 'Filter by category',
            required: false,
            schema: { type: 'string', enum: categories.map(c => c.slug) },
          },
        ],
        responses: {
          '200': {
            description: 'List of tools',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        totalTools: { type: 'integer' },
                        categories: { type: 'array', items: { type: 'object' } },
                        tools: { type: 'array', items: { type: 'object' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  // Add paths for each tool
  for (const tool of tools) {
    const path = `/api/transform/${tool.category}/${tool.slug}`;

    const requestBodyProperties: Record<string, unknown> = {};
    const required: string[] = [];

    if (!tool.isGenerator) {
      requestBodyProperties.input = {
        type: 'string',
        description: 'Input text to transform',
      };
      required.push('input');
    }

    if (tool.params && tool.params.length > 0) {
      const optionsProperties: Record<string, unknown> = {};
      for (const param of tool.params) {
        optionsProperties[param.name] = {
          type: param.type,
          description: param.description,
          default: param.default,
        };
      }
      requestBodyProperties.options = {
        type: 'object',
        properties: optionsProperties,
      };
    }

    paths[path] = {
      get: {
        summary: `Get ${tool.name} info`,
        description: `Get information about the ${tool.name} tool`,
        tags: [tool.category],
        responses: {
          '200': { description: 'Tool information' },
          '404': { description: 'Tool not found' },
        },
      },
      post: {
        summary: tool.name,
        description: tool.description,
        tags: [tool.category],
        requestBody: {
          required: !tool.isGenerator,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: requestBodyProperties,
                required: required.length > 0 ? required : undefined,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Transformation result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        tool: { type: 'string' },
                        category: { type: 'string' },
                        input: { type: 'string', nullable: true },
                        output: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': { description: 'Bad request' },
          '404': { description: 'Tool not found' },
          '429': { description: 'Rate limit exceeded' },
        },
      },
    };
  }

  const openApiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'Text Transform API',
      description: `REST API for 111+ text transformation tools. All transformations are performed server-side with rate limiting.

## Rate Limits
- Standard endpoints: 100 requests/minute
- List endpoints: 300 requests/minute

## Categories
${categories.map(c => `- **${c.name}** (${c.toolCount} tools)`).join('\n')}
`,
      version: '1.0.0',
      contact: {
        name: 'Text Transform',
        url: 'https://texttransform.dev',
      },
    },
    servers: [
      {
        url: 'https://texttransform.dev',
        description: 'Production',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development',
      },
    ],
    tags: [
      { name: 'System', description: 'System endpoints' },
      { name: 'Tools', description: 'Tool discovery' },
      ...categories.map(c => ({
        name: c.slug,
        description: `${c.name} - ${c.toolCount} tools`,
      })),
    ],
    paths,
    components: {
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object', nullable: true },
            error: {
              type: 'object',
              nullable: true,
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
              },
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: { type: 'string', format: 'date-time' },
                version: { type: 'string' },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
