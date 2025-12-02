import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormConstraint from './FormConstraint';

describe('FormConstraint', () => {
    it('renders constraint text', () => {
        render(<FormConstraint text="Password must be at least 8 characters" />);
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('applies correct CSS class', () => {
        const { container } = render(<FormConstraint text="Test constraint" />);
        const div = container.querySelector('div');
        expect(div).toHaveClass('form-constraint');
    });

    it('renders with different text values', () => {
        const { rerender } = render(<FormConstraint text="First constraint" />);
        expect(screen.getByText('First constraint')).toBeInTheDocument();

        rerender(<FormConstraint text="Second constraint" />);
        expect(screen.getByText('Second constraint')).toBeInTheDocument();
    });

    it('handles empty text', () => {
        const { container } = render(<FormConstraint text="" />);
        const div = container.querySelector('div');
        expect(div).toBeInTheDocument();
        expect(div).toHaveTextContent('');
    });

    it('renders long constraint text', () => {
        const longText = 'This is a very long constraint message that provides detailed information about the form field requirements and validation rules';
        render(<FormConstraint text={longText} />);
        expect(screen.getByText(longText)).toBeInTheDocument();
    });
});
