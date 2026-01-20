/**
 * ToolCard component tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToolCard } from '@/components/tools/ToolCard';

describe('ToolCard', () => {
  const defaultProps = {
    name: 'Base64 Encoder',
    description: 'Encode text to Base64 format',
    href: '/tools/encoding/base64',
    category: 'Encoding',
  };

  describe('rendering', () => {
    it('renders tool name', () => {
      render(<ToolCard {...defaultProps} />);
      expect(screen.getByText('Base64 Encoder')).toBeInTheDocument();
    });

    it('renders tool description', () => {
      render(<ToolCard {...defaultProps} />);
      expect(screen.getByText('Encode text to Base64 format')).toBeInTheDocument();
    });

    it('renders category badge', () => {
      render(<ToolCard {...defaultProps} />);
      expect(screen.getByText('Encoding')).toBeInTheDocument();
    });

    it('renders as a link', () => {
      render(<ToolCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/tools/encoding/base64');
    });
  });

  describe('icon', () => {
    it('renders icon when provided', () => {
      render(
        <ToolCard
          {...defaultProps}
          icon={<span data-testid="tool-icon">Icon</span>}
        />
      );
      expect(screen.getByTestId('tool-icon')).toBeInTheDocument();
    });

    it('does not render icon container when icon is not provided', () => {
      render(<ToolCard {...defaultProps} />);
      // The icon container has specific styling - should not be present
      expect(screen.queryByTestId('tool-icon')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('name is in a heading element', () => {
      render(<ToolCard {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Base64 Encoder');
    });

    it('link is accessible with tool name', () => {
      render(<ToolCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toContainElement(screen.getByText('Base64 Encoder'));
    });
  });

  describe('styling', () => {
    it('applies hover group class to link', () => {
      render(<ToolCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link.className).toContain('group');
    });

    it('applies block display to link', () => {
      render(<ToolCard {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link.className).toContain('block');
    });
  });

  describe('description truncation', () => {
    it('applies line-clamp class for long descriptions', () => {
      render(
        <ToolCard
          {...defaultProps}
          description="This is a very long description that should be truncated after two lines to ensure the card maintains consistent height across all tool cards in the grid layout."
        />
      );
      const description = screen.getByText(/This is a very long description/);
      expect(description.className).toContain('line-clamp-2');
    });
  });

  describe('various props', () => {
    it('handles different categories', () => {
      render(<ToolCard {...defaultProps} category="Crypto" />);
      expect(screen.getByText('Crypto')).toBeInTheDocument();
    });

    it('handles different hrefs', () => {
      render(<ToolCard {...defaultProps} href="/tools/crypto/sha256" />);
      expect(screen.getByRole('link')).toHaveAttribute('href', '/tools/crypto/sha256');
    });

    it('handles empty description', () => {
      render(<ToolCard {...defaultProps} description="" />);
      expect(screen.getByText('Base64 Encoder')).toBeInTheDocument();
    });
  });
});
