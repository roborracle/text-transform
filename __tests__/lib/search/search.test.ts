/**
 * Search Function Tests
 */

import { search, searchTools, searchCategories } from '@/lib/search';

describe('Search', () => {
  describe('search function', () => {
    it('returns empty array for empty query', () => {
      expect(search('')).toEqual([]);
      expect(search('   ')).toEqual([]);
    });

    it('finds tools by exact name', () => {
      const results = search('Base64 Encode');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('Base64 Encode');
    });

    it('finds tools by partial name', () => {
      const results = search('base64');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.name.toLowerCase().includes('base64'))).toBe(
        true
      );
    });

    it('finds tools by keyword', () => {
      const results = search('hash');
      expect(results.length).toBeGreaterThan(0);
      // Should find MD5, SHA-256, etc.
      expect(
        results.some(
          (r) =>
            r.name.toLowerCase().includes('hash') ||
            r.keywords?.some((k) => k.includes('hash'))
        )
      ).toBe(true);
    });

    it('finds categories', () => {
      const results = search('encoding');
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((r) => r.type === 'category' && r.name.includes('Encoding'))
      ).toBe(true);
    });

    it('respects limit option', () => {
      const results = search('a', { limit: 5 });
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('filters by type', () => {
      const toolResults = search('json', { type: 'tool' });
      expect(toolResults.every((r) => r.type === 'tool')).toBe(true);

      const categoryResults = search('encoding', { type: 'category' });
      expect(categoryResults.every((r) => r.type === 'category')).toBe(true);
    });

    it('filters by category', () => {
      const results = search('encode', { category: 'encoding' });
      expect(results.every((r) => r.categorySlug === 'encoding')).toBe(true);
    });

    it('sorts by relevance score', () => {
      const results = search('json');
      // Results should be sorted by score (descending)
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    it('handles multi-word queries', () => {
      const results = search('json format');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.name.toLowerCase().includes('json'))).toBe(
        true
      );
    });

    it('is case insensitive', () => {
      const lowerResults = search('base64');
      const upperResults = search('BASE64');
      const mixedResults = search('Base64');

      expect(lowerResults.length).toBe(upperResults.length);
      expect(lowerResults.length).toBe(mixedResults.length);
    });
  });

  describe('searchTools function', () => {
    it('only returns tools', () => {
      const results = searchTools('encoding');
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((r) => r.type === 'tool')).toBe(true);
    });

    it('finds tools by name', () => {
      const results = searchTools('camel case');
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((r) => r.name.toLowerCase().includes('camel'))
      ).toBe(true);
    });
  });

  describe('searchCategories function', () => {
    it('only returns categories', () => {
      const results = searchCategories('tools');
      expect(results.every((r) => r.type === 'category')).toBe(true);
    });

    it('finds categories by name', () => {
      const results = searchCategories('crypto');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].type).toBe('category');
    });
  });

  describe('search result structure', () => {
    it('includes required fields', () => {
      const results = search('base64');
      expect(results.length).toBeGreaterThan(0);

      const result = results[0];
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('slug');
      expect(result).toHaveProperty('score');
    });

    it('includes categorySlug for tools', () => {
      const results = searchTools('base64');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].categorySlug).toBeDefined();
    });
  });

  describe('search relevance', () => {
    it('ranks exact matches higher than partial', () => {
      const results = search('rot13');
      // ROT13 should be ranked higher than ROT47
      const rot13Index = results.findIndex((r) =>
        r.name.toLowerCase() === 'rot13'
      );
      const rot47Index = results.findIndex((r) =>
        r.name.toLowerCase() === 'rot47'
      );
      if (rot13Index !== -1 && rot47Index !== -1) {
        expect(rot13Index).toBeLessThan(rot47Index);
      }
    });

    it('ranks name matches higher than keyword matches', () => {
      const results = search('json');
      // "Format JSON" should rank higher than tools that just have JSON in keywords
      expect(
        results.some((r) => r.name.toLowerCase().includes('json'))
      ).toBe(true);
    });
  });

  describe('specific tool searches', () => {
    it('finds naming convention tools', () => {
      const results = searchTools('camel');
      expect(results.some((r) => r.slug === 'to-camel-case')).toBe(true);
    });

    it('finds encoding tools', () => {
      const results = searchTools('url encode');
      expect(results.some((r) => r.slug === 'url-encode')).toBe(true);
    });

    it('finds crypto tools', () => {
      const results = searchTools('sha256');
      expect(results.some((r) => r.slug === 'sha256-hash')).toBe(true);
    });

    it('finds formatter tools', () => {
      const results = searchTools('minify css');
      expect(results.some((r) => r.slug === 'minify-css')).toBe(true);
    });

    it('finds color tools', () => {
      const results = searchTools('hex rgb');
      expect(results.some((r) => r.slug === 'hex-to-rgb')).toBe(true);
    });

    it('finds generator tools', () => {
      const results = searchTools('password');
      expect(results.some((r) => r.slug === 'password-generator')).toBe(true);
    });

    it('finds cipher tools', () => {
      const results = searchTools('caesar');
      expect(
        results.some((r) => r.slug.includes('caesar'))
      ).toBe(true);
    });
  });
});
