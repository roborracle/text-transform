import Link from 'next/link';
import { getAllCategoriesWithCounts } from '@/lib/tools';

/**
 * 404 Not Found page
 */
export default function NotFound() {
  const categories = getAllCategoriesWithCounts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Browse Categories */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Or browse our tool categories
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/tools/${category.slug}`}
              className="group block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-center transition-all"
            >
              <span className="text-2xl block mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.name}
              </span>
              <span className="text-xs text-gray-400 block mt-1">
                {category.toolCount} tools
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
