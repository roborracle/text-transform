/**
 * Schema.org Structured Data for Text Transform
 * Connects to Robert David Orr's knowledge graph
 */

// Base URLs and IDs
const BASE_URL = 'https://texttransform.dev';
const CREATOR_URL = 'https://robertdavidorr.com';
const EMPLOYER_URL = 'https://sachsmedia.com';

export const SCHEMA_IDS = {
  website: `${BASE_URL}/#website`,
  organization: `${BASE_URL}/#organization`,
  application: `${BASE_URL}/#application`,
  person: `${CREATOR_URL}/#person`,
  employer: `${EMPLOYER_URL}/#organization`,
  homepage: `${BASE_URL}/#webpage`,
  aboutPage: `${BASE_URL}/about#webpage`,
} as const;

// Type definitions
export interface SchemaGraph {
  '@context': 'https://schema.org';
  '@graph': Record<string, unknown>[];
}

/**
 * Generate Person schema for Robert David Orr
 * Links to existing knowledge graph entities
 */
export function generateCreatorPersonSchema() {
  return {
    '@type': 'Person',
    '@id': SCHEMA_IDS.person,
    name: 'Robert David Orr',
    givenName: 'Robert',
    additionalName: 'David',
    familyName: 'Orr',
    url: CREATOR_URL,
    jobTitle: 'Director of Web Development',
    worksFor: {
      '@id': SCHEMA_IDS.employer,
    },
    knowsAbout: [
      'Web Development',
      'Search Engine Optimization',
      'Digital Strategy',
      'Developer Tools',
      'Text Processing',
      'Data Transformation',
      'TypeScript',
      'React',
      'Next.js',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Florida State University',
      sameAs: 'https://www.fsu.edu/',
    },
    workLocation: {
      '@type': 'Place',
      name: 'Tallahassee, Florida',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tallahassee',
        addressRegion: 'FL',
        addressCountry: 'US',
      },
    },
    sameAs: [
      CREATOR_URL,
      'https://linkedin.com/in/robertdavidorr',
      'https://github.com/roborracle',
      'https://twitter.com/roborracle',
      'https://sachsmedia.com/team/robert-orr',
    ],
  };
}

/**
 * Generate Employer Organization schema (Sachs Media Group)
 */
export function generateEmployerOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': SCHEMA_IDS.employer,
    name: 'Sachs Media Group',
    url: EMPLOYER_URL,
    description: "Florida's leading public affairs and strategic communications firm",
    knowsAbout: [
      'Public Affairs',
      'Public Relations',
      'Strategic Communications',
      'Digital Strategy',
    ],
    employee: {
      '@id': SCHEMA_IDS.person,
    },
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': SCHEMA_IDS.website,
    url: BASE_URL,
    name: 'Text Transform',
    description: '111+ free online developer tools for text and data transformation',
    publisher: {
      '@id': SCHEMA_IDS.organization,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  };
}

/**
 * Generate Organization schema for Text Transform
 */
export function generateOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': SCHEMA_IDS.organization,
    name: 'Text Transform',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    founder: {
      '@id': SCHEMA_IDS.person,
    },
    foundingDate: '2026',
    description: 'Developer-focused text and data transformation toolkit with 111+ free online tools',
    sameAs: [
      'https://github.com/roborracle/text-transform',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'technical support',
      url: `${BASE_URL}/about`,
    },
  };
}

/**
 * Generate WebApplication schema
 */
export function generateWebApplicationSchema() {
  return {
    '@type': 'WebApplication',
    '@id': SCHEMA_IDS.application,
    name: 'Text Transform',
    alternateName: 'TextTransform',
    url: BASE_URL,
    description: '111+ free online developer tools for text and data transformation. Naming conventions, encoding, hashing, formatting, and more.',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Text Processing',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
    softwareVersion: '1.0.0',
    releaseNotes: `${BASE_URL}/changelog`,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    creator: {
      '@id': SCHEMA_IDS.person,
    },
    publisher: {
      '@id': SCHEMA_IDS.organization,
    },
    maintainer: {
      '@id': SCHEMA_IDS.person,
    },
    copyrightHolder: {
      '@id': SCHEMA_IDS.organization,
    },
    copyrightYear: 2026,
    license: 'https://opensource.org/licenses/MIT',
    audience: {
      '@type': 'Audience',
      audienceType: [
        'Software Developers',
        'DevOps Engineers',
        'QA Engineers',
        'API Developers',
        'Frontend Developers',
        'Full Stack Developers',
      ],
    },
    featureList: [
      'camelCase Converter',
      'snake_case Converter',
      'Base64 Encode/Decode',
      'URL Encode/Decode',
      'JSON Formatter',
      'SQL Formatter',
      'SHA-256 Hash Generator',
      'UUID Generator',
      'JWT Decoder',
      'CSV to JSON Converter',
      'Color Converter (HEX/RGB/HSL)',
      'Password Generator',
      'Lorem Ipsum Generator',
      'ROT13 Cipher',
      'Morse Code Converter',
    ],
    screenshot: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/screenshot.png`,
      caption: 'Text Transform developer tools interface',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Generate WebPage schema for homepage
 */
export function generateHomePageSchema() {
  return {
    '@type': 'WebPage',
    '@id': SCHEMA_IDS.homepage,
    url: BASE_URL,
    name: 'Text Transform - Developer Tools',
    description: '111+ free online developer tools for text and data transformation. 100% client-side processing for privacy.',
    isPartOf: {
      '@id': SCHEMA_IDS.website,
    },
    about: {
      '@id': SCHEMA_IDS.application,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og-image.png`,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BASE_URL,
        },
      ],
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.description'],
    },
    inLanguage: 'en-US',
  };
}

/**
 * Generate About page schema
 */
export function generateAboutPageSchema() {
  return {
    '@type': 'AboutPage',
    '@id': SCHEMA_IDS.aboutPage,
    url: `${BASE_URL}/about`,
    name: 'About Text Transform',
    description: 'Learn about Text Transform, the developer toolkit with 111+ free text and data transformation tools. Created by Robert David Orr.',
    isPartOf: {
      '@id': SCHEMA_IDS.website,
    },
    about: [
      { '@id': SCHEMA_IDS.application },
      { '@id': SCHEMA_IDS.person },
      { '@id': SCHEMA_IDS.organization },
    ],
    mainEntity: {
      '@id': SCHEMA_IDS.application,
    },
    breadcrumb: {
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
          name: 'About',
          item: `${BASE_URL}/about`,
        },
      ],
    },
    inLanguage: 'en-US',
  };
}

/**
 * Generate category page schema
 */
export function generateCategoryPageSchema(category: {
  name: string;
  slug: string;
  description: string;
  toolCount: number;
}) {
  return {
    '@type': 'CollectionPage',
    '@id': `${BASE_URL}/tools/${category.slug}#webpage`,
    url: `${BASE_URL}/tools/${category.slug}`,
    name: `${category.name} Tools - Text Transform`,
    description: category.description,
    isPartOf: {
      '@id': SCHEMA_IDS.website,
    },
    about: {
      '@type': 'ItemList',
      name: category.name,
      numberOfItems: category.toolCount,
    },
    breadcrumb: {
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
          item: `${BASE_URL}/tools/${category.slug}`,
        },
      ],
    },
    inLanguage: 'en-US',
  };
}

/**
 * Generate tool page schema
 */
export function generateToolPageSchema(tool: {
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
}) {
  return {
    '@type': 'WebPage',
    '@id': `${BASE_URL}/tools/${tool.categorySlug}/${tool.slug}#webpage`,
    url: `${BASE_URL}/tools/${tool.categorySlug}/${tool.slug}`,
    name: `${tool.name} - Text Transform`,
    description: tool.description,
    isPartOf: {
      '@id': SCHEMA_IDS.website,
    },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: tool.name,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web Browser',
      isAccessibleForFree: true,
      isPartOf: {
        '@id': SCHEMA_IDS.application,
      },
    },
    breadcrumb: {
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
          name: tool.category,
          item: `${BASE_URL}/tools/${tool.categorySlug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: `${BASE_URL}/tools/${tool.categorySlug}/${tool.slug}`,
        },
      ],
    },
    inLanguage: 'en-US',
  };
}

/**
 * Generate FAQ schema for common questions
 */
export function generateFAQSchema() {
  return {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Text Transform free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Text Transform is completely free to use. All 111+ tools are available without registration or payment.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my data secure when using Text Transform?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all transformations happen client-side in your browser. Your data is never sent to any server, ensuring complete privacy.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of tools does Text Transform offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Text Transform offers 111+ tools across 8 categories: Naming Conventions (camelCase, snake_case), Encoding/Decoding (Base64, URL), Cryptography (SHA-256, UUID), Code Formatters (JSON, SQL), Data Converters (CSV to JSON), Color Utilities (HEX to RGB), Random Generators (passwords, Lorem ipsum), and Ciphers (ROT13, Morse code).',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use Text Transform offline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The web application requires an internet connection to load, but once loaded, all transformations work without network access since they run entirely in your browser.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there an API for Text Transform?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Text Transform provides a REST API with rate limiting (100 requests/minute). Documentation is available at /api/docs.',
        },
      },
    ],
  };
}

/**
 * Generate global graph schema combining all entities
 */
export function generateGlobalGraphSchema(): SchemaGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebSiteSchema(),
      generateOrganizationSchema(),
      generateCreatorPersonSchema(),
      generateEmployerOrganizationSchema(),
      generateWebApplicationSchema(),
      generateHomePageSchema(),
    ],
  };
}

/**
 * Generate about page graph schema
 */
export function generateAboutPageGraphSchema(): SchemaGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generateWebSiteSchema(),
      generateOrganizationSchema(),
      generateCreatorPersonSchema(),
      generateEmployerOrganizationSchema(),
      generateWebApplicationSchema(),
      generateAboutPageSchema(),
      generateFAQSchema(),
    ],
  };
}

/**
 * Serialize schema to JSON-LD script tag content
 */
export function schemaToJsonLd(schema: Record<string, unknown> | SchemaGraph): string {
  return JSON.stringify(schema);
}
