/**
 * Footer component tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

// Mock tools library
jest.mock('@/lib/tools', () => ({
  getAllCategories: () => [
    { id: 'encoding', name: 'Encoding', slug: 'encoding' },
    { id: 'crypto', name: 'Crypto', slug: 'crypto' },
    { id: 'formatters', name: 'Formatters', slug: 'formatters' },
  ],
  getToolCount: () => 111,
}));

describe('Footer', () => {
  describe('rendering', () => {
    it('renders the footer element', () => {
      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders the site logo', () => {
      render(<Footer />);
      expect(screen.getByText('{T}')).toBeInTheDocument();
      expect(screen.getByText('Text Transform')).toBeInTheDocument();
    });

    it('renders tool count', () => {
      render(<Footer />);
      expect(screen.getByText(/111\+ free developer tools/i)).toBeInTheDocument();
    });
  });

  describe('brand section', () => {
    it('logo links to homepage', () => {
      render(<Footer />);
      const logoLink = screen.getByRole('link', { name: /{T}|Text Transform/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('displays privacy statement', () => {
      render(<Footer />);
      expect(
        screen.getByText(/your data never leaves your device/i)
      ).toBeInTheDocument();
    });
  });

  describe('categories section', () => {
    it('renders Categories heading', () => {
      render(<Footer />);
      expect(screen.getByRole('heading', { name: /categories/i })).toBeInTheDocument();
    });

    it('renders category links', () => {
      render(<Footer />);
      expect(screen.getByRole('link', { name: /encoding/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /crypto/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /formatters/i })).toBeInTheDocument();
    });

    it('category links have correct hrefs', () => {
      render(<Footer />);
      const encodingLink = screen.getByRole('link', { name: /encoding/i });
      expect(encodingLink).toHaveAttribute('href', '/tools/encoding');
    });
  });

  describe('related tools section', () => {
    it('renders Related Tools heading', () => {
      render(<Footer />);
      expect(screen.getByRole('heading', { name: /related tools/i })).toBeInTheDocument();
    });

    it('renders CaseChangerPro link', () => {
      render(<Footer />);
      const link = screen.getByRole('link', { name: /casechangerpro/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://casechangerpro.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders ColorCodeGuide link', () => {
      render(<Footer />);
      const link = screen.getByRole('link', { name: /colorcodeguide/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://colorcodeguide.com');
    });

    it('displays descriptions for related tools', () => {
      render(<Footer />);
      expect(screen.getByText(/writer text tools/i)).toBeInTheDocument();
      expect(screen.getByText(/color conversion tools/i)).toBeInTheDocument();
    });
  });

  describe('copyright section', () => {
    it('renders copyright notice', () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(new RegExp(`${currentYear}.*Text Transform`, 'i'))
      ).toBeInTheDocument();
    });

    it('displays client-side processing badge', () => {
      render(<Footer />);
      expect(screen.getByText(/100% client-side processing/i)).toBeInTheDocument();
    });

    it('displays no data stored badge', () => {
      render(<Footer />);
      expect(screen.getByText(/no data stored/i)).toBeInTheDocument();
    });
  });

  describe('responsive layout', () => {
    it('has responsive grid classes', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      const grid = footer.querySelector('.grid');
      expect(grid?.className).toContain('md:grid-cols-4');
    });
  });

  describe('styling', () => {
    it('has proper dark mode classes', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer.className).toContain('dark:bg-gray-900');
    });

    it('has border top', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer.className).toContain('border-t');
    });
  });
});
