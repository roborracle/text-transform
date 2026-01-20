/**
 * Sidebar component tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '@/components/layout/Sidebar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/tools'),
}));

// Mock tools library
const mockCategories = [
  {
    id: 'encoding',
    name: 'Encoding',
    slug: 'encoding',
    icon: '{ }',
    description: 'Encoding tools',
    toolCount: 2,
  },
  {
    id: 'crypto',
    name: 'Crypto',
    slug: 'crypto',
    icon: '#',
    description: 'Crypto tools',
    toolCount: 2,
  },
];

const mockToolsEncoding = [
  { id: 'base64-encode', name: 'Base64 Encode', slug: 'base64-encode' },
  { id: 'base64-decode', name: 'Base64 Decode', slug: 'base64-decode' },
];

const mockToolsCrypto = [
  { id: 'md5-hash', name: 'MD5 Hash', slug: 'md5-hash' },
  { id: 'sha256-hash', name: 'SHA-256 Hash', slug: 'sha256-hash' },
];

jest.mock('@/lib/tools', () => ({
  getAllCategoriesWithCounts: () => mockCategories,
  getToolsByCategory: (categoryId: string) => {
    if (categoryId === 'encoding') return mockToolsEncoding;
    if (categoryId === 'crypto') return mockToolsCrypto;
    return [];
  },
}));

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the sidebar element', () => {
      render(<Sidebar />);
      expect(screen.getByRole('complementary')).toBeInTheDocument();
    });

    it('renders Categories heading', () => {
      render(<Sidebar />);
      expect(screen.getByText(/categories/i)).toBeInTheDocument();
    });

    it('renders all categories', () => {
      render(<Sidebar />);
      expect(screen.getByText('Encoding')).toBeInTheDocument();
      expect(screen.getByText('Crypto')).toBeInTheDocument();
    });

    it('renders category icons', () => {
      render(<Sidebar />);
      expect(screen.getByText('{ }')).toBeInTheDocument();
      expect(screen.getByText('#')).toBeInTheDocument();
    });

    it('renders tool counts', () => {
      render(<Sidebar />);
      expect(screen.getAllByText('2').length).toBe(2);
    });
  });

  describe('category links', () => {
    it('category links have correct hrefs', () => {
      render(<Sidebar />);
      const encodingLink = screen.getByRole('link', { name: /encoding.*2/i });
      expect(encodingLink).toHaveAttribute('href', '/tools/encoding');
    });

    it('all category links are present', () => {
      render(<Sidebar />);
      expect(screen.getByRole('link', { name: /encoding/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /crypto/i })).toBeInTheDocument();
    });
  });

  describe('expandable categories', () => {
    it('renders expand/collapse buttons for categories', () => {
      render(<Sidebar />);
      const expandButtons = screen.getAllByRole('button', { name: /expand|collapse/i });
      expect(expandButtons.length).toBe(2);
    });

    it('tools are hidden when category is collapsed', () => {
      render(<Sidebar />);
      expect(screen.queryByText('Base64 Encode')).not.toBeInTheDocument();
    });

    it('shows tools when category is expanded', () => {
      render(<Sidebar />);
      const expandButton = screen.getByRole('button', { name: /expand encoding/i });
      fireEvent.click(expandButton);

      expect(screen.getByText('Base64 Encode')).toBeInTheDocument();
      expect(screen.getByText('Base64 Decode')).toBeInTheDocument();
    });

    it('hides tools when category is collapsed after being expanded', () => {
      render(<Sidebar />);
      const expandButton = screen.getByRole('button', { name: /expand encoding/i });

      // Expand
      fireEvent.click(expandButton);
      expect(screen.getByText('Base64 Encode')).toBeInTheDocument();

      // Collapse
      fireEvent.click(expandButton);
      expect(screen.queryByText('Base64 Encode')).not.toBeInTheDocument();
    });

    it('tool links have correct hrefs', () => {
      render(<Sidebar />);
      const expandButton = screen.getByRole('button', { name: /expand encoding/i });
      fireEvent.click(expandButton);

      const toolLink = screen.getByRole('link', { name: /base64 encode/i });
      expect(toolLink).toHaveAttribute('href', '/tools/encoding/base64-encode');
    });
  });

  describe('active state', () => {
    it('highlights active category', () => {
      render(<Sidebar activeCategory="encoding" />);
      const encodingLink = screen.getByRole('link', { name: /encoding.*2/i });
      expect(encodingLink.className).toContain('bg-blue-50');
    });

    it('expands active category by default', () => {
      render(<Sidebar activeCategory="encoding" />);
      // Should be expanded by default when active
      expect(screen.getByText('Base64 Encode')).toBeInTheDocument();
    });

    it('highlights active tool', () => {
      render(<Sidebar activeCategory="encoding" activeTool="base64-encode" />);
      const toolLink = screen.getByRole('link', { name: /base64 encode/i });
      expect(toolLink.className).toContain('bg-blue-50');
    });
  });

  describe('mobile visibility', () => {
    it('is hidden on mobile by default', () => {
      render(<Sidebar />);
      const sidebar = screen.getByRole('complementary');
      expect(sidebar.className).toContain('hidden');
      expect(sidebar.className).toContain('lg:block');
    });

    it('shows on mobile when showOnMobile is true', () => {
      render(<Sidebar showOnMobile />);
      const sidebar = screen.getByRole('complementary');
      expect(sidebar.className).toContain('block');
    });
  });

  describe('navigation callback', () => {
    it('calls onNavigate when category link is clicked', () => {
      const onNavigate = jest.fn();
      render(<Sidebar onNavigate={onNavigate} />);

      const encodingLink = screen.getByRole('link', { name: /encoding.*2/i });
      fireEvent.click(encodingLink);

      expect(onNavigate).toHaveBeenCalledTimes(1);
    });

    it('calls onNavigate when tool link is clicked', () => {
      const onNavigate = jest.fn();
      render(<Sidebar activeCategory="encoding" onNavigate={onNavigate} />);

      const toolLink = screen.getByRole('link', { name: /base64 encode/i });
      fireEvent.click(toolLink);

      expect(onNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('styling', () => {
    it('has sticky positioning', () => {
      render(<Sidebar />);
      const stickyContainer = screen.getByRole('complementary').firstChild;
      expect((stickyContainer as HTMLElement)?.className).toContain('sticky');
    });

    it('has proper width class', () => {
      render(<Sidebar />);
      const sidebar = screen.getByRole('complementary');
      expect(sidebar.className).toContain('w-64');
    });

    it('has dark mode classes', () => {
      render(<Sidebar />);
      const sidebar = screen.getByRole('complementary');
      expect(sidebar.className).toContain('dark:bg-gray-900');
    });

    it('has border right', () => {
      render(<Sidebar />);
      const sidebar = screen.getByRole('complementary');
      expect(sidebar.className).toContain('border-r');
    });
  });

  describe('chevron icon rotation', () => {
    it('chevron rotates when category is expanded', () => {
      render(<Sidebar />);
      const expandButton = screen.getByRole('button', { name: /expand encoding/i });
      const svg = expandButton.querySelector('svg');

      // SVG className is an SVGAnimatedString, need to use baseVal
      expect(svg?.classList.contains('rotate-90')).toBe(false);

      fireEvent.click(expandButton);
      expect(svg?.classList.contains('rotate-90')).toBe(true);
    });
  });
});
