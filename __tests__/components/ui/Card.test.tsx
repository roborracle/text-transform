/**
 * Card component tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.tagName).toBe('DIV');
    });

    it('renders as article when specified', () => {
      render(<Card as="article" data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.tagName).toBe('ARTICLE');
    });

    it('renders as section when specified', () => {
      render(<Card as="section" data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.tagName).toBe('SECTION');
    });
  });

  describe('variants', () => {
    it('applies default variant classes', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('rounded-lg');
    });

    it('applies elevated variant classes', () => {
      render(<Card variant="elevated" data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('shadow-lg');
    });

    it('applies bordered variant classes', () => {
      render(<Card variant="bordered" data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('border');
      expect(card.className).toContain('border-gray-200');
    });
  });

  describe('padding', () => {
    it('applies medium padding by default', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('p-4');
    });

    it('applies no padding when padding is none', () => {
      render(<Card padding="none" data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.className).not.toContain('p-');
    });

    it('applies small padding', () => {
      render(<Card padding="sm" data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('p-3');
    });

    it('applies large padding', () => {
      render(<Card padding="lg" data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('p-6');
    });
  });

  describe('interactive mode', () => {
    it('does not apply interactive styles by default', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.className).not.toContain('cursor-pointer');
      expect(card.className).not.toContain('hover:shadow-md');
    });

    it('applies interactive styles when interactive is true', () => {
      render(<Card interactive data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card.className).toContain('cursor-pointer');
      expect(card.className).toContain('hover:shadow-lg');
    });
  });

  describe('custom props', () => {
    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card">Content</Card>);
      expect(screen.getByTestId('card').className).toContain('custom-class');
    });

    it('passes additional props to element', () => {
      render(<Card data-testid="card" aria-label="Test card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'Test card');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLElement>();
      render(<Card ref={ref}>Content</Card>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});

describe('CardHeader', () => {
  it('renders title when provided', () => {
    render(<CardHeader title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders title as h3', () => {
    render(<CardHeader title="Test Title" />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Title');
  });

  it('renders description when provided', () => {
    render(<CardHeader description="Test description" />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders both title and description', () => {
    render(<CardHeader title="Title" description="Description" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<CardHeader>Custom content</CardHeader>);
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('renders title, description, and children together', () => {
    render(
      <CardHeader title="Title" description="Desc">
        <button>Action</button>
      </CardHeader>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardHeader className="custom" data-testid="header">Content</CardHeader>);
    expect(screen.getByTestId('header').className).toContain('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Content</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Content goes here</CardContent>);
    expect(screen.getByText('Content goes here')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<CardContent className="custom" data-testid="content">Content</CardContent>);
    expect(screen.getByTestId('content').className).toContain('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies border-top styling', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer.className).toContain('border-t');
    expect(footer.className).toContain('mt-4');
    expect(footer.className).toContain('pt-4');
  });

  it('applies custom className', () => {
    render(<CardFooter className="custom" data-testid="footer">Footer</CardFooter>);
    expect(screen.getByTestId('footer').className).toContain('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Footer</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Card composition', () => {
  it('renders complete card with all parts', () => {
    render(
      <Card variant="bordered" data-testid="card">
        <CardHeader title="Card Title" description="Card description" />
        <CardContent>Main content</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });
});
