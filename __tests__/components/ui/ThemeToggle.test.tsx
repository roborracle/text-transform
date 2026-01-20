/**
 * ThemeToggle component tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Helper to render with ThemeProvider
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset localStorage mock
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    (window.localStorage.setItem as jest.Mock).mockClear();
  });

  describe('simple toggle mode', () => {
    it('renders a button', () => {
      renderWithTheme(<ThemeToggle />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has accessible label', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('toggles theme when clicked', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');

      // Click to toggle
      fireEvent.click(button);

      // localStorage should be called with the new theme
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      renderWithTheme(<ThemeToggle className="custom-class" />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });
  });

  describe('dropdown mode', () => {
    it('renders three theme options when showDropdown is true', () => {
      renderWithTheme(<ThemeToggle showDropdown />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(3); // Light, Dark, System
    });

    it('renders light theme button', () => {
      renderWithTheme(<ThemeToggle showDropdown />);

      const lightButton = screen.getByRole('button', { name: /light/i });
      expect(lightButton).toBeInTheDocument();
    });

    it('renders dark theme button', () => {
      renderWithTheme(<ThemeToggle showDropdown />);

      const darkButton = screen.getByRole('button', { name: /dark/i });
      expect(darkButton).toBeInTheDocument();
    });

    it('renders system theme button', () => {
      renderWithTheme(<ThemeToggle showDropdown />);

      const systemButton = screen.getByRole('button', { name: /system/i });
      expect(systemButton).toBeInTheDocument();
    });

    it('sets theme to light when light button is clicked', () => {
      renderWithTheme(<ThemeToggle showDropdown />);

      const lightButton = screen.getByRole('button', { name: /light/i });
      fireEvent.click(lightButton);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'text-transform-theme',
        '"light"'
      );
    });

    it('sets theme to dark when dark button is clicked', () => {
      renderWithTheme(<ThemeToggle showDropdown />);

      const darkButton = screen.getByRole('button', { name: /dark/i });
      fireEvent.click(darkButton);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'text-transform-theme',
        '"dark"'
      );
    });

    it('sets theme to system when system button is clicked', () => {
      renderWithTheme(<ThemeToggle showDropdown />);

      const systemButton = screen.getByRole('button', { name: /system/i });
      fireEvent.click(systemButton);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'text-transform-theme',
        '"system"'
      );
    });

    it('applies custom className to container', () => {
      renderWithTheme(<ThemeToggle showDropdown className="custom-dropdown" />);

      // The container div should have the custom class
      const container = screen.getAllByRole('button')[0].closest('.custom-dropdown');
      expect(container).toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('renders an SVG icon in simple mode', () => {
      renderWithTheme(<ThemeToggle />);
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders SVG icons in dropdown mode', () => {
      renderWithTheme(<ThemeToggle showDropdown />);
      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        const svg = button.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });
});

describe('ThemeToggle without ThemeProvider', () => {
  it('throws error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<ThemeToggle />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });
});
