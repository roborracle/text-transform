import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout';
import {
  getAllToolSlugs,
  getTool,
  getCategoryBySlug,
  getRelatedTools,
} from '@/lib/tools';

interface ToolPageProps {
  params: Promise<{
    category: string;
    tool: string;
  }>;
}

/**
 * Generate static params for all tools
 */
export async function generateStaticParams() {
  const toolSlugs = getAllToolSlugs();
  return toolSlugs.map(({ category, tool }) => ({
    category,
    tool,
  }));
}

/**
 * Generate metadata for the tool page
 */
export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { category: categorySlug, tool: toolSlug } = await params;
  const tool = getTool(categorySlug, toolSlug);
  const category = getCategoryBySlug(categorySlug);

  if (!tool || !category) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: tool.name,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | Text Transform`,
      description: tool.description,
    },
    keywords: tool.keywords,
  };
}

/**
 * Related tool card component
 */
function RelatedToolCard({
  name,
  categorySlug,
  toolSlug,
}: {
  name: string;
  categorySlug: string;
  toolSlug: string;
}) {
  return (
    <Link
      href={`/tools/${categorySlug}/${toolSlug}`}
      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
    >
      {name}
    </Link>
  );
}

/**
 * Tool page - displays the tool interface
 */
export default async function ToolPage({ params }: ToolPageProps) {
  const { category: categorySlug, tool: toolSlug } = await params;
  const tool = getTool(categorySlug, toolSlug);
  const category = getCategoryBySlug(categorySlug);

  if (!tool || !category) {
    notFound();
  }

  const relatedTools = getRelatedTools(tool.id, 5);

  return (
    <div className="flex">
      <Sidebar activeCategory={categorySlug} activeTool={toolSlug} />

      <div className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href={`/tools/${categorySlug}`}
                  className="hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {category.name}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 dark:text-white">{tool.name}</li>
            </ol>
          </nav>

          {/* Tool Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {tool.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {tool.description}
            </p>
          </div>

          {/* Tool Interface Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Area */}
              <div>
                <label
                  htmlFor="input"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Input
                </label>
                <textarea
                  id="input"
                  className="w-full h-48 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={tool.inputPlaceholder || 'Enter text to transform...'}
                />
              </div>

              {/* Output Area */}
              <div>
                <label
                  htmlFor="output"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Output
                </label>
                <textarea
                  id="output"
                  readOnly
                  className="w-full h-48 px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  placeholder={tool.outputPlaceholder || 'Transformed output will appear here...'}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Copy Output
                </button>
              </div>
              {tool.reverseFn && (
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  Reverse
                </button>
              )}
            </div>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Related Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedTools.map((relatedTool) => (
                  <RelatedToolCard
                    key={relatedTool.id}
                    name={relatedTool.name}
                    categorySlug={categorySlug}
                    toolSlug={relatedTool.slug}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
