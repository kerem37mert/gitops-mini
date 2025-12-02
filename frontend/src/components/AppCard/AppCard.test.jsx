import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import AppCard from './AppCard';

// Mock dependencies
vi.mock('../../../hooks/useFetch', () => ({
    useFetch: vi.fn(() => ({
        isLoading: false,
        error: null,
        data: null,
        request: vi.fn()
    }))
}));

vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('AppCard', () => {
    const mockData = {
        id: 1,
        projectName: 'Test Project',
        repoURL: 'https://github.com/test/repo',
        branchName: 'main',
        namespace: 'default',
        syncCount: 5,
        lastSync: '2024-01-01T10:00:00Z',
        status: 'active'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders project name', () => {
        render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('renders repository URL', () => {
        render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        expect(screen.getByText('https://github.com/test/repo')).toBeInTheDocument();
    });

    it('renders branch name', () => {
        render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        expect(screen.getByText('main')).toBeInTheDocument();
    });

    it('renders namespace', () => {
        render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        expect(screen.getByText('default')).toBeInTheDocument();
    });

    it('renders sync count', () => {
        render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows "Henüz yok" when no last sync', () => {
        const dataWithoutSync = { ...mockData, lastSync: null };

        render(
            <MemoryRouter>
                <AppCard data={dataWithoutSync} />
            </MemoryRouter>
        );

        expect(screen.getByText('Henüz yok')).toBeInTheDocument();
    });

    it('renders SYNC button', () => {
        render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        expect(screen.getByText('SYNC')).toBeInTheDocument();
    });

    it('renders remove button', () => {
        const { container } = render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        const removeButton = container.querySelector('.btn-cancel');
        expect(removeButton).toBeInTheDocument();
    });

    it('navigates to app detail on card click', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        const card = container.querySelector('.app-card');
        await user.click(card);

        expect(mockNavigate).toHaveBeenCalledWith('/apps/1');
    });

    it('applies status-based CSS class', () => {
        const { container } = render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        const card = container.querySelector('.app-card');
        expect(card).toHaveClass('status-active');
    });

    it('shows default sync count of 0 when not provided', () => {
        const dataWithoutSyncCount = { ...mockData, syncCount: undefined };

        render(
            <MemoryRouter>
                <AppCard data={dataWithoutSyncCount} />
            </MemoryRouter>
        );

        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders git icon', () => {
        const { container } = render(
            <MemoryRouter>
                <AppCard data={mockData} />
            </MemoryRouter>
        );

        const gitIcon = container.querySelector('.git-icon');
        expect(gitIcon).toBeInTheDocument();
    });
});
