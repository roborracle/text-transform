/**
 * Category Definitions
 * All 8 tool categories with metadata
 */

import type { Category } from './types';

/**
 * All tool categories
 */
export const CATEGORIES: Category[] = [
  {
    id: 'naming-conventions',
    name: 'Naming Conventions',
    description: 'Convert between camelCase, snake_case, kebab-case, PascalCase, and more. Essential tools for developers working with different coding standards.',
    icon: 'Aa',
    slug: 'naming-conventions',
  },
  {
    id: 'encoding',
    name: 'Encoding & Decoding',
    description: 'Base64, URL encoding, HTML entities, binary, hex, and more. Encode and decode data for web development and data processing.',
    icon: '{ }',
    slug: 'encoding',
  },
  {
    id: 'crypto',
    name: 'Cryptography & Hashing',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes, UUIDs, ULIDs, and work with JWT tokens. Security-focused tools for developers.',
    icon: '#',
    slug: 'crypto',
  },
  {
    id: 'formatters',
    name: 'Code Formatters',
    description: 'Format and minify JSON, SQL, XML, CSS, JavaScript, and HTML. Keep your code clean and readable or minimize for production.',
    icon: '</>',
    slug: 'formatters',
  },
  {
    id: 'converters',
    name: 'Data Converters',
    description: 'Convert between CSV, JSON, XML, YAML, and more. Transform data formats for APIs, databases, and data processing workflows.',
    icon: '⇄',
    slug: 'converters',
  },
  {
    id: 'colors',
    name: 'Color Utilities',
    description: 'Convert between HEX, RGB, HSL color formats. Generate complementary colors and CSS variables for your designs.',
    icon: '◐',
    slug: 'colors',
  },
  {
    id: 'generators',
    name: 'Random Generators',
    description: 'Generate passwords, IPs, emails, usernames, test credit cards, Lorem Ipsum, and more. Create realistic test data instantly.',
    icon: '⚄',
    slug: 'generators',
  },
  {
    id: 'ciphers',
    name: 'Ciphers & Encoding',
    description: 'Caesar cipher, ROT13, Morse code, NATO alphabet, Pig Latin, and more. Classic encoding and cipher tools for fun and learning.',
    icon: '⌘',
    slug: 'ciphers',
  },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): string[] {
  return CATEGORIES.map((cat) => cat.id);
}

/**
 * Get all category slugs (for static generation)
 */
export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((cat) => cat.slug);
}
