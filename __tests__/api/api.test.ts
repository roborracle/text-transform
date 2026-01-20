/**
 * @jest-environment node
 */

import {
  successResponse,
  errorResponse,
  ApiErrors,
  checkRateLimit,
  RateLimits,
  getCategories,
  getAllTools,
  getTool,
  getToolsByCategory,
  toolsRegistry,
} from '../../lib/api';

describe('API Response Utilities', () => {
  describe('successResponse', () => {
    it('should create success response with data', () => {
      const response = successResponse({ test: 'data' });
      expect(response.status).toBe(200);
    });

    it('should create success response with custom status', () => {
      const response = successResponse({ test: 'data' }, {}, 201);
      expect(response.status).toBe(201);
    });
  });

  describe('errorResponse', () => {
    it('should create error response', () => {
      const response = errorResponse('TEST_ERROR', 'Test error message', 400);
      expect(response.status).toBe(400);
    });
  });

  describe('ApiErrors', () => {
    it('should create badRequest error', () => {
      const response = ApiErrors.badRequest('Invalid input');
      expect(response.status).toBe(400);
    });

    it('should create notFound error', () => {
      const response = ApiErrors.notFound('Tool');
      expect(response.status).toBe(404);
    });

    it('should create tooManyRequests error', () => {
      const response = ApiErrors.tooManyRequests(60);
      expect(response.status).toBe(429);
    });

    it('should create internalError', () => {
      const response = ApiErrors.internalError();
      expect(response.status).toBe(500);
    });

    it('should create validationError', () => {
      const response = ApiErrors.validationError('input', 'Input is required');
      expect(response.status).toBe(400);
    });
  });
});

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear rate limit store between tests by using unique keys
  });

  it('should allow requests within limit', () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    const result = checkRateLimit(key, RateLimits.standard);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(99); // 100 - 1
  });

  it('should track remaining requests', () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    checkRateLimit(key, { limit: 5, windowSeconds: 60 });
    checkRateLimit(key, { limit: 5, windowSeconds: 60 });
    const result = checkRateLimit(key, { limit: 5, windowSeconds: 60 });
    expect(result.remaining).toBe(2); // 5 - 3
  });

  it('should block requests over limit', () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    const config = { limit: 2, windowSeconds: 60 };

    checkRateLimit(key, config);
    checkRateLimit(key, config);
    const result = checkRateLimit(key, config);

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeDefined();
  });

  it('should have correct RateLimits configurations', () => {
    expect(RateLimits.standard.limit).toBe(100);
    expect(RateLimits.strict.limit).toBe(20);
    expect(RateLimits.generous.limit).toBe(300);
  });
});

describe('Tools Registry', () => {
  describe('getCategories', () => {
    it('should return all 8 categories', () => {
      const categories = getCategories();
      expect(categories.length).toBe(8);
    });

    it('should have correct category structure', () => {
      const categories = getCategories();
      for (const cat of categories) {
        expect(cat.name).toBeTruthy();
        expect(cat.slug).toBeTruthy();
        expect(cat.description).toBeTruthy();
        expect(cat.toolCount).toBeGreaterThan(0);
      }
    });

    it('should include all expected categories', () => {
      const categories = getCategories();
      const slugs = categories.map(c => c.slug);
      expect(slugs).toContain('naming-conventions');
      expect(slugs).toContain('encoding');
      expect(slugs).toContain('crypto');
      expect(slugs).toContain('formatters');
      expect(slugs).toContain('converters');
      expect(slugs).toContain('colors');
      expect(slugs).toContain('generators');
      expect(slugs).toContain('ciphers');
    });
  });

  describe('getAllTools', () => {
    it('should return all tools', () => {
      const tools = getAllTools();
      expect(tools.length).toBeGreaterThanOrEqual(100);
    });

    it('should have correct tool structure', () => {
      const tools = getAllTools();
      for (const tool of tools) {
        expect(tool.name).toBeTruthy();
        expect(tool.slug).toBeTruthy();
        expect(tool.description).toBeTruthy();
        expect(tool.category).toBeTruthy();
        expect(typeof tool.fn).toBe('function');
      }
    });
  });

  describe('getTool', () => {
    it('should find tool by category and slug', () => {
      const tool = getTool('naming-conventions', 'camel-case');
      expect(tool).toBeDefined();
      expect(tool?.name).toBe('camelCase');
    });

    it('should return undefined for unknown tool', () => {
      const tool = getTool('naming-conventions', 'unknown-tool');
      expect(tool).toBeUndefined();
    });

    it('should return undefined for unknown category', () => {
      const tool = getTool('unknown-category', 'camel-case');
      expect(tool).toBeUndefined();
    });
  });

  describe('getToolsByCategory', () => {
    it('should return tools for valid category', () => {
      const tools = getToolsByCategory('encoding');
      expect(tools).toBeDefined();
      expect(tools!.length).toBeGreaterThan(0);
    });

    it('should return undefined for unknown category', () => {
      const tools = getToolsByCategory('unknown');
      expect(tools).toBeUndefined();
    });
  });

  describe('toolsRegistry', () => {
    it('should have naming conventions tools', () => {
      expect(toolsRegistry['naming-conventions'].length).toBeGreaterThanOrEqual(14);
    });

    it('should have encoding tools', () => {
      expect(toolsRegistry['encoding'].length).toBeGreaterThanOrEqual(16);
    });

    it('should have crypto tools', () => {
      expect(toolsRegistry['crypto'].length).toBeGreaterThanOrEqual(10);
    });

    it('should have formatters tools', () => {
      expect(toolsRegistry['formatters'].length).toBeGreaterThanOrEqual(15);
    });

    it('should have converters tools', () => {
      expect(toolsRegistry['converters'].length).toBeGreaterThanOrEqual(9);
    });

    it('should have colors tools', () => {
      expect(toolsRegistry['colors'].length).toBeGreaterThanOrEqual(10);
    });

    it('should have generators tools', () => {
      expect(toolsRegistry['generators'].length).toBeGreaterThanOrEqual(13);
    });

    it('should have ciphers tools', () => {
      expect(toolsRegistry['ciphers'].length).toBeGreaterThanOrEqual(14);
    });
  });
});

describe('Tool Functions', () => {
  describe('Naming Conventions', () => {
    it('should transform to camelCase', async () => {
      const tool = getTool('naming-conventions', 'camel-case');
      const result = await tool!.fn('hello world');
      expect(result).toBe('helloWorld');
    });

    it('should transform to snake_case', async () => {
      const tool = getTool('naming-conventions', 'snake-case');
      const result = await tool!.fn('helloWorld');
      expect(result).toBe('hello_world');
    });
  });

  describe('Encoding', () => {
    it('should encode to Base64', async () => {
      const tool = getTool('encoding', 'base64-encode');
      const result = await tool!.fn('hello');
      expect(result).toBe('aGVsbG8=');
    });

    it('should decode from Base64', async () => {
      const tool = getTool('encoding', 'base64-decode');
      const result = await tool!.fn('aGVsbG8=');
      expect(result).toBe('hello');
    });

    it('should URL encode', async () => {
      const tool = getTool('encoding', 'url-encode');
      const result = await tool!.fn('hello world');
      expect(result).toBe('hello%20world');
    });
  });

  describe('Crypto', () => {
    it('should generate UUID', async () => {
      const tool = getTool('crypto', 'uuid');
      const result = await tool!.fn();
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should generate ULID', async () => {
      const tool = getTool('crypto', 'ulid');
      const result = await tool!.fn();
      expect(result).toMatch(/^[0-9A-Z]{26}$/);
    });
  });

  describe('Formatters', () => {
    it('should format JSON', async () => {
      const tool = getTool('formatters', 'json-format');
      const result = await tool!.fn('{"a":1}');
      expect(result).toContain('"a": 1');
    });

    it('should minify JSON', async () => {
      const tool = getTool('formatters', 'json-minify');
      const result = await tool!.fn('{ "a": 1 }');
      expect(result).toBe('{"a":1}');
    });
  });

  describe('Colors', () => {
    it('should convert HEX to RGB', async () => {
      const tool = getTool('colors', 'hex-to-rgb');
      const result = await tool!.fn('#ff0000');
      expect(result).toBe('rgb(255, 0, 0)');
    });

    it('should generate random color', async () => {
      const tool = getTool('colors', 'random-color');
      const result = await tool!.fn();
      expect(result).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe('Generators', () => {
    it('should generate IPv4', async () => {
      const tool = getTool('generators', 'ipv4');
      const result = await tool!.fn();
      expect(result).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
    });

    it('should generate random email', async () => {
      const tool = getTool('generators', 'random-email');
      const result = await tool!.fn();
      expect(result).toContain('@');
    });
  });

  describe('Ciphers', () => {
    it('should encode ROT13', async () => {
      const tool = getTool('ciphers', 'rot13');
      const result = await tool!.fn('hello');
      expect(result).toBe('uryyb');
    });

    it('should decode ROT13 (symmetric)', async () => {
      const tool = getTool('ciphers', 'rot13');
      const result = await tool!.fn('uryyb');
      expect(result).toBe('hello');
    });

    it('should encode Morse', async () => {
      const tool = getTool('ciphers', 'text-to-morse');
      const result = await tool!.fn('SOS');
      expect(result).toBe('... --- ...');
    });
  });
});
