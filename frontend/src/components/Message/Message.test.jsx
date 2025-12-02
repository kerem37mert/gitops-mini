import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Message from './Message';

describe('Message', () => {
    it('renders error message with correct text', () => {
        render(<Message type="err" text="Error occurred" />);
        expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });

    it('renders success message with correct text', () => {
        render(<Message type="sccs" text="Success!" />);
        expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    it('applies error CSS class for type="err"', () => {
        const { container } = render(<Message type="err" text="Error" />);
        const messageDiv = container.querySelector('div');
        expect(messageDiv).toHaveClass('message');
        expect(messageDiv).toHaveClass('err');
    });

    it('applies success CSS class for type="sccs"', () => {
        const { container } = render(<Message type="sccs" text="Success" />);
        const messageDiv = container.querySelector('div');
        expect(messageDiv).toHaveClass('message');
        expect(messageDiv).toHaveClass('sccs');
    });

    it('renders with long text content', () => {
        const longText = 'This is a very long error message that should still be displayed correctly';
        render(<Message type="err" text={longText} />);
        expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles empty text', () => {
        const { container } = render(<Message type="err" text="" />);
        const messageDiv = container.querySelector('div');
        expect(messageDiv).toBeInTheDocument();
        expect(messageDiv).toHaveTextContent('');
    });
});
