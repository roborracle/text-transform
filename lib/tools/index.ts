/**
 * Tools Module
 * Central export for tool registry, categories, and types
 */

// Types
export type {
  Tool,
  ToolOption,
  ToolOptionType,
  SelectOption,
  ToolWithCategory,
  Category,
  CategoryIcon,
  CategoryWithCount,
} from './types';

// Categories
export {
  CATEGORIES,
  getCategoryById,
  getCategoryBySlug,
  getAllCategorySlugs,
} from './categories';

// Registry
export {
  ALL_TOOLS,
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
} from './registry';

// Tool definitions (for direct access if needed)
export { BATCH1_TOOLS } from './definitions/batch1';
export { BATCH2_TOOLS } from './definitions/batch2';

// Function registry
export {
  FUNCTION_REGISTRY,
  getTransformFunction,
  hasTransformFunction,
  type TransformFunction,
} from './function-registry';
