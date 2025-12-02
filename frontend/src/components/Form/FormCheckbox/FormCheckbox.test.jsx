import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormCheckbox from './FormCheckbox';

describe('FormCheckbox', () => {
    it('renders label text', () => {
        render(<FormCheckbox label="Accept terms" checked={false} onChange={() => { }} />);
        expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('renders checked when checked prop is true', () => {
        render(<FormCheckbox label="Test" checked={true} onChange={() => { }} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('renders unchecked when checked prop is false', () => {
        render(<FormCheckbox label="Test" checked={false} onChange={() => { }} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    it('calls onChange when clicked', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<FormCheckbox label="Click me" checked={false} onChange={handleChange} />);

        const checkbox = screen.getByRole('checkbox');
        await user.click(checkbox);

        expect(handleChange).toHaveBeenCalled();
    });

    it('calls onChange when label is clicked', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<FormCheckbox label="Click label" checked={false} onChange={handleChange} />);

        const label = screen.getByText('Click label');
        await user.click(label);

        expect(handleChange).toHaveBeenCalled();
    });

    it('has correct type attribute', () => {
        render(<FormCheckbox label="Test" checked={false} onChange={() => { }} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('applies correct CSS classes', () => {
        const { container } = render(
            <FormCheckbox label="Test" checked={false} onChange={() => { }} />
        );

        const label = container.querySelector('label');
        const input = container.querySelector('input');
        const span = container.querySelector('span');

        expect(label).toHaveClass('form-checkbox');
        expect(input).toHaveClass('input');
        expect(span).toHaveClass('label');
    });

    it('toggles between checked states', async () => {
        const user = userEvent.setup();
        let isChecked = false;
        const handleChange = vi.fn(() => {
            isChecked = !isChecked;
        });

        const { rerender } = render(
            <FormCheckbox label="Toggle" checked={isChecked} onChange={handleChange} />
        );

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();

        await user.click(checkbox);
        expect(handleChange).toHaveBeenCalled();

        rerender(<FormCheckbox label="Toggle" checked={true} onChange={handleChange} />);
        expect(screen.getByRole('checkbox')).toBeChecked();
    });
});
