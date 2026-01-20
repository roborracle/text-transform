/**
 * Tool Registry tests
 */

import {
  getToolById,
  getToolBySlug,
  getTool,
  getToolWithCategory,
  getToolsByCategory,
  getToolsByCategorySlug,
  getAllTools,
  getAllCategories,
  getAllCategoriesWithCounts,
  getToolCount,
  getCategoryToolCount,
  searchTools,
  getAllToolSlugs,
  getRelatedTools,
  getPopularTools,
} from '@/lib/tools/registry';
import { CATEGORIES } from '@/lib/tools/categories';

describe('Tool Registry', () => {
  describe('getToolById', () => {
    it('returns a tool when given a valid ID', () => {
      const tool = getToolById('to-camel-case');
      expect(tool).toBeDefined();
      expect(tool?.id).toBe('to-camel-case');
      expect(tool?.name).toBe('To camelCase');
    });

    it('returns undefined for invalid ID', () => {
      const tool = getToolById('non-existent-tool');
      expect(tool).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const tool = getToolById('');
      expect(tool).toBeUndefined();
    });
  });

  describe('getToolBySlug', () => {
    it('returns a tool when given a valid slug', () => {
      const tool = getToolBySlug('to-camel-case');
      expect(tool).toBeDefined();
      expect(tool?.slug).toBe('to-camel-case');
    });

    it('returns undefined for invalid slug', () => {
      const tool = getToolBySlug('non-existent-slug');
      expect(tool).toBeUndefined();
    });
  });

  describe('getTool', () => {
    it('returns a tool when given valid category and tool slugs', () => {
      const tool = getTool('naming-conventions', 'to-camel-case');
      expect(tool).toBeDefined();
      expect(tool?.id).toBe('to-camel-case');
      expect(tool?.categoryId).toBe('naming-conventions');
    });

    it('returns undefined for invalid category slug', () => {
      const tool = getTool('invalid-category', 'to-camel-case');
      expect(tool).toBeUndefined();
    });

    it('returns undefined for invalid tool slug', () => {
      const tool = getTool('naming-conventions', 'invalid-tool');
      expect(tool).toBeUndefined();
    });

    it('returns undefined when tool exists but in different category', () => {
      const tool = getTool('encoding', 'to-camel-case');
      expect(tool).toBeUndefined();
    });
  });

  describe('getToolWithCategory', () => {
    it('returns tool with category resolved', () => {
      const toolWithCategory = getToolWithCategory('to-camel-case');
      expect(toolWithCategory).toBeDefined();
      expect(toolWithCategory?.id).toBe('to-camel-case');
      expect(toolWithCategory?.category).toBeDefined();
      expect(toolWithCategory?.category.id).toBe('naming-conventions');
    });

    it('returns undefined for invalid tool ID', () => {
      const toolWithCategory = getToolWithCategory('invalid-id');
      expect(toolWithCategory).toBeUndefined();
    });
  });

  describe('getToolsByCategory', () => {
    it('returns array of tools for valid category ID', () => {
      const tools = getToolsByCategory('naming-conventions');
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
      tools.forEach((tool) => {
        expect(tool.categoryId).toBe('naming-conventions');
      });
    });

    it('returns empty array for invalid category ID', () => {
      const tools = getToolsByCategory('invalid-category');
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBe(0);
    });
  });

  describe('getToolsByCategorySlug', () => {
    it('returns array of tools for valid category slug', () => {
      const tools = getToolsByCategorySlug('naming-conventions');
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
    });

    it('returns empty array for invalid category slug', () => {
      const tools = getToolsByCategorySlug('invalid-slug');
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBe(0);
    });
  });

  describe('getAllTools', () => {
    it('returns array of all tools', () => {
      const tools = getAllTools();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(100);
    });

    it('each tool has required properties', () => {
      const tools = getAllTools();
      tools.forEach((tool) => {
        expect(tool.id).toBeDefined();
        expect(tool.name).toBeDefined();
        expect(tool.description).toBeDefined();
        expect(tool.categoryId).toBeDefined();
        expect(tool.slug).toBeDefined();
        expect(tool.transformFn).toBeDefined();
        expect(Array.isArray(tool.keywords)).toBe(true);
      });
    });
  });

  describe('getAllCategories', () => {
    it('returns array of all categories', () => {
      const categories = getAllCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(8);
    });

    it('each category has required properties', () => {
      const categories = getAllCategories();
      categories.forEach((category) => {
        expect(category.id).toBeDefined();
        expect(category.name).toBeDefined();
        expect(category.description).toBeDefined();
        expect(category.icon).toBeDefined();
        expect(category.slug).toBeDefined();
      });
    });
  });

  describe('getAllCategoriesWithCounts', () => {
    it('returns categories with tool counts', () => {
      const categories = getAllCategoriesWithCounts();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(8);
      categories.forEach((category) => {
        expect(typeof category.toolCount).toBe('number');
        expect(category.toolCount).toBeGreaterThan(0);
      });
    });

    it('tool counts match actual tools in category', () => {
      const categories = getAllCategoriesWithCounts();
      categories.forEach((category) => {
        const tools = getToolsByCategory(category.id);
        expect(category.toolCount).toBe(tools.length);
      });
    });
  });

  describe('getToolCount', () => {
    it('returns total number of tools', () => {
      const count = getToolCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(100);
    });

    it('matches getAllTools length', () => {
      const count = getToolCount();
      const tools = getAllTools();
      expect(count).toBe(tools.length);
    });
  });

  describe('getCategoryToolCount', () => {
    it('returns tool count for valid category', () => {
      const count = getCategoryToolCount('naming-conventions');
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });

    it('returns 0 for invalid category', () => {
      const count = getCategoryToolCount('invalid-category');
      expect(count).toBe(0);
    });
  });

  describe('searchTools', () => {
    it('finds tools matching single keyword', () => {
      const results = searchTools('base64');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((tool) => {
        const searchableText = [tool.name, tool.description, ...tool.keywords]
          .join(' ')
          .toLowerCase();
        expect(searchableText).toContain('base64');
      });
    });

    it('finds tools matching multiple keywords', () => {
      const results = searchTools('json format');
      expect(results.length).toBeGreaterThan(0);
    });

    it('returns empty array for no matches', () => {
      const results = searchTools('xyznonexistent123');
      expect(results).toEqual([]);
    });

    it('returns empty array for empty query', () => {
      const results = searchTools('');
      expect(results).toEqual([]);
    });

    it('returns empty array for whitespace query', () => {
      const results = searchTools('   ');
      expect(results).toEqual([]);
    });

    it('is case insensitive', () => {
      const lowerResults = searchTools('base64');
      const upperResults = searchTools('BASE64');
      expect(lowerResults.length).toBe(upperResults.length);
    });
  });

  describe('getAllToolSlugs', () => {
    it('returns array of category/tool slug pairs', () => {
      const slugs = getAllToolSlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBeGreaterThan(0);
      slugs.forEach((pair) => {
        expect(pair.category).toBeDefined();
        expect(pair.tool).toBeDefined();
        expect(typeof pair.category).toBe('string');
        expect(typeof pair.tool).toBe('string');
      });
    });

    it('all pairs correspond to valid tools', () => {
      const slugs = getAllToolSlugs();
      slugs.forEach((pair) => {
        const tool = getTool(pair.category, pair.tool);
        expect(tool).toBeDefined();
      });
    });
  });

  describe('getRelatedTools', () => {
    it('returns tools from same category', () => {
      const tool = getToolById('to-camel-case');
      const related = getRelatedTools('to-camel-case');
      expect(Array.isArray(related)).toBe(true);
      related.forEach((relatedTool) => {
        expect(relatedTool.categoryId).toBe(tool?.categoryId);
      });
    });

    it('excludes the current tool', () => {
      const related = getRelatedTools('to-camel-case');
      const ids = related.map((t) => t.id);
      expect(ids).not.toContain('to-camel-case');
    });

    it('respects limit parameter', () => {
      const related3 = getRelatedTools('to-camel-case', 3);
      const related5 = getRelatedTools('to-camel-case', 5);
      expect(related3.length).toBeLessThanOrEqual(3);
      expect(related5.length).toBeLessThanOrEqual(5);
    });

    it('returns empty array for invalid tool ID', () => {
      const related = getRelatedTools('invalid-id');
      expect(related).toEqual([]);
    });
  });

  describe('getPopularTools', () => {
    it('returns array of popular tools', () => {
      const popular = getPopularTools();
      expect(Array.isArray(popular)).toBe(true);
      expect(popular.length).toBeGreaterThan(0);
    });

    it('all returned tools are valid', () => {
      const popular = getPopularTools();
      popular.forEach((tool) => {
        expect(tool.id).toBeDefined();
        expect(tool.name).toBeDefined();
      });
    });
  });

  describe('category data integrity', () => {
    it('all category IDs are unique', () => {
      const ids = CATEGORIES.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all category slugs are unique', () => {
      const slugs = CATEGORIES.map((c) => c.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('all tools have valid category IDs', () => {
      const categoryIds = new Set(CATEGORIES.map((c) => c.id));
      const tools = getAllTools();
      tools.forEach((tool) => {
        expect(categoryIds.has(tool.categoryId)).toBe(true);
      });
    });
  });

  describe('tool data integrity', () => {
    it('all tool IDs are unique', () => {
      const tools = getAllTools();
      const ids = tools.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all tool slugs are unique', () => {
      const tools = getAllTools();
      const slugs = tools.map((t) => t.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('all tools have non-empty keywords array', () => {
      const tools = getAllTools();
      tools.forEach((tool) => {
        expect(Array.isArray(tool.keywords)).toBe(true);
        expect(tool.keywords.length).toBeGreaterThan(0);
      });
    });
  });
});
