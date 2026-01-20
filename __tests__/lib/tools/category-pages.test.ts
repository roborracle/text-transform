/**
 * Category Pages Data tests
 * Tests for category data that powers the category pages
 */

import {
  getAllCategories,
  getCategoryBySlug,
  getToolsByCategorySlug,
  getAllCategoriesWithCounts,
} from '@/lib/tools';

describe('Category Pages Data', () => {
  describe('getAllCategories', () => {
    it('returns exactly 8 categories', () => {
      const categories = getAllCategories();
      expect(categories.length).toBe(8);
    });

    it('includes all expected category slugs', () => {
      const categories = getAllCategories();
      const slugs = categories.map((c) => c.slug);

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

  describe('getCategoryBySlug', () => {
    it('returns correct category for naming-conventions', () => {
      const category = getCategoryBySlug('naming-conventions');
      expect(category).toBeDefined();
      expect(category?.name).toBe('Naming Conventions');
      expect(category?.icon).toBe('Aa');
    });

    it('returns correct category for encoding', () => {
      const category = getCategoryBySlug('encoding');
      expect(category).toBeDefined();
      expect(category?.name).toBe('Encoding & Decoding');
      expect(category?.icon).toBe('{ }');
    });

    it('returns correct category for crypto', () => {
      const category = getCategoryBySlug('crypto');
      expect(category).toBeDefined();
      expect(category?.name).toBe('Cryptography & Hashing');
      expect(category?.icon).toBe('#');
    });

    it('returns correct category for formatters', () => {
      const category = getCategoryBySlug('formatters');
      expect(category).toBeDefined();
      expect(category?.name).toBe('Code Formatters');
      expect(category?.icon).toBe('</>');
    });

    it('returns correct category for converters', () => {
      const category = getCategoryBySlug('converters');
      expect(category).toBeDefined();
      expect(category?.name).toBe('Data Converters');
    });

    it('returns correct category for colors', () => {
      const category = getCategoryBySlug('colors');
      expect(category).toBeDefined();
      expect(category?.name).toBe('Color Utilities');
    });

    it('returns correct category for generators', () => {
      const category = getCategoryBySlug('generators');
      expect(category).toBeDefined();
      expect(category?.name).toBe('Random Generators');
    });

    it('returns correct category for ciphers', () => {
      const category = getCategoryBySlug('ciphers');
      expect(category).toBeDefined();
      expect(category?.name).toBe('Ciphers & Encoding');
    });

    it('returns undefined for invalid slug', () => {
      const category = getCategoryBySlug('invalid-category');
      expect(category).toBeUndefined();
    });
  });

  describe('getToolsByCategorySlug', () => {
    it('returns tools for naming-conventions category', () => {
      const tools = getToolsByCategorySlug('naming-conventions');
      expect(tools.length).toBe(14);
      tools.forEach((tool) => {
        expect(tool.categoryId).toBe('naming-conventions');
      });
    });

    it('returns tools for encoding category', () => {
      const tools = getToolsByCategorySlug('encoding');
      expect(tools.length).toBe(16);
      tools.forEach((tool) => {
        expect(tool.categoryId).toBe('encoding');
      });
    });

    it('returns tools for crypto category', () => {
      const tools = getToolsByCategorySlug('crypto');
      expect(tools.length).toBe(13);
      tools.forEach((tool) => {
        expect(tool.categoryId).toBe('crypto');
      });
    });

    it('returns tools for formatters category', () => {
      const tools = getToolsByCategorySlug('formatters');
      expect(tools.length).toBe(18);
      tools.forEach((tool) => {
        expect(tool.categoryId).toBe('formatters');
      });
    });

    it('returns tools for converters category', () => {
      const tools = getToolsByCategorySlug('converters');
      expect(tools.length).toBe(4);
      tools.forEach((tool) => {
        expect(tool.categoryId).toBe('converters');
      });
    });

    it('returns tools for colors category', () => {
      const tools = getToolsByCategorySlug('colors');
      expect(tools.length).toBe(11);
      tools.forEach((tool) => {
        expect(tool.categoryId).toBe('colors');
      });
    });

    it('returns tools for generators category', () => {
      const tools = getToolsByCategorySlug('generators');
      expect(tools.length).toBe(13);
      tools.forEach((tool) => {
        expect(tool.categoryId).toBe('generators');
      });
    });

    it('returns tools for ciphers category', () => {
      const tools = getToolsByCategorySlug('ciphers');
      expect(tools.length).toBe(15);
      tools.forEach((tool) => {
        expect(tool.categoryId).toBe('ciphers');
      });
    });

    it('returns empty array for invalid slug', () => {
      const tools = getToolsByCategorySlug('invalid-category');
      expect(tools).toEqual([]);
    });
  });

  describe('getAllCategoriesWithCounts', () => {
    it('returns categories with correct tool counts', () => {
      const categories = getAllCategoriesWithCounts();

      const namingConventions = categories.find(
        (c) => c.slug === 'naming-conventions'
      );
      expect(namingConventions?.toolCount).toBe(14);

      const encoding = categories.find((c) => c.slug === 'encoding');
      expect(encoding?.toolCount).toBe(16);

      const crypto = categories.find((c) => c.slug === 'crypto');
      expect(crypto?.toolCount).toBe(13);

      const formatters = categories.find((c) => c.slug === 'formatters');
      expect(formatters?.toolCount).toBe(18);

      const converters = categories.find((c) => c.slug === 'converters');
      expect(converters?.toolCount).toBe(4);

      const colors = categories.find((c) => c.slug === 'colors');
      expect(colors?.toolCount).toBe(11);

      const generators = categories.find((c) => c.slug === 'generators');
      expect(generators?.toolCount).toBe(13);

      const ciphers = categories.find((c) => c.slug === 'ciphers');
      expect(ciphers?.toolCount).toBe(15);
    });

    it('total tool count is 104', () => {
      const categories = getAllCategoriesWithCounts();
      const total = categories.reduce((sum, c) => sum + c.toolCount, 0);
      expect(total).toBe(104);
    });
  });

  describe('category tool data integrity', () => {
    it('all tools have required fields', () => {
      const categories = getAllCategories();
      categories.forEach((category) => {
        const tools = getToolsByCategorySlug(category.slug);
        tools.forEach((tool) => {
          expect(tool.id).toBeDefined();
          expect(tool.name).toBeDefined();
          expect(tool.description).toBeDefined();
          expect(tool.slug).toBeDefined();
          expect(tool.transformFn).toBeDefined();
          expect(Array.isArray(tool.keywords)).toBe(true);
          expect(tool.keywords.length).toBeGreaterThan(0);
        });
      });
    });

    it('all tool slugs are unique within category', () => {
      const categories = getAllCategories();
      categories.forEach((category) => {
        const tools = getToolsByCategorySlug(category.slug);
        const slugs = tools.map((t) => t.slug);
        const uniqueSlugs = new Set(slugs);
        expect(uniqueSlugs.size).toBe(slugs.length);
      });
    });

    it('all tool IDs are unique globally', () => {
      const categories = getAllCategories();
      const allIds: string[] = [];
      categories.forEach((category) => {
        const tools = getToolsByCategorySlug(category.slug);
        tools.forEach((tool) => {
          allIds.push(tool.id);
        });
      });
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });
  });

  describe('specific tool existence', () => {
    it('naming-conventions has expected tools', () => {
      const tools = getToolsByCategorySlug('naming-conventions');
      const slugs = tools.map((t) => t.slug);

      expect(slugs).toContain('to-camel-case');
      expect(slugs).toContain('to-pascal-case');
      expect(slugs).toContain('to-snake-case');
      expect(slugs).toContain('to-kebab-case');
    });

    it('encoding has expected tools', () => {
      const tools = getToolsByCategorySlug('encoding');
      const slugs = tools.map((t) => t.slug);

      expect(slugs).toContain('base64-encode');
      expect(slugs).toContain('base64-decode');
      expect(slugs).toContain('url-encode');
      expect(slugs).toContain('url-decode');
    });

    it('crypto has expected tools', () => {
      const tools = getToolsByCategorySlug('crypto');
      const slugs = tools.map((t) => t.slug);

      expect(slugs).toContain('md5-hash');
      expect(slugs).toContain('sha256-hash');
      expect(slugs).toContain('generate-uuid');
    });

    it('formatters has expected tools', () => {
      const tools = getToolsByCategorySlug('formatters');
      const slugs = tools.map((t) => t.slug);

      expect(slugs).toContain('format-json');
      expect(slugs).toContain('minify-json');
      expect(slugs).toContain('format-sql');
    });

    it('colors has expected tools', () => {
      const tools = getToolsByCategorySlug('colors');
      const slugs = tools.map((t) => t.slug);

      expect(slugs).toContain('hex-to-rgb');
      expect(slugs).toContain('rgb-to-hex');
    });

    it('generators has expected tools', () => {
      const tools = getToolsByCategorySlug('generators');
      const slugs = tools.map((t) => t.slug);

      expect(slugs).toContain('password-generator');
      expect(slugs).toContain('lorem-ipsum');
    });

    it('ciphers has expected tools', () => {
      const tools = getToolsByCategorySlug('ciphers');
      const slugs = tools.map((t) => t.slug);

      expect(slugs).toContain('rot13');
      expect(slugs).toContain('caesar-encode');
      expect(slugs).toContain('text-to-morse');
    });
  });
});
