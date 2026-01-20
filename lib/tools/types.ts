/**
 * Tool & Category Type Definitions
 * Core types for the tool registry system
 */

/**
 * Category icon identifier - can be an emoji or icon name
 */
export type CategoryIcon = string;

/**
 * Category definition
 */
export interface Category {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** SEO-friendly description */
  description: string;
  /** Icon identifier (emoji or icon name) */
  icon: CategoryIcon;
  /** URL-safe slug */
  slug: string;
}

/**
 * Option types for configurable tools
 */
export type ToolOptionType = 'text' | 'number' | 'select' | 'checkbox';

/**
 * Select option for dropdown inputs
 */
export interface SelectOption {
  /** Display label */
  label: string;
  /** Value to use */
  value: string;
}

/**
 * Tool option configuration
 */
export interface ToolOption {
  /** Unique key for this option */
  key: string;
  /** Display label */
  label: string;
  /** Input type */
  type: ToolOptionType;
  /** Default value */
  defaultValue?: string | number | boolean;
  /** Options for select type */
  options?: SelectOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Min value for number type */
  min?: number;
  /** Max value for number type */
  max?: number;
}

/**
 * Tool definition
 */
export interface Tool {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Brief description of what the tool does */
  description: string;
  /** Parent category ID */
  categoryId: string;
  /** URL-safe slug */
  slug: string;
  /** Name of the transformation function in lib/transformations */
  transformFn: string;
  /** Whether the transformation function is async */
  isAsync?: boolean;
  /** Whether this is a generator (no input needed) */
  isGenerator?: boolean;
  /** Configurable options */
  options?: ToolOption[];
  /** Search keywords */
  keywords: string[];
  /** Reverse function name (for encode/decode pairs) */
  reverseFn?: string;
  /** Input placeholder text */
  inputPlaceholder?: string;
  /** Output placeholder text */
  outputPlaceholder?: string;
}

/**
 * Tool with resolved category
 */
export interface ToolWithCategory extends Tool {
  category: Category;
}

/**
 * Category with tool count
 */
export interface CategoryWithCount extends Category {
  toolCount: number;
}
