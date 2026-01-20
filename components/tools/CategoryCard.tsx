'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { Card } from '@/components/ui';

/**
 * CategoryCard component props
 */
export interface CategoryCardProps {
  /** Category name */
  name: string;
  /** Category description */
  description: string;
  /** Link to category page */
  href: string;
  /** Number of tools in category */
  toolCount: number;
  /** Category icon */
  icon: ReactNode;
}

/**
 * Card component for displaying tool categories on the homepage
 */
export function CategoryCard({
  name,
  description,
  href,
  toolCount,
  icon,
}: CategoryCardProps) {
  return (
    <Link href={href} className="block group">
      <Card
        variant="bordered"
        padding="lg"
        interactive
        className="h-full"
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors mb-4">
            {icon}
          </div>

          {/* Category name */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {description}
          </p>

          {/* Tool count */}
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
            {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default CategoryCard;
