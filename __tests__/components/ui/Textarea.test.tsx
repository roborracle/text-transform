/**
 * Textarea component tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '@/components/ui/Textarea';

describe('Textarea', () => {
  describe('rendering', () => {
    it('renders a textarea element', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with value', () => {
      render(<Textarea value="test content" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('test content');
    });

    it('renders with placeholder', () => {
      render(<Textarea placeholder="Enter text..." />);
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });
  });

  describe('label', () => {
    it('renders label when provided', () => {
      render(<Textarea label="Input Label" />);
      expect(screen.getByText('Input Label')).toBeInTheDocument();
    });

    it('associates label with textarea', () => {
      render(<Textarea label="Input Label" />);
      const textarea = screen.getByRole('textbox');
      const label = screen.getByText('Input Label');
      expect(label).toHaveAttribute('for', textarea.id);
    });

    it('does not render label when not provided', () => {
      render(<Textarea />);
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('displays error message when error prop is provided', () => {
      render(<Textarea error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('applies error styling to textarea', () => {
      render(<Textarea error="Error" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('border-red-500');
    });

    it('sets aria-invalid to true when error is present', () => {
      render(<Textarea error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('hides helper text when error is displayed', () => {
      render(<Textarea error="Error message" helperText="Helper text" />);
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  describe('helper text', () => {
    it('displays helper text when provided', () => {
      render(<Textarea helperText="Enter your text here" />);
      expect(screen.getByText('Enter your text here')).toBeInTheDocument();
    });

    it('does not display helper text when error is present', () => {
      render(<Textarea helperText="Helper" error="Error" />);
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('character count', () => {
    it('shows character count when showCharCount is true', () => {
      render(<Textarea value="hello" onChange={() => {}} showCharCount />);
      expect(screen.getByText('5 chars')).toBeInTheDocument();
    });

    it('shows formatted character count for large numbers', () => {
      render(<Textarea value={'a'.repeat(1000)} onChange={() => {}} showCharCount />);
      expect(screen.getByText('1,000 chars')).toBeInTheDocument();
    });

    it('shows max character count when provided', () => {
      render(<Textarea value="hi" onChange={() => {}} showCharCount maxCharCount={100} />);
      expect(screen.getByText('2 / 100 chars')).toBeInTheDocument();
    });

    it('highlights character count in red when exceeding max', () => {
      render(<Textarea value="hello" onChange={() => {}} showCharCount maxCharCount={3} />);
      const countElement = screen.getByText('5 / 3 chars');
      expect(countElement.className).toContain('text-red-500');
    });

    it('does not show character count by default', () => {
      render(<Textarea value="hello" onChange={() => {}} />);
      expect(screen.queryByText('5 chars')).not.toBeInTheDocument();
    });
  });

  describe('line count', () => {
    it('shows line count when showLineCount is true', () => {
      // Use template literal for actual newlines
      const multilineText = `line1
line2
line3`;
      render(<Textarea value={multilineText} onChange={() => {}} showLineCount />);
      expect(screen.getByText('3 lines')).toBeInTheDocument();
    });

    it('shows singular "line" for single line', () => {
      render(<Textarea value="single line" onChange={() => {}} showLineCount />);
      expect(screen.getByText('1 line')).toBeInTheDocument();
    });

    it('shows 0 lines for empty value', () => {
      render(<Textarea value="" onChange={() => {}} showLineCount />);
      expect(screen.getByText('0 lines')).toBeInTheDocument();
    });

    it('does not show line count by default', () => {
      render(<Textarea value="hello" onChange={() => {}} />);
      expect(screen.queryByText(/line/)).not.toBeInTheDocument();
    });
  });

  describe('monospace font', () => {
    it('applies monospace font class when monospace is true', () => {
      render(<Textarea monospace />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('font-mono');
    });

    it('applies sans font by default', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('font-sans');
    });
  });

  describe('interactions', () => {
    it('calls onChange when value changes', () => {
      const onChange = jest.fn();
      render(<Textarea onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new text' } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('calls onValueChange with the new value', () => {
      const onValueChange = jest.fn();
      render(<Textarea onValueChange={onValueChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'new text' } });
      expect(onValueChange).toHaveBeenCalledWith('new text');
    });

    it('calls both onChange and onValueChange', () => {
      const onChange = jest.fn();
      const onValueChange = jest.fn();
      render(<Textarea onChange={onChange} onValueChange={onValueChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
      expect(onChange).toHaveBeenCalled();
      expect(onValueChange).toHaveBeenCalledWith('test');
    });
  });

  describe('disabled state', () => {
    it('disables textarea when disabled prop is true', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('custom props', () => {
    it('passes additional props to textarea element', () => {
      render(<Textarea data-testid="custom-textarea" rows={5} />);
      const textarea = screen.getByTestId('custom-textarea');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('applies custom className', () => {
      render(<Textarea className="custom-class" />);
      expect(screen.getByRole('textbox').className).toContain('custom-class');
    });

    it('uses provided id', () => {
      render(<Textarea id="my-textarea" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-textarea');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to textarea element', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });
});
