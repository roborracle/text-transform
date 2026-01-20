import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider, themeScript } from '@/contexts';
import { Header, Footer } from '@/components/layout';
import { SearchProvider } from '@/components/search';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Text Transform - Developer Tools',
    template: '%s | Text Transform',
  },
  description:
    '111+ free online developer tools for text and data transformation. Base64, JSON, hashing, encoding, formatting, and more. 100% client-side processing.',
  keywords: [
    'text transform',
    'developer tools',
    'base64',
    'json formatter',
    'hash generator',
    'encoding',
    'decoding',
    'online tools',
  ],
  authors: [{ name: 'Text Transform' }],
  creator: 'Text Transform',
  metadataBase: new URL('https://texttransform.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Text Transform',
    title: 'Text Transform - Developer Tools',
    description:
      '111+ free online developer tools for text and data transformation. 100% client-side processing.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Transform - Developer Tools',
    description:
      '111+ free online developer tools for text and data transformation.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>
          <SearchProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
