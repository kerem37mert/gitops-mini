import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Body from './Body';

describe('Body', () => {
    it('renders children correctly', () => {
        render(
            <Body>
                <div>Test Content</div>
            </Body>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
        render(
            <Body>
                <div>First Child</div>
                <div>Second Child</div>
                <p>Third Child</p>
            </Body>
        );

        expect(screen.getByText('First Child')).toBeInTheDocument();
        expect(screen.getByText('Second Child')).toBeInTheDocument();
        expect(screen.getByText('Third Child')).toBeInTheDocument();
    });

    it('applies correct CSS class', () => {
        const { container } = render(
            <Body>
                <div>Content</div>
            </Body>
        );

        const bodyDiv = container.querySelector('.body');
        expect(bodyDiv).toBeInTheDocument();
    });

    it('renders without children', () => {
        const { container } = render(<Body />);
        const bodyDiv = container.querySelector('.body');
        expect(bodyDiv).toBeInTheDocument();
    });
});
