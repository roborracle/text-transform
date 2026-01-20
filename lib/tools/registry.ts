/**
 * Tool Registry
 * Central registry for all tools with helper functions
 */

import type { Tool, Category, ToolWithCategory, CategoryWithCount } from './types';
import { CATEGORIES, getCategoryById, getCategoryBySlug } from './categories';
import { BATCH1_TOOLS } from './definitions/batch1';
import { BATCH2_TOOLS } from './definitions/batch2';

/**
 * All tools combined from both batches
 */
export const ALL_TOOLS: Tool[] = [...BATCH1_TOOLS, ...BATCH2_TOOLS];

/**
 * Tool lookup map by ID for O(1) access
 */
const TOOL_BY_ID = new Map<string, Tool>(
  ALL_TOOLS.map((tool) => [tool.id, tool])
);

/**
 * Tool lookup map by slug for O(1) access
 */
const TOOL_BY_SLUG = new Map<string, Tool>(
  ALL_TOOLS.map((tool) => [tool.slug, tool])
);

/**
 * Tools grouped by category ID
 */
const TOOLS_BY_CATEGORY = new Map<string, Tool[]>();
for (const tool of ALL_TOOLS) {
  const existing = TOOLS_BY_CATEGORY.get(tool.categoryId) || [];
  existing.push(tool);
  TOOLS_BY_CATEGORY.set(tool.categoryId, existing);
}

/**
 * Get a tool by its ID
 */
export function getToolById(id: string): Tool | undefined {
  return TOOL_BY_ID.get(id);
}

/**
 * Get a tool by its slug
 */
export function getToolBySlug(slug: string): Tool | undefined {
  return TOOL_BY_SLUG.get(slug);
}

/**
 * Get a tool by category slug and tool slug
 */
export function getTool(categorySlug: string, toolSlug: string): Tool | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;

  const tool = getToolBySlug(toolSlug);
  if (!tool || tool.categoryId !== category.id) return undefined;

  return tool;
}

/**
 * Get a tool with its category resolved
 */
export function getToolWithCategory(toolId: string): ToolWithCategory | undefined {
  const tool = getToolById(toolId);
  if (!tool) return undefined;

  const category = getCategoryById(tool.categoryId);
  if (!category) return undefined;

  return { ...tool, category };
}

/**
 * Get all tools in a category by category ID
 */
export function getToolsByCategory(categoryId: string): Tool[] {
  return TOOLS_BY_CATEGORY.get(categoryId) || [];
}

/**
 * Get all tools in a category by category slug
 */
export function getToolsByCategorySlug(categorySlug: string): Tool[] {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return getToolsByCategory(category.id);
}

/**
 * Get all tools
 */
export function getAllTools(): Tool[] {
  return ALL_TOOLS;
}

/**
 * Get all categories
 */
export function getAllCategories(): Category[] {
  return CATEGORIES;
}

/**
 * Get all categories with tool counts
 */
export function getAllCategoriesWithCounts(): CategoryWithCount[] {
  return CATEGORIES.map((category) => ({
    ...category,
    toolCount: getCategoryToolCount(category.id),
  }));
}

/**
 * Get total tool count
 */
export function getToolCount(): number {
  return ALL_TOOLS.length;
}

/**
 * Get tool count for a specific category
 */
export function getCategoryToolCount(categoryId: string): number {
  return TOOLS_BY_CATEGORY.get(categoryId)?.length || 0;
}

/**
 * Search tools by keyword
 */
export function searchTools(query: string): Tool[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const terms = normalizedQuery.split(/\s+/);

  return ALL_TOOLS.filter((tool) => {
    const searchableText = [
      tool.name,
      tool.description,
      ...tool.keywords,
    ]
      .join(' ')
      .toLowerCase();

    return terms.every((term) => searchableText.includes(term));
  });
}

/**
 * Get all tool slugs for static generation
 */
export function getAllToolSlugs(): Array<{ category: string; tool: string }> {
  return ALL_TOOLS.map((tool) => {
    const category = getCategoryById(tool.categoryId);
    return {
      category: category?.slug || tool.categoryId,
      tool: tool.slug,
    };
  });
}

/**
 * Get related tools (same category, excluding current)
 */
export function getRelatedTools(toolId: string, limit: number = 5): Tool[] {
  const tool = getToolById(toolId);
  if (!tool) return [];

  const categoryTools = getToolsByCategory(tool.categoryId);
  return categoryTools
    .filter((t) => t.id !== toolId)
    .slice(0, limit);
}

/**
 * Get popular tools (hardcoded selection of commonly used tools)
 */
export function getPopularTools(): Tool[] {
  const popularIds = [
    'base64-encode',
    'json-to-yaml',
    'to-camel-case',
    'sha256-hash',
    'generate-password',
    'hex-to-rgb',
    'format-json',
    'rot13',
  ];

  return popularIds
    .map((id) => getToolById(id))
    .filter((tool): tool is Tool => tool !== undefined);
}
