import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout';
import { ToolPageClient } from '@/components/tools';
import {
  getAllToolSlugs,
  getTool,
  getCategoryBySlug,
  getRelatedTools,
} from '@/lib/tools';
import type { Tool, Category } from '@/lib/tools';

const BASE_URL = 'https://texttransform.dev';

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
 * JSON-LD structured data for tool page
 */
function ToolJsonLd({
  tool,
  category,
  categorySlug,
}: {
  tool: Tool;
  category: Category;
  categorySlug: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${BASE_URL}/tools/${categorySlug}/${tool.slug}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isPartOf: {
      '@type': 'WebApplication',
      name: 'Text Transform',
      url: BASE_URL,
      applicationCategory: 'DeveloperApplication',
    },
    keywords: tool.keywords.join(', '),
    category: category.name,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.name,
        item: `${BASE_URL}/tools/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `${BASE_URL}/tools/${categorySlug}/${tool.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
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
    <>
      <ToolJsonLd tool={tool} category={category} categorySlug={categorySlug} />
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

            {/* Tool Interface */}
            <div className="mb-8">
              <ToolPageClient tool={tool} />
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
    </>
  );
}
