import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormTextarea from './FormTextarea';

describe('FormTextarea', () => {
    it('renders textarea with placeholder', () => {
        render(<FormTextarea placeholder="Enter description" value="" onChange={() => { }} />);
        expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    it('displays the current value', () => {
        const testValue = 'This is a test description';
        render(<FormTextarea placeholder="Description" value={testValue} onChange={() => { }} />);

        const textarea = screen.getByPlaceholderText('Description');
        expect(textarea).toHaveValue(testValue);
    });

    it('calls onChange when user types', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<FormTextarea placeholder="Type here" value="" onChange={handleChange} />);

        const textarea = screen.getByPlaceholderText('Type here');
        await user.type(textarea, 'test');

        expect(handleChange).toHaveBeenCalled();
    });

    it('has default rows of 3', () => {
        render(<FormTextarea placeholder="Test" value="" onChange={() => { }} />);
        const textarea = screen.getByPlaceholderText('Test');
        expect(textarea).toHaveAttribute('rows', '3');
    });

    it('accepts custom rows value', () => {
        render(<FormTextarea placeholder="Test" value="" onChange={() => { }} rows={5} />);
        const textarea = screen.getByPlaceholderText('Test');
        expect(textarea).toHaveAttribute('rows', '5');
    });

    it('applies correct CSS class', () => {
        const { container } = render(
            <FormTextarea placeholder="Test" value="" onChange={() => { }} />
        );
        const textarea = container.querySelector('textarea');
        expect(textarea).toHaveClass('form-textarea');
    });

    it('handles multiline text', () => {
        const multilineText = 'Line 1\nLine 2\nLine 3';
        render(<FormTextarea placeholder="Test" value={multilineText} onChange={() => { }} />);

        const textarea = screen.getByPlaceholderText('Test');
        expect(textarea).toHaveValue(multilineText);
    });

    it('updates value when user types multiple characters', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        render(<FormTextarea placeholder="Test" value="" onChange={handleChange} />);

        const textarea = screen.getByPlaceholderText('Test');
        await user.type(textarea, 'Hello World');

        expect(handleChange).toHaveBeenCalledTimes(11); // Once per character
    });
});
