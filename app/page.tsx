import Link from 'next/link';
import {
  getAllCategoriesWithCounts,
  getPopularTools,
  getToolCount,
  getCategoryBySlug,
} from '@/lib/tools';

/**
 * Category card component
 */
function CategoryCard({
  name,
  description,
  icon,
  slug,
  toolCount,
}: {
  name: string;
  description: string;
  icon: string;
  slug: string;
  toolCount: number;
}) {
  return (
    <Link
      href={`/tools/${slug}`}
      className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            {toolCount} tools
          </p>
        </div>
      </div>
    </Link>
  );
}

/**
 * Tool card component for popular tools
 */
function ToolCard({
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
      className="group block p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {name}
      </h4>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {description}
      </p>
    </Link>
  );
}

/**
 * Homepage
 */
export default function Home() {
  const categories = getAllCategoriesWithCounts();
  const popularTools = getPopularTools();
  const totalToolCount = getToolCount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Developer Text Tools
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          {totalToolCount}+ free online tools for text and data transformation.
          Base64, JSON, hashing, encoding, formatting, and more.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            100% Client-side
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Instant Results
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Free Forever
          </span>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              description={category.description}
              icon={category.icon}
              slug={category.slug}
              toolCount={category.toolCount}
            />
          ))}
        </div>
      </section>

      {/* Popular Tools */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Popular Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => {
            const category = getCategoryBySlug(
              categories.find((c) => c.id === tool.categoryId)?.slug || ''
            );
            return (
              <ToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                categorySlug={category?.slug || tool.categoryId}
                toolSlug={tool.slug}
              />
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Why Text Transform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Privacy First
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All transformations happen in your browser. Your data never leaves
              your device.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Lightning Fast
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Instant results as you type. No waiting for server responses.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              No Dependencies
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pure TypeScript implementations. No external services required.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Transform?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Pick a category above or browse all {totalToolCount}+ tools.
        </p>
        <Link
          href="/tools/encoding"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Get Started
          <svg
            className="w-4 h-4"
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
        </Link>
      </section>
    </div>
  );
}
