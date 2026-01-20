'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle, Logo } from '@/components/ui';
import { getAllCategoriesWithCounts } from '@/lib/tools';

/**
 * Menu icon for mobile
 */
function MenuIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

/**
 * Close icon for mobile menu
 */
function CloseIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

/**
 * Chevron icon for dropdown
 */
function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

/**
 * Site header with navigation
 */
export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const categories = getAllCategoriesWithCounts();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isCategoriesOpen) setIsCategoriesOpen(false);
  }, [isCategoriesOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsCategoriesOpen(false);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isCategoryActive = pathname?.startsWith('/tools');

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <Logo size={36} />
            <span className="hidden sm:inline">Text Transform</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 200)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isCategoryActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Tools
                <ChevronIcon isOpen={isCategoriesOpen} />
              </button>

              {/* Dropdown Menu */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/tools/${category.slug}`}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{category.icon}</span>
                        <span>{category.name}</span>
                      </span>
                      <span className="text-xs text-gray-400">{category.toolCount}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right side: Theme toggle + Mobile menu button */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <nav className="px-4 py-4 space-y-2">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive('/')
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            {/* Categories in mobile */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Categories
              </p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/tools/${category.slug}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    pathname === `/tools/${category.slug}`
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </span>
                  <span className="text-xs text-gray-400">{category.toolCount}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
