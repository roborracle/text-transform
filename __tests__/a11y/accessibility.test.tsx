/**
 * Accessibility Tests using jest-axe
 * WCAG 2.1 AA compliance testing
 * @jest-environment jsdom
 */

import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Add custom matcher
expect.extend(toHaveNoViolations);

// Import components
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { SkipLink } from '@/components/ui/SkipLink';
import { Skeleton, ToolCardSkeleton, CategoryCardSkeleton } from '@/components/ui/Skeleton';

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with icon', async () => {
      const { container } = render(
        <Button leftIcon={<span>Icon</span>}>Button with Icon</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations when loading', async () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Card Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <h2>Card Title</h2>
          </CardHeader>
          <CardContent>Card content goes here</CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Badge Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Badge>Status</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with different variants', async () => {
      const { container } = render(
        <div>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Textarea Component', () => {
    it('should have no accessibility violations with label', async () => {
      const { container } = render(
        <Textarea label="Description" placeholder="Enter description" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with error state', async () => {
      const { container } = render(
        <Textarea label="Input" error="This field is required" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with helper text', async () => {
      const { container } = render(
        <Textarea label="Comment" helperText="Maximum 500 characters" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('SkipLink Component', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <SkipLink />
          <main id="main-content">Main content</main>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Skeleton Components', () => {
    it('should have no accessibility violations for base skeleton', async () => {
      const { container } = render(<Skeleton width={100} height={20} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations for multi-line skeleton', async () => {
      const { container } = render(<Skeleton lines={3} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations for ToolCardSkeleton', async () => {
      const { container } = render(<ToolCardSkeleton />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations for CategoryCardSkeleton', async () => {
      const { container } = render(<CategoryCardSkeleton />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Accessibility', () => {
    it('should have proper form structure', async () => {
      const { container } = render(
        <form aria-label="Search form">
          <label htmlFor="search">Search</label>
          <input id="search" type="text" name="search" />
          <Button type="submit">Submit</Button>
        </form>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Interactive Elements', () => {
    it('should have accessible links', async () => {
      const { container } = render(
        <a href="/tools" className="text-blue-600">
          Browse Tools
        </a>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible buttons with aria-labels', async () => {
      const { container } = render(
        <button aria-label="Close dialog">
          <span aria-hidden="true">×</span>
        </button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient contrast for text content', async () => {
      const { container } = render(
        <div>
          <p className="text-gray-900">High contrast text</p>
          <p className="text-gray-600">Medium contrast text</p>
        </div>
      );
      const results = await axe(container);
      // Note: axe may not catch all contrast issues without actual CSS
      expect(results).toHaveNoViolations();
    });
  });

  describe('Headings Structure', () => {
    it('should have proper heading hierarchy', async () => {
      const { container } = render(
        <article>
          <h1>Main Title</h1>
          <section>
            <h2>Section Title</h2>
            <p>Content</p>
            <h3>Subsection</h3>
            <p>More content</p>
          </section>
        </article>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Lists', () => {
    it('should have accessible list structures', async () => {
      const { container } = render(
        <nav aria-label="Tool categories">
          <ul>
            <li>
              <a href="/tools/encoding">Encoding</a>
            </li>
            <li>
              <a href="/tools/crypto">Crypto</a>
            </li>
            <li>
              <a href="/tools/formatters">Formatters</a>
            </li>
          </ul>
        </nav>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Images', () => {
    it('should have accessible images with alt text', async () => {
      const { container } = render(
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/logo.png" alt="Text Transform logo" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have accessible decorative images', async () => {
      const { container } = render(
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/decoration.png" alt="" role="presentation" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Roles', () => {
    it('should have proper dialog role', async () => {
      const { container } = render(
        <div role="dialog" aria-modal="true" aria-label="Search dialog">
          <h2 id="dialog-title">Search</h2>
          <input type="text" aria-label="Search query" />
          <button>Close</button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper alert role', async () => {
      const { container } = render(
        <div role="alert" aria-live="polite">
          Your changes have been saved.
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper status role', async () => {
      const { container } = render(
        <div role="status" aria-live="polite">
          Processing...
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
