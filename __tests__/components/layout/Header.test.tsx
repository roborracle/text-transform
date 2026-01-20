/**
 * Header component tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/Header';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock ThemeToggle
jest.mock('@/components/ui', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

// Mock tools library
jest.mock('@/lib/tools', () => ({
  getAllCategoriesWithCounts: () => [
    { id: 'encoding', name: 'Encoding', slug: 'encoding', icon: '{ }', toolCount: 10 },
    { id: 'crypto', name: 'Crypto', slug: 'crypto', icon: '#', toolCount: 8 },
  ],
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the header element', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders the logo with site name', () => {
      render(<Header />);
      expect(screen.getByText('{T}')).toBeInTheDocument();
      expect(screen.getByText('Text Transform')).toBeInTheDocument();
    });

    it('renders home link', () => {
      render(<Header />);
      const homeLinks = screen.getAllByRole('link', { name: /home/i });
      expect(homeLinks.length).toBeGreaterThan(0);
    });

    it('renders theme toggle', () => {
      render(<Header />);
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('renders Tools dropdown button', () => {
      render(<Header />);
      expect(screen.getByRole('button', { name: /tools/i })).toBeInTheDocument();
    });
  });

  describe('logo link', () => {
    it('logo links to homepage', () => {
      render(<Header />);
      const logoLink = screen.getByRole('link', { name: /{T}|Text Transform/i });
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('desktop navigation', () => {
    it('renders Home link in desktop nav', () => {
      render(<Header />);
      const desktopNav = document.querySelector('nav.hidden.md\\:flex');
      expect(desktopNav).toBeInTheDocument();
    });

    it('renders Tools dropdown button', () => {
      render(<Header />);
      const toolsButton = screen.getByRole('button', { name: /tools/i });
      expect(toolsButton).toBeInTheDocument();
    });
  });

  describe('Tools dropdown', () => {
    it('dropdown is hidden initially', () => {
      render(<Header />);
      // Categories should not be visible initially
      expect(screen.queryByText('Encoding')).not.toBeInTheDocument();
    });

    it('shows dropdown when Tools button is clicked', () => {
      render(<Header />);
      const toolsButton = screen.getByRole('button', { name: /tools/i });
      fireEvent.click(toolsButton);
      expect(screen.getByText('Encoding')).toBeInTheDocument();
      expect(screen.getByText('Crypto')).toBeInTheDocument();
    });

    it('shows tool count in dropdown', () => {
      render(<Header />);
      const toolsButton = screen.getByRole('button', { name: /tools/i });
      fireEvent.click(toolsButton);
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('category links have correct hrefs', () => {
      render(<Header />);
      const toolsButton = screen.getByRole('button', { name: /tools/i });
      fireEvent.click(toolsButton);

      const encodingLink = screen.getByRole('link', { name: /encoding/i });
      expect(encodingLink).toHaveAttribute('href', '/tools/encoding');
    });
  });

  describe('mobile menu', () => {
    it('renders mobile menu button', () => {
      render(<Header />);
      const mobileMenuButton = screen.getByRole('button', { name: /toggle menu/i });
      expect(mobileMenuButton).toBeInTheDocument();
    });

    it('mobile menu is hidden initially', () => {
      render(<Header />);
      const mobileNav = document.querySelector('.md\\:hidden nav');
      expect(mobileNav).not.toBeInTheDocument();
    });

    it('shows mobile menu when menu button is clicked', () => {
      render(<Header />);
      const mobileMenuButton = screen.getByRole('button', { name: /toggle menu/i });
      fireEvent.click(mobileMenuButton);

      // Mobile menu should now show categories
      const mobileNav = document.querySelector('.md\\:hidden');
      expect(mobileNav).toBeInTheDocument();
    });

    it('hides mobile menu when clicked again', () => {
      render(<Header />);
      const mobileMenuButton = screen.getByRole('button', { name: /toggle menu/i });

      // Open menu
      fireEvent.click(mobileMenuButton);
      expect(document.querySelector('.md\\:hidden nav')).toBeInTheDocument();

      // Close menu
      fireEvent.click(mobileMenuButton);
      expect(document.querySelector('.md\\:hidden nav')).not.toBeInTheDocument();
    });
  });

  describe('sticky header', () => {
    it('has sticky positioning class', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header.className).toContain('sticky');
      expect(header.className).toContain('top-0');
    });

    it('has high z-index for overlay', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header.className).toContain('z-50');
    });
  });

  describe('active state', () => {
    it('highlights Home when on homepage', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/');

      render(<Header />);
      const homeLink = screen.getAllByRole('link', { name: /home/i })[0];
      expect(homeLink.className).toContain('text-blue-600');
    });

    it('highlights Tools when on tools page', () => {
      const { usePathname } = require('next/navigation');
      usePathname.mockReturnValue('/tools/encoding');

      render(<Header />);
      const toolsButton = screen.getByRole('button', { name: /tools/i });
      expect(toolsButton.className).toContain('text-blue-600');
    });
  });
});
