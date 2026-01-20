import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout';
import {
  getAllCategories,
  getCategoryBySlug,
  getToolsByCategorySlug,
} from '@/lib/tools';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

/**
 * Generate static params for all categories
 */
export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.slug,
  }));
}

/**
 * Generate metadata for the category page
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: category.name,
    description: `${category.description} Browse all ${category.name.toLowerCase()} tools.`,
    openGraph: {
      title: `${category.name} | Text Transform`,
      description: category.description,
    },
  };
}

/**
 * Tool list item component
 */
function ToolListItem({
  name,
  description,
  categorySlug,
  toolSlug,
}: {
  name: string;
  description: string;
  categorySlug: string;
  toolSlug: string;
}) {
  return (
    <Link
      href={`/tools/${categorySlug}/${toolSlug}`}
      className="group block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
    >
      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {name}
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {description}
      </p>
    </Link>
  );
}

/**
 * Category page - displays all tools in a category
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategorySlug(categorySlug);

  return (
    <div className="flex">
      <Sidebar activeCategory={categorySlug} />

      <div className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{category.icon}</span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              {tools.length} tools available
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <ToolListItem
                key={tool.id}
                name={tool.name}
                description={tool.description}
                categorySlug={categorySlug}
                toolSlug={tool.slug}
              />
            ))}
          </div>

          {/* No tools message */}
          {tools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No tools available in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
