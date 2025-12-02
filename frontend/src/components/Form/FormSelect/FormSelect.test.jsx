import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormSelect from './FormSelect';

describe('FormSelect', () => {
    const mockOptions = ['Option 1', 'Option 2', 'Option 3'];

    it('renders all options', () => {
        render(<FormSelect options={mockOptions} value="" onChange={() => { }} />);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('renders placeholder when provided', () => {
        render(
            <FormSelect
                options={mockOptions}
                value=""
                onChange={() => { }}
                placeholder="Select an option"
            />
        );

        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('displays the selected value', () => {
        const { container } = render(
            <FormSelect options={mockOptions} value="Option 2" onChange={() => { }} />
        );

        const select = container.querySelector('select');
        expect(select).toHaveValue('Option 2');
    });

    it('calls onChange when selection changes', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();

        const { container } = render(
            <FormSelect options={mockOptions} value="" onChange={handleChange} />
        );

        const select = container.querySelector('select');
        await user.selectOptions(select, 'Option 1');

        expect(handleChange).toHaveBeenCalled();
    });

    it('is disabled when disabled prop is true', () => {
        const { container } = render(
            <FormSelect options={mockOptions} value="" onChange={() => { }} disabled={true} />
        );

        const select = container.querySelector('select');
        expect(select).toBeDisabled();
    });

    it('is enabled by default', () => {
        const { container } = render(
            <FormSelect options={mockOptions} value="" onChange={() => { }} />
        );

        const select = container.querySelector('select');
        expect(select).not.toBeDisabled();
    });

    it('placeholder option is disabled', () => {
        render(
            <FormSelect
                options={mockOptions}
                value=""
                onChange={() => { }}
                placeholder="Choose..."
            />
        );

        const placeholderOption = screen.getByText('Choose...').closest('option');
        expect(placeholderOption).toHaveAttribute('disabled');
    });

    it('applies correct CSS class', () => {
        const { container } = render(
            <FormSelect options={mockOptions} value="" onChange={() => { }} />
        );

        const select = container.querySelector('select');
        expect(select).toHaveClass('form-select');
    });
});
