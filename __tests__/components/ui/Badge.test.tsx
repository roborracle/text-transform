/**
 * Badge component tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders children text', () => {
      render(<Badge>Label</Badge>);
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('renders as span element', () => {
      render(<Badge data-testid="badge">Label</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.tagName).toBe('SPAN');
    });

    it('applies inline-flex display', () => {
      render(<Badge data-testid="badge">Label</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('inline-flex');
    });

    it('applies rounded-full class', () => {
      render(<Badge data-testid="badge">Label</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('rounded-full');
    });
  });

  describe('variants', () => {
    it('applies default variant classes by default', () => {
      render(<Badge data-testid="badge">Default</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-gray-100');
      expect(badge.className).toContain('text-gray-800');
    });

    it('applies primary variant classes', () => {
      render(<Badge variant="primary" data-testid="badge">Primary</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-blue-100');
      expect(badge.className).toContain('text-blue-800');
    });

    it('applies success variant classes', () => {
      render(<Badge variant="success" data-testid="badge">Success</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-green-100');
      expect(badge.className).toContain('text-green-800');
    });

    it('applies warning variant classes', () => {
      render(<Badge variant="warning" data-testid="badge">Warning</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-yellow-100');
      expect(badge.className).toContain('text-yellow-800');
    });

    it('applies error variant classes', () => {
      render(<Badge variant="error" data-testid="badge">Error</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('bg-red-100');
      expect(badge.className).toContain('text-red-800');
    });
  });

  describe('sizes', () => {
    it('applies small size classes by default', () => {
      render(<Badge data-testid="badge">Small</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('px-2');
      expect(badge.className).toContain('py-0.5');
      expect(badge.className).toContain('text-xs');
    });

    it('applies medium size classes', () => {
      render(<Badge size="md" data-testid="badge">Medium</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('px-2.5');
      expect(badge.className).toContain('py-1');
      expect(badge.className).toContain('text-sm');
    });
  });

  describe('icon', () => {
    it('renders icon when provided', () => {
      render(
        <Badge icon={<span data-testid="icon">*</span>}>
          With Icon
        </Badge>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders icon before text', () => {
      render(
        <Badge icon={<span data-testid="icon">*</span>} data-testid="badge">
          Text
        </Badge>
      );
      const badge = screen.getByTestId('badge');
      const icon = screen.getByTestId('icon');
      const textNode = screen.getByText('Text');

      // Icon should appear before text in DOM order
      expect(badge.firstElementChild).toContainElement(icon);
    });

    it('does not render icon wrapper when icon is not provided', () => {
      render(<Badge data-testid="badge">No Icon</Badge>);
      const badge = screen.getByTestId('badge');
      // Badge should only have text child, no icon wrapper
      expect(badge.children.length).toBe(0);
      expect(badge.textContent).toBe('No Icon');
    });
  });

  describe('custom props', () => {
    it('applies custom className', () => {
      render(<Badge className="custom-class" data-testid="badge">Custom</Badge>);
      expect(screen.getByTestId('badge').className).toContain('custom-class');
    });

    it('passes additional props to span element', () => {
      render(
        <Badge data-testid="badge" aria-label="Status badge">
          Status
        </Badge>
      );
      expect(screen.getByTestId('badge')).toHaveAttribute('aria-label', 'Status badge');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to span element', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Badge ref={ref}>Ref Test</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('dark mode classes', () => {
    it('includes dark mode classes for default variant', () => {
      render(<Badge data-testid="badge">Default</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('dark:bg-gray-700');
      expect(badge.className).toContain('dark:text-gray-200');
    });

    it('includes dark mode classes for primary variant', () => {
      render(<Badge variant="primary" data-testid="badge">Primary</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.className).toContain('dark:bg-blue-900');
      expect(badge.className).toContain('dark:text-blue-200');
    });
  });
});
