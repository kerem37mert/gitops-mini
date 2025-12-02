import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
    it('renders "Başarılı" for active status', () => {
        render(<StatusBadge status="active" />);
        expect(screen.getByText('Başarılı')).toBeInTheDocument();
    });

    it('renders "Başarılı" for success status', () => {
        render(<StatusBadge status="success" />);
        expect(screen.getByText('Başarılı')).toBeInTheDocument();
    });

    it('renders "Hatalı" for failed status', () => {
        render(<StatusBadge status="failed" />);
        expect(screen.getByText('Hatalı')).toBeInTheDocument();
    });

    it('renders "Beklemede" for pending status', () => {
        render(<StatusBadge status="pending" />);
        expect(screen.getByText('Beklemede')).toBeInTheDocument();
    });

    it('renders the status as-is for unknown status', () => {
        render(<StatusBadge status="unknown" />);
        expect(screen.getByText('unknown')).toBeInTheDocument();
    });

    it('applies correct CSS classes for status', () => {
        const { container } = render(<StatusBadge status="active" />);
        const badge = container.querySelector('span');
        expect(badge).toHaveClass('badge');
        expect(badge).toHaveClass('active');
    });

    it('applies small size class by default', () => {
        const { container } = render(<StatusBadge status="active" />);
        const badge = container.querySelector('span');
        expect(badge).toHaveClass('small');
    });

    it('applies custom size class when provided', () => {
        const { container } = render(<StatusBadge status="active" size="large" />);
        const badge = container.querySelector('span');
        expect(badge).toHaveClass('large');
    });
});
