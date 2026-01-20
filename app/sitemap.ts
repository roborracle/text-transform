import { MetadataRoute } from 'next';
import { getAllCategories, getAllToolSlugs } from '@/lib/tools';

const BASE_URL = 'https://texttransform.dev';

/**
 * Generate dynamic sitemap for all pages
 * Includes homepage, category pages, and all tool pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getAllCategories();
  const toolSlugs = getAllToolSlugs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/tools/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = toolSlugs.map(({ category, tool }) => ({
    url: `${BASE_URL}/tools/${category}/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
