import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppCardContainer from './AppCardContainer';

describe('AppCardContainer', () => {
    it('renders children correctly', () => {
        render(
            <AppCardContainer>
                <div>App Card 1</div>
                <div>App Card 2</div>
            </AppCardContainer>
        );

        expect(screen.getByText('App Card 1')).toBeInTheDocument();
        expect(screen.getByText('App Card 2')).toBeInTheDocument();
    });

    it('applies correct CSS class', () => {
        const { container } = render(
            <AppCardContainer>
                <div>Content</div>
            </AppCardContainer>
        );

        const containerDiv = container.querySelector('.app-card-container');
        expect(containerDiv).toBeInTheDocument();
    });

    it('renders without children', () => {
        const { container } = render(<AppCardContainer />);
        const containerDiv = container.querySelector('.app-card-container');
        expect(containerDiv).toBeInTheDocument();
    });

    it('renders multiple app cards', () => {
        render(
            <AppCardContainer>
                <div data-testid="card-1">Card 1</div>
                <div data-testid="card-2">Card 2</div>
                <div data-testid="card-3">Card 3</div>
            </AppCardContainer>
        );

        expect(screen.getByTestId('card-1')).toBeInTheDocument();
        expect(screen.getByTestId('card-2')).toBeInTheDocument();
        expect(screen.getByTestId('card-3')).toBeInTheDocument();
    });
});
