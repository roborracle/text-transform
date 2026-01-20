/**
 * Categories tests
 */

import {
  CATEGORIES,
  getCategoryById,
  getCategoryBySlug,
  getAllCategoryIds,
  getAllCategorySlugs,
} from '@/lib/tools/categories';

describe('Categories', () => {
  describe('CATEGORIES constant', () => {
    it('contains 8 categories', () => {
      expect(CATEGORIES.length).toBe(8);
    });

    it('includes all expected category IDs', () => {
      const expectedIds = [
        'naming-conventions',
        'encoding',
        'crypto',
        'formatters',
        'converters',
        'colors',
        'generators',
        'ciphers',
      ];
      const actualIds = CATEGORIES.map((c) => c.id);
      expectedIds.forEach((id) => {
        expect(actualIds).toContain(id);
      });
    });

    it('each category has all required properties', () => {
      CATEGORIES.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('slug');
      });
    });

    it('each category has non-empty values', () => {
      CATEGORIES.forEach((category) => {
        expect(category.id.length).toBeGreaterThan(0);
        expect(category.name.length).toBeGreaterThan(0);
        expect(category.description.length).toBeGreaterThan(0);
        expect(category.icon.length).toBeGreaterThan(0);
        expect(category.slug.length).toBeGreaterThan(0);
      });
    });

    it('category slugs match their IDs', () => {
      CATEGORIES.forEach((category) => {
        expect(category.slug).toBe(category.id);
      });
    });
  });

  describe('getCategoryById', () => {
    it('returns correct category for valid ID', () => {
      const category = getCategoryById('naming-conventions');
      expect(category).toBeDefined();
      expect(category?.id).toBe('naming-conventions');
      expect(category?.name).toBe('Naming Conventions');
    });

    it('returns category for each valid ID', () => {
      const ids = [
        'naming-conventions',
        'encoding',
        'crypto',
        'formatters',
        'converters',
        'colors',
        'generators',
        'ciphers',
      ];
      ids.forEach((id) => {
        const category = getCategoryById(id);
        expect(category).toBeDefined();
        expect(category?.id).toBe(id);
      });
    });

    it('returns undefined for invalid ID', () => {
      const category = getCategoryById('invalid-id');
      expect(category).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      const category = getCategoryById('');
      expect(category).toBeUndefined();
    });
  });

  describe('getCategoryBySlug', () => {
    it('returns correct category for valid slug', () => {
      const category = getCategoryBySlug('encoding');
      expect(category).toBeDefined();
      expect(category?.slug).toBe('encoding');
      expect(category?.name).toBe('Encoding & Decoding');
    });

    it('returns category for each valid slug', () => {
      const slugs = [
        'naming-conventions',
        'encoding',
        'crypto',
        'formatters',
        'converters',
        'colors',
        'generators',
        'ciphers',
      ];
      slugs.forEach((slug) => {
        const category = getCategoryBySlug(slug);
        expect(category).toBeDefined();
        expect(category?.slug).toBe(slug);
      });
    });

    it('returns undefined for invalid slug', () => {
      const category = getCategoryBySlug('invalid-slug');
      expect(category).toBeUndefined();
    });
  });

  describe('getAllCategoryIds', () => {
    it('returns array of all category IDs', () => {
      const ids = getAllCategoryIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBe(8);
    });

    it('returns unique IDs', () => {
      const ids = getAllCategoryIds();
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('each ID corresponds to a valid category', () => {
      const ids = getAllCategoryIds();
      ids.forEach((id) => {
        const category = getCategoryById(id);
        expect(category).toBeDefined();
      });
    });
  });

  describe('getAllCategorySlugs', () => {
    it('returns array of all category slugs', () => {
      const slugs = getAllCategorySlugs();
      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs.length).toBe(8);
    });

    it('returns unique slugs', () => {
      const slugs = getAllCategorySlugs();
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('each slug corresponds to a valid category', () => {
      const slugs = getAllCategorySlugs();
      slugs.forEach((slug) => {
        const category = getCategoryBySlug(slug);
        expect(category).toBeDefined();
      });
    });
  });

  describe('category naming conventions', () => {
    it('naming-conventions category has correct metadata', () => {
      const category = getCategoryById('naming-conventions');
      expect(category?.name).toBe('Naming Conventions');
      expect(category?.icon).toBe('Aa');
    });

    it('encoding category has correct metadata', () => {
      const category = getCategoryById('encoding');
      expect(category?.name).toBe('Encoding & Decoding');
      expect(category?.icon).toBe('{ }');
    });

    it('crypto category has correct metadata', () => {
      const category = getCategoryById('crypto');
      expect(category?.name).toBe('Cryptography & Hashing');
      expect(category?.icon).toBe('#');
    });

    it('formatters category has correct metadata', () => {
      const category = getCategoryById('formatters');
      expect(category?.name).toBe('Code Formatters');
      expect(category?.icon).toBe('</>');
    });

    it('converters category has correct metadata', () => {
      const category = getCategoryById('converters');
      expect(category?.name).toBe('Data Converters');
      expect(category?.icon).toBe('⇄');
    });

    it('colors category has correct metadata', () => {
      const category = getCategoryById('colors');
      expect(category?.name).toBe('Color Utilities');
      expect(category?.icon).toBe('◐');
    });

    it('generators category has correct metadata', () => {
      const category = getCategoryById('generators');
      expect(category?.name).toBe('Random Generators');
      expect(category?.icon).toBe('⚄');
    });

    it('ciphers category has correct metadata', () => {
      const category = getCategoryById('ciphers');
      expect(category?.name).toBe('Ciphers & Encoding');
      expect(category?.icon).toBe('⌘');
    });
  });
});
