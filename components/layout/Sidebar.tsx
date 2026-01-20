'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAllCategoriesWithCounts, getToolsByCategory } from '@/lib/tools';
import type { CategoryWithCount } from '@/lib/tools';

/**
 * Chevron icon for expandable sections
 */
function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

/**
 * Sidebar props
 */
export interface SidebarProps {
  /** Currently active category slug */
  activeCategory?: string;
  /** Currently active tool slug */
  activeTool?: string;
  /** Whether to show on mobile */
  showOnMobile?: boolean;
  /** Callback when link is clicked (for mobile close) */
  onNavigate?: () => void;
}

/**
 * Category item with expandable tool list
 */
function CategoryItem({
  category,
  isActive,
  isExpanded,
  onToggle,
  activeTool,
  onNavigate,
}: {
  category: CategoryWithCount;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  activeTool?: string;
  onNavigate?: () => void;
}) {
  const tools = getToolsByCategory(category.id);

  return (
    <div className="mb-1">
      <div className="flex items-center">
        <button
          onClick={onToggle}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category.name}`}
        >
          <ChevronIcon isOpen={isExpanded} />
        </button>
        <Link
          href={`/tools/${category.slug}`}
          onClick={onNavigate}
          className={`flex-1 flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
            isActive
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-sm">{category.icon}</span>
            <span>{category.name}</span>
          </span>
          <span className="text-xs text-gray-400">{category.toolCount}</span>
        </Link>
      </div>

      {/* Tool list */}
      {isExpanded && (
        <div className="ml-6 mt-1 space-y-0.5">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${category.slug}/${tool.slug}`}
              onClick={onNavigate}
              className={`block px-2 py-1 rounded-md text-sm transition-colors ${
                activeTool === tool.slug
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tool.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Sidebar navigation for tool pages
 */
export function Sidebar({
  activeCategory,
  activeTool,
  showOnMobile = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const categories = getAllCategoriesWithCounts();

  // Initialize expanded state based on active category
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(activeCategory ? [activeCategory] : [])
  );

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const isCategoryActive = (categorySlug: string) => {
    return pathname === `/tools/${categorySlug}` || activeCategory === categorySlug;
  };

  return (
    <aside
      className={`
        w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        ${showOnMobile ? 'block' : 'hidden lg:block'}
      `}
    >
      <div className="sticky top-20 p-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Categories
        </h2>

        <nav className="space-y-0.5">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isActive={isCategoryActive(category.slug)}
              isExpanded={expandedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
              activeTool={activeCategory === category.slug ? activeTool : undefined}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
