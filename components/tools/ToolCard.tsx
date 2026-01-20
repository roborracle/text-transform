'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';
import { Card, Badge } from '@/components/ui';

/**
 * ToolCard component props
 */
export interface ToolCardProps {
  /** Tool name */
  name: string;
  /** Tool description */
  description: string;
  /** Link to tool page */
  href: string;
  /** Category name for badge */
  category: string;
  /** Optional icon */
  icon?: ReactNode;
}

/**
 * Card component for displaying tool previews in category listings
 */
export function ToolCard({
  name,
  description,
  href,
  category,
  icon,
}: ToolCardProps) {
  return (
    <Link href={href} className="block group">
      <Card
        variant="bordered"
        padding="md"
        interactive
        className="h-full"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              {icon}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {name}
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
            <div className="mt-2">
              <Badge variant="default" size="sm">
                {category}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default ToolCard;
