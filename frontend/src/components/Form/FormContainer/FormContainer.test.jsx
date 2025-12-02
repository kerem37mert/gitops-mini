import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormContainer from './FormContainer';

describe('FormContainer', () => {
    it('renders children correctly', () => {
        render(
            <FormContainer onSubmit={() => { }}>
                <input placeholder="Test input" />
                <button>Submit</button>
            </FormContainer>
        );

        expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('calls onSubmit when form is submitted', async () => {
        const user = userEvent.setup();
        const handleSubmit = vi.fn((e) => e.preventDefault());

        render(
            <FormContainer onSubmit={handleSubmit}>
                <button type="submit">Submit</button>
            </FormContainer>
        );

        const submitButton = screen.getByText('Submit');
        await user.click(submitButton);

        expect(handleSubmit).toHaveBeenCalled();
    });

    it('has POST method attribute', () => {
        const { container } = render(
            <FormContainer onSubmit={() => { }}>
                <div>Content</div>
            </FormContainer>
        );

        const form = container.querySelector('form');
        expect(form).toHaveAttribute('method', 'POST');
    });

    it('has action attribute', () => {
        const { container } = render(
            <FormContainer onSubmit={() => { }}>
                <div>Content</div>
            </FormContainer>
        );

        const form = container.querySelector('form');
        expect(form).toHaveAttribute('action', '/');
    });

    it('applies correct CSS class', () => {
        const { container } = render(
            <FormContainer onSubmit={() => { }}>
                <div>Content</div>
            </FormContainer>
        );

        const form = container.querySelector('form');
        expect(form).toHaveClass('form-container');
    });

    it('prevents default form submission when onSubmit is called', async () => {
        const user = userEvent.setup();
        const handleSubmit = vi.fn((e) => {
            e.preventDefault();
        });

        render(
            <FormContainer onSubmit={handleSubmit}>
                <input placeholder="Email" />
                <button type="submit">Send</button>
            </FormContainer>
        );

        await user.click(screen.getByText('Send'));

        expect(handleSubmit).toHaveBeenCalled();
        const event = handleSubmit.mock.calls[0][0];
        expect(event.defaultPrevented).toBe(true);
    });

    it('renders multiple form elements', () => {
        render(
            <FormContainer onSubmit={() => { }}>
                <input placeholder="Username" />
                <input placeholder="Password" type="password" />
                <textarea placeholder="Bio" />
                <button>Submit</button>
            </FormContainer>
        );

        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Bio')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });
});
