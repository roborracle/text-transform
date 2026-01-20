import { Metadata } from 'next';
import Link from 'next/link';
import { generateAboutPageGraphSchema, schemaToJsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Text Transform, the developer toolkit with 111+ free text and data transformation tools. Created by Robert David Orr. 100% client-side processing for complete privacy.',
  keywords: [
    'about text transform',
    'developer tools',
    'Robert David Orr',
    'text transformation',
    'data conversion tools',
    'free online tools',
  ],
  authors: [
    {
      name: 'Robert David Orr',
      url: 'https://robertdavidorr.com',
    },
  ],
  creator: 'Robert David Orr',
  openGraph: {
    title: 'About Text Transform - Developer Tools',
    description:
      'Learn about Text Transform, the developer toolkit with 111+ free text and data transformation tools. Created by Robert David Orr.',
    url: 'https://texttransform.dev/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Text Transform',
    description:
      '111+ free developer tools for text and data transformation. 100% client-side processing.',
    creator: '@roborracle',
  },
  alternates: {
    canonical: 'https://texttransform.dev/about',
  },
};

export default function AboutPage() {
  const schema = generateAboutPageGraphSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(schema) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-gray-900 dark:text-gray-100" aria-current="page">
                About
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Text Transform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            The developer toolkit with 111+ free text and data transformation tools.
            Built for developers, by developers.
          </p>
        </header>

        {/* Mission Section */}
        <section aria-labelledby="mission-heading" className="mb-12">
          <h2 id="mission-heading" className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Text Transform provides developers with instant, privacy-respecting tools for everyday
            text and data transformation tasks. Every tool runs entirely in your browser &mdash;
            your data never leaves your device.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Whether you need to convert naming conventions, encode data, format code, or generate
            test data, Text Transform has you covered with over 111 specialized tools across 8
            categories.
          </p>
        </section>

        {/* Features Section */}
        <section aria-labelledby="features-heading" className="mb-12">
          <h2 id="features-heading" className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              title="100% Client-Side"
              description="All transformations happen in your browser. Your data is never sent to any server, ensuring complete privacy and security."
              icon="shield"
            />
            <FeatureCard
              title="111+ Tools"
              description="From naming conventions to cryptographic hashes, encoding to code formatting &mdash; we have tools for every developer need."
              icon="tools"
            />
            <FeatureCard
              title="Instant Results"
              description="Real-time transformation as you type. No waiting, no page reloads, no friction in your workflow."
              icon="zap"
            />
            <FeatureCard
              title="Free Forever"
              description="All tools are completely free to use. No registration, no ads, no paywalls. Just developer tools that work."
              icon="gift"
            />
            <FeatureCard
              title="REST API"
              description="Integrate transformations into your workflow with our rate-limited REST API. Full OpenAPI documentation included."
              icon="api"
            />
            <FeatureCard
              title="CLI Tool"
              description="Use the txtx command-line tool for terminal-based transformations. Perfect for scripts and automation."
              icon="terminal"
            />
          </div>
        </section>

        {/* Tool Categories Section */}
        <section aria-labelledby="categories-heading" className="mb-12">
          <h2 id="categories-heading" className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Tool Categories
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <CategoryLink
              name="Naming Conventions"
              count={14}
              slug="naming-conventions"
              examples="camelCase, snake_case, PascalCase"
            />
            <CategoryLink
              name="Encoding/Decoding"
              count={16}
              slug="encoding"
              examples="Base64, URL, HTML entities"
            />
            <CategoryLink
              name="Cryptography"
              count={14}
              slug="crypto"
              examples="SHA-256, UUID, HMAC"
            />
            <CategoryLink
              name="Code Formatters"
              count={18}
              slug="formatters"
              examples="JSON, SQL, CSS, XML"
            />
            <CategoryLink
              name="Data Converters"
              count={10}
              slug="converters"
              examples="CSV to JSON, cURL to code"
            />
            <CategoryLink
              name="Color Utilities"
              count={12}
              slug="colors"
              examples="HEX, RGB, HSL"
            />
            <CategoryLink
              name="Random Generators"
              count={15}
              slug="generators"
              examples="Passwords, Lorem ipsum"
            />
            <CategoryLink
              name="Ciphers"
              count={12}
              slug="ciphers"
              examples="ROT13, Morse code"
            />
          </div>
        </section>

        {/* Creator Section */}
        <section aria-labelledby="creator-heading" className="mb-12">
          <h2 id="creator-heading" className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Created By
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Robert David Orr
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Director of Web Development
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Robert is a web developer and digital strategist based in Tallahassee, Florida.
                  He specializes in building developer tools, semantic SEO implementations, and
                  modern web applications. Robert is also the creator of{' '}
                  <a
                    href="https://casechangerpro.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Case Changer Pro
                  </a>
                  {' '}and{' '}
                  <a
                    href="https://colorcodeguide.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    ColorCodeGuide
                  </a>
                  .
                </p>
                <div className="flex flex-wrap gap-3">
                  <SocialLink href="https://robertdavidorr.com" label="Website" />
                  <SocialLink href="https://linkedin.com/in/robertdavidorr" label="LinkedIn" />
                  <SocialLink href="https://github.com/roborracle" label="GitHub" />
                  <SocialLink href="https://twitter.com/roborracle" label="Twitter" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section aria-labelledby="technology-heading" className="mb-12">
          <h2 id="technology-heading" className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Technology Stack
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <ul className="grid md:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">&#9679;</span>
                Next.js 15 with App Router
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">&#9679;</span>
                React 19
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">&#9679;</span>
                TypeScript (Strict Mode)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">&#9679;</span>
                Tailwind CSS 4
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">&#9679;</span>
                100% Client-Side Processing
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">&#9679;</span>
                Zero External Dependencies
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="mb-12">
          <h2 id="faq-heading" className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FAQItem
              question="Is Text Transform free to use?"
              answer="Yes, Text Transform is completely free to use. All 111+ tools are available without registration or payment."
            />
            <FAQItem
              question="Is my data secure when using Text Transform?"
              answer="Yes, all transformations happen client-side in your browser. Your data is never sent to any server, ensuring complete privacy."
            />
            <FAQItem
              question="Can I use Text Transform offline?"
              answer="The web application requires an internet connection to load, but once loaded, all transformations work without network access since they run entirely in your browser."
            />
            <FAQItem
              question="Is there an API for Text Transform?"
              answer="Yes, Text Transform provides a REST API with rate limiting (100 requests/minute). Documentation is available at /api/docs."
            />
            <FAQItem
              question="Is there a CLI tool available?"
              answer="Yes, you can install the CLI tool globally with 'npm install -g text-transform' and use the 'txtx' command for terminal-based transformations."
            />
          </div>
        </section>

        {/* Related Projects Section */}
        <section aria-labelledby="related-heading" className="mb-12">
          <h2 id="related-heading" className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Related Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://casechangerpro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">Case Changer Pro</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Writer-focused text transformation tools for titles, sentences, and professional formatting.
              </p>
            </a>
            <a
              href="https://colorcodeguide.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">ColorCodeGuide</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Color conversion and palette tools for designers and developers.
              </p>
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to Transform?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start using 111+ developer tools right now. No signup required.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Explore All Tools
          </Link>
        </section>
      </div>
    </>
  );
}

// Component: Feature Card
function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  const iconMap: Record<string, string> = {
    shield: '🛡️',
    tools: '🛠️',
    zap: '⚡',
    gift: '🎁',
    api: '🔌',
    terminal: '💻',
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-2xl mb-2">{iconMap[icon] || '✨'}</div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

// Component: Category Link
function CategoryLink({
  name,
  count,
  slug,
  examples,
}: {
  name: string;
  count: number;
  slug: string;
  examples: string;
}) {
  return (
    <Link
      href={`/tools/${slug}`}
      className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
          {count} tools
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{examples}</p>
    </Link>
  );
}

// Component: Social Link
function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {label}
    </a>
  );
}

// Component: FAQ Item
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-gray-50 dark:bg-gray-800 rounded-lg">
      <summary className="flex justify-between items-center cursor-pointer p-4 font-medium text-gray-900 dark:text-white">
        {question}
        <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform">
          &#9660;
        </span>
      </summary>
      <p className="px-4 pb-4 text-gray-700 dark:text-gray-300">{answer}</p>
    </details>
  );
}
