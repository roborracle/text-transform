/**
 * CategoryCard component tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { CategoryCard } from '@/components/tools/CategoryCard';

describe('CategoryCard', () => {
  const defaultProps = {
    name: 'Encoding',
    description: 'Base64, URL encoding, and more',
    href: '/tools/encoding',
    toolCount: 15,
    icon: <span data-testid="category-icon">E</span>,
  };

  describe('rendering', () => {
    it('renders category name', () => {
      render(<CategoryCard {...defaultProps} />);
      expect(screen.getByText('Encoding')).toBeInTheDocument();
    });

    it('renders category description', () => {
      render(<CategoryCard {...defaultProps} />);
      expect(screen.getByText('Base64, URL encoding, and more')).toBeInTheDocument();
    });

    it('renders icon', () => {
      render(<CategoryCard {...defaultProps} />);
      expect(screen.getByTestId('category-icon')).toBeInTheDocument();
    });

    it('renders as a link', () => {
      render(<CategoryCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/tools/encoding');
    });
  });

  describe('tool count', () => {
    it('renders tool count with plural "tools"', () => {
      render(<CategoryCard {...defaultProps} toolCount={15} />);
      expect(screen.getByText('15 tools')).toBeInTheDocument();
    });

    it('renders tool count with singular "tool" for count of 1', () => {
      render(<CategoryCard {...defaultProps} toolCount={1} />);
      expect(screen.getByText('1 tool')).toBeInTheDocument();
    });

    it('renders tool count with plural "tools" for count of 0', () => {
      render(<CategoryCard {...defaultProps} toolCount={0} />);
      expect(screen.getByText('0 tools')).toBeInTheDocument();
    });

    it('handles large tool counts', () => {
      render(<CategoryCard {...defaultProps} toolCount={100} />);
      expect(screen.getByText('100 tools')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('name is in a heading element', () => {
      render(<CategoryCard {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Encoding');
    });

    it('link wraps the entire card', () => {
      render(<CategoryCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toContainElement(screen.getByText('Encoding'));
      expect(link).toContainElement(screen.getByText('Base64, URL encoding, and more'));
      expect(link).toContainElement(screen.getByText('15 tools'));
    });
  });

  describe('styling', () => {
    it('applies hover group class to link', () => {
      render(<CategoryCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link.className).toContain('group');
    });

    it('applies block display to link', () => {
      render(<CategoryCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link.className).toContain('block');
    });

    it('content is centered', () => {
      render(<CategoryCard {...defaultProps} />);
      const heading = screen.getByRole('heading');
      // The parent container should have text-center class
      expect(heading.parentElement?.className).toContain('text-center');
    });
  });

  describe('description truncation', () => {
    it('applies line-clamp class for long descriptions', () => {
      render(
        <CategoryCard
          {...defaultProps}
          description="This is a very long description that should be truncated after two lines to ensure the card maintains consistent height."
        />
      );
      const description = screen.getByText(/This is a very long description/);
      expect(description.className).toContain('line-clamp-2');
    });
  });

  describe('various props', () => {
    it('handles different categories', () => {
      render(
        <CategoryCard
          {...defaultProps}
          name="Cryptography"
          href="/tools/crypto"
        />
      );
      expect(screen.getByText('Cryptography')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/tools/crypto');
    });

    it('handles different icons', () => {
      render(
        <CategoryCard
          {...defaultProps}
          icon={<svg data-testid="svg-icon" />}
        />
      );
      expect(screen.getByTestId('svg-icon')).toBeInTheDocument();
    });

    it('handles empty description', () => {
      render(<CategoryCard {...defaultProps} description="" />);
      expect(screen.getByText('Encoding')).toBeInTheDocument();
    });
  });
});
