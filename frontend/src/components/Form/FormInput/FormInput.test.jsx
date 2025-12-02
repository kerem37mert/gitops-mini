import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from './FormInput';

describe('FormInput', () => {
    it('renders input with placeholder', () => {
        render(<FormInput placeholder="Enter username" value="" onChange={() => { }} />);
        expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('displays the current value', () => {
        render(<FormInput placeholder="Name" value="John Doe" onChange={() => { }} />);
        const input = screen.getByPlaceholderText('Name');
        expect(input).toHaveValue('John Doe');
    });

    it('calls onChange when user types', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<FormInput placeholder="Type here" value="" onChange={handleChange} />);

        const input = screen.getByPlaceholderText('Type here');
        await user.type(input, 'test');

        expect(handleChange).toHaveBeenCalled();
    });

    it('calls onBlur when input loses focus', async () => {
        const user = userEvent.setup();
        const handleBlur = vi.fn();
        render(<FormInput placeholder="Test" value="" onChange={() => { }} onBlur={handleBlur} />);

        const input = screen.getByPlaceholderText('Test');
        await user.click(input);
        await user.tab();

        expect(handleBlur).toHaveBeenCalled();
    });

    it('has text type by default', () => {
        render(<FormInput placeholder="Test" value="" onChange={() => { }} />);
        const input = screen.getByPlaceholderText('Test');
        expect(input).toHaveAttribute('type', 'text');
    });

    it('applies custom className when provided', () => {
        const { container } = render(
            <FormInput placeholder="Test" value="" onChange={() => { }} className="custom" />
        );
        const input = container.querySelector('input');
        expect(input).toHaveClass('form-input');
        expect(input).toHaveClass('custom');
    });

    it('works without optional props', () => {
        render(<FormInput placeholder="Test" value="" onChange={() => { }} />);
        const input = screen.getByPlaceholderText('Test');
        expect(input).toBeInTheDocument();
    });
});
