import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';
import { FaUsers } from 'react-icons/fa';

describe('StatCard', () => {
    it('renders title and value', () => {
        render(<StatCard title="Total Users" value="42" />);
        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with icon when provided', () => {
        const { container } = render(
            <StatCard title="Users" value="10" icon={FaUsers} />
        );
        // Check if icon container exists
        const iconDiv = container.querySelector('.icon');
        expect(iconDiv).toBeInTheDocument();
        expect(iconDiv.querySelector('svg')).toBeInTheDocument();
    });

    it('renders without icon when not provided', () => {
        const { container } = render(
            <StatCard title="Users" value="10" />
        );
        const iconDiv = container.querySelector('.icon');
        expect(iconDiv).toBeInTheDocument();
        expect(iconDiv.querySelector('svg')).not.toBeInTheDocument();
    });

    it('applies default primary color class', () => {
        const { container } = render(
            <StatCard title="Test" value="5" />
        );
        const card = container.querySelector('.stat-card');
        expect(card).toHaveClass('primary');
    });

    it('applies custom color class when provided', () => {
        const { container } = render(
            <StatCard title="Test" value="5" color="secondary" />
        );
        const card = container.querySelector('.stat-card');
        expect(card).toHaveClass('secondary');
    });

    it('renders numeric values correctly', () => {
        render(<StatCard title="Count" value={100} />);
        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('renders string values correctly', () => {
        render(<StatCard title="Status" value="Active" />);
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
        const { container } = render(
            <StatCard title="Test" value="123" color="danger" />
        );
        const card = container.querySelector('.stat-card');
        expect(card).toHaveClass('stat-card');
        expect(card).toHaveClass('danger');
    });
});
