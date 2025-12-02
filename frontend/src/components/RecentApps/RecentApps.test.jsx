import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import RecentApps from './RecentApps';

describe('RecentApps', () => {
    const mockApps = [
        {
            id: 1,
            projectName: 'App 1',
            namespace: 'default',
            createdAt: '2024-01-01T10:00:00Z'
        },
        {
            id: 2,
            projectName: 'App 2',
            namespace: 'production',
            createdAt: '2024-01-02T10:00:00Z'
        },
        {
            id: 3,
            projectName: 'App 3',
            namespace: 'staging',
            createdAt: '2024-01-03T10:00:00Z'
        }
    ];

    it('renders heading', () => {
        render(
            <MemoryRouter>
                <RecentApps apps={mockApps} />
            </MemoryRouter>
        );

        expect(screen.getByText('Son Eklenen Uygulamalar')).toBeInTheDocument();
    });

    it('shows empty state when no apps', () => {
        render(
            <MemoryRouter>
                <RecentApps apps={[]} />
            </MemoryRouter>
        );

        expect(screen.getByText('Henüz hiç uygulama eklenmemiş.')).toBeInTheDocument();
        expect(screen.getByText('İlk uygulamanı ekle →')).toBeInTheDocument();
    });

    it('shows empty state when apps is null', () => {
        render(
            <MemoryRouter>
                <RecentApps apps={null} />
            </MemoryRouter>
        );

        expect(screen.getByText('Henüz hiç uygulama eklenmemiş.')).toBeInTheDocument();
    });

    it('renders app list when apps exist', () => {
        render(
            <MemoryRouter>
                <RecentApps apps={mockApps} />
            </MemoryRouter>
        );

        expect(screen.getByText('App 1')).toBeInTheDocument();
        expect(screen.getByText('App 2')).toBeInTheDocument();
        expect(screen.getByText('App 3')).toBeInTheDocument();
    });

    it('displays namespace for each app', () => {
        render(
            <MemoryRouter>
                <RecentApps apps={mockApps} />
            </MemoryRouter>
        );

        expect(screen.getByText(/default/)).toBeInTheDocument();
        expect(screen.getByText(/production/)).toBeInTheDocument();
        expect(screen.getByText(/staging/)).toBeInTheDocument();
    });

    it('shows "Tümünü Gör" link when apps exist', () => {
        render(
            <MemoryRouter>
                <RecentApps apps={mockApps} />
            </MemoryRouter>
        );

        const viewAllLink = screen.getByText('Tümünü Gör →');
        expect(viewAllLink).toBeInTheDocument();
        expect(viewAllLink.closest('a')).toHaveAttribute('href', '/apps');
    });

    it('shows "İlk uygulamanı ekle" link in empty state', () => {
        render(
            <MemoryRouter>
                <RecentApps apps={[]} />
            </MemoryRouter>
        );

        const addAppLink = screen.getByText('İlk uygulamanı ekle →');
        expect(addAppLink.closest('a')).toHaveAttribute('href', '/newApp');
    });

    it('limits display to 5 apps', () => {
        const manyApps = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            projectName: `App ${i + 1}`,
            namespace: 'default',
            createdAt: '2024-01-01T10:00:00Z'
        }));

        render(
            <MemoryRouter>
                <RecentApps apps={manyApps} />
            </MemoryRouter>
        );

        // Should show first 5
        expect(screen.getByText('App 1')).toBeInTheDocument();
        expect(screen.getByText('App 5')).toBeInTheDocument();

        // Should not show 6th and beyond
        expect(screen.queryByText('App 6')).not.toBeInTheDocument();
        expect(screen.queryByText('App 10')).not.toBeInTheDocument();
    });

    it('renders git icons for each app', () => {
        const { container } = render(
            <MemoryRouter>
                <RecentApps apps={mockApps} />
            </MemoryRouter>
        );

        const icons = container.querySelectorAll('.icon svg');
        expect(icons).toHaveLength(3);
    });
});
