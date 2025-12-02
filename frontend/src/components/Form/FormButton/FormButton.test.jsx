import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormButton from './FormButton';

describe('FormButton', () => {
    it('renders with provided text', () => {
        render(<FormButton text="Submit" />);
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('renders as a submit button', () => {
        render(<FormButton text="Click Me" />);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('applies correct CSS class', () => {
        const { container } = render(<FormButton text="Test" />);
        const button = container.querySelector('button');
        expect(button).toHaveClass('form-button');
    });

    it('renders with different text values', () => {
        const { rerender } = render(<FormButton text="Login" />);
        expect(screen.getByText('Login')).toBeInTheDocument();

        rerender(<FormButton text="Register" />);
        expect(screen.getByText('Register')).toBeInTheDocument();
    });
});
