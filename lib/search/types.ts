/**
 * Search Types
 */

export interface SearchResult {
  id: string;
  type: 'tool' | 'category';
  name: string;
  description: string;
  slug: string;
  categorySlug?: string;
  categoryName?: string;
  icon?: string;
  score: number;
  keywords?: string[];
}

export interface SearchOptions {
  limit?: number;
  category?: string;
  type?: 'tool' | 'category' | 'all';
  threshold?: number;
}

export interface SearchableItem {
  id: string;
  type: 'tool' | 'category';
  name: string;
  nameLower: string;
  description: string;
  descriptionLower: string;
  slug: string;
  categorySlug?: string;
  categoryName?: string;
  icon?: string;
  keywords: string[];
  keywordsLower: string[];
}
