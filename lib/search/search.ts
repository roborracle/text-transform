/**
 * Search Implementation
 * Fast client-side search with fuzzy matching and relevance scoring
 */

import { getAllTools, getAllCategories, getCategoryById } from '@/lib/tools';
import type { SearchResult, SearchOptions, SearchableItem } from './types';

let searchIndex: SearchableItem[] | null = null;

/**
 * Build the search index from tools and categories
 */
function buildSearchIndex(): SearchableItem[] {
  const items: SearchableItem[] = [];

  // Index all tools
  const tools = getAllTools();
  tools.forEach((tool) => {
    const category = getCategoryById(tool.categoryId);
    items.push({
      id: tool.id,
      type: 'tool',
      name: tool.name,
      nameLower: tool.name.toLowerCase(),
      description: tool.description,
      descriptionLower: tool.description.toLowerCase(),
      slug: tool.slug,
      categorySlug: tool.categoryId,
      categoryName: category?.name,
      keywords: tool.keywords,
      keywordsLower: tool.keywords.map((k) => k.toLowerCase()),
    });
  });

  // Index all categories
  const categories = getAllCategories();
  categories.forEach((category) => {
    items.push({
      id: category.id,
      type: 'category',
      name: category.name,
      nameLower: category.name.toLowerCase(),
      description: category.description,
      descriptionLower: category.description.toLowerCase(),
      slug: category.slug,
      icon: category.icon,
      keywords: [],
      keywordsLower: [],
    });
  });

  return items;
}

/**
 * Get or create the search index
 */
function getSearchIndex(): SearchableItem[] {
  if (!searchIndex) {
    searchIndex = buildSearchIndex();
  }
  return searchIndex;
}

/**
 * Calculate relevance score for a search item
 */
function calculateScore(item: SearchableItem, queryLower: string): number {
  let score = 0;
  const queryWords = queryLower.split(/\s+/).filter(Boolean);

  // Exact name match (highest priority)
  if (item.nameLower === queryLower) {
    score += 100;
  }
  // Name starts with query
  else if (item.nameLower.startsWith(queryLower)) {
    score += 80;
  }
  // Name contains query as whole word
  else if (item.nameLower.includes(` ${queryLower}`) || item.nameLower.includes(`${queryLower} `)) {
    score += 60;
  }
  // Name contains query
  else if (item.nameLower.includes(queryLower)) {
    score += 40;
  }

  // Keyword exact match
  if (item.keywordsLower.includes(queryLower)) {
    score += 50;
  }

  // Keyword partial match
  item.keywordsLower.forEach((keyword) => {
    if (keyword.includes(queryLower) || queryLower.includes(keyword)) {
      score += 20;
    }
  });

  // Description contains query
  if (item.descriptionLower.includes(queryLower)) {
    score += 10;
  }

  // Multi-word query matching
  if (queryWords.length > 1) {
    let wordMatches = 0;
    queryWords.forEach((word) => {
      if (
        item.nameLower.includes(word) ||
        item.keywordsLower.some((k) => k.includes(word)) ||
        item.descriptionLower.includes(word)
      ) {
        wordMatches++;
      }
    });
    // Bonus for matching multiple words
    if (wordMatches === queryWords.length) {
      score += 30;
    } else if (wordMatches > 0) {
      score += wordMatches * 5;
    }
  }

  // Category boost for tools
  if (item.type === 'tool' && item.categoryName) {
    if (item.categoryName.toLowerCase().includes(queryLower)) {
      score += 15;
    }
  }

  return score;
}

/**
 * Main search function
 */
export function search(
  query: string,
  options: SearchOptions = {}
): SearchResult[] {
  const { limit = 10, category, type = 'all', threshold = 1 } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase().trim();
  const index = getSearchIndex();

  // Filter and score items
  const results: SearchResult[] = [];

  for (const item of index) {
    // Filter by type
    if (type !== 'all' && item.type !== type) {
      continue;
    }

    // Filter by category (only for tools)
    if (category && item.type === 'tool' && item.categorySlug !== category) {
      continue;
    }

    // Calculate score
    const score = calculateScore(item, queryLower);

    // Skip items below threshold
    if (score < threshold) {
      continue;
    }

    results.push({
      id: item.id,
      type: item.type,
      name: item.name,
      description: item.description,
      slug: item.slug,
      categorySlug: item.categorySlug,
      categoryName: item.categoryName,
      icon: item.icon,
      score,
      keywords: item.keywords,
    });
  }

  // Sort by score (descending) and return top N
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/**
 * Search only tools
 */
export function searchTools(
  query: string,
  options: Omit<SearchOptions, 'type'> = {}
): SearchResult[] {
  return search(query, { ...options, type: 'tool' });
}

/**
 * Search only categories
 */
export function searchCategories(
  query: string,
  options: Omit<SearchOptions, 'type' | 'category'> = {}
): SearchResult[] {
  return search(query, { ...options, type: 'category' });
}

/**
 * Clear the search index (useful for testing)
 */
export function clearSearchIndex(): void {
  searchIndex = null;
}
