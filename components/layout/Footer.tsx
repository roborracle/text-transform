'use client';

import Link from 'next/link';
import { getAllCategories, getToolCount } from '@/lib/tools';

/**
 * Site footer with links and attribution
 */
export function Footer() {
  const categories = getAllCategories();
  const toolCount = getToolCount();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white"
            >
              <span className="text-2xl">{'{T}'}</span>
              <span>Text Transform</span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {toolCount}+ free developer tools for text and data transformation.
              All processing happens in your browser - your data never leaves your device.
            </p>
          </div>

          {/* Categories */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/tools/${category.slug}`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Related Sites */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Related Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://casechangerpro.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  CaseChangerPro.com
                </a>
                <span className="block text-xs text-gray-400 dark:text-gray-500">
                  Writer text tools
                </span>
              </li>
              <li>
                <a
                  href="https://colorcodeguide.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  ColorCodeGuide.com
                </a>
                <span className="block text-xs text-gray-400 dark:text-gray-500">
                  Color conversion tools
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Text Transform. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              100% client-side processing
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              No data stored
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
