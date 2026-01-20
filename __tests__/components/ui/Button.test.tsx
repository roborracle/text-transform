/**
 * Button component tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders children text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('renders with default props', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('renders left icon when provided', () => {
      render(<Button leftIcon={<span data-testid="left-icon">L</span>}>With Icon</Button>);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders right icon when provided', () => {
      render(<Button rightIcon={<span data-testid="right-icon">R</span>}>With Icon</Button>);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('renders both icons when provided', () => {
      render(
        <Button
          leftIcon={<span data-testid="left-icon">L</span>}
          rightIcon={<span data-testid="right-icon">R</span>}
        >
          Both Icons
        </Button>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('applies primary variant classes by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-blue-600');
    });

    it('applies secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gray-200');
    });

    it('applies outline variant classes', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('border-2');
      expect(button.className).toContain('bg-transparent');
    });

    it('applies ghost variant classes', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
    });
  });

  describe('sizes', () => {
    it('applies medium size classes by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
      expect(button.className).toContain('text-base');
    });

    it('applies small size classes', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-3');
      expect(button.className).toContain('py-1.5');
      expect(button.className).toContain('text-sm');
    });

    it('applies large size classes', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-3');
      expect(button.className).toContain('text-lg');
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('prevents click events when disabled', () => {
      const onClick = jest.fn();
      render(<Button disabled onClick={onClick}>Disabled</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('shows loading text when isLoading is true', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Loading...');
    });

    it('is disabled when loading', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows spinner when loading', () => {
      render(<Button isLoading>Submit</Button>);
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('animate-spin');
    });

    it('hides children when loading', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByRole('button')).not.toHaveTextContent('Submit');
    });
  });

  describe('fullWidth', () => {
    it('applies full width class when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button').className).toContain('w-full');
    });

    it('does not apply full width class by default', () => {
      render(<Button>Normal</Button>);
      expect(screen.getByRole('button').className).not.toContain('w-full');
    });
  });

  describe('interactions', () => {
    it('calls onClick handler when clicked', () => {
      const onClick = jest.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('passes additional props to button element', () => {
      render(<Button data-testid="custom-button" type="submit">Submit</Button>);
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole('button').className).toContain('custom-class');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
