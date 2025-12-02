import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Header from './Header';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock fetch and navigate
global.fetch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockNavigate.mockClear();
    });

    it('renders logo/title', async () => {
        localStorage.getItem.mockReturnValue(null);

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('GitOPS Mini')).toBeInTheDocument();
        });
    });

    it('renders navigation links', async () => {
        localStorage.getItem.mockReturnValue(null);

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
            expect(screen.getByText('Yeni Proje')).toBeInTheDocument();
            expect(screen.getByText('Uygulamalar')).toBeInTheDocument();
        });
    });

    it('displays username when user is logged in', async () => {
        const mockToken = 'valid-token';
        const mockUser = { username: 'testuser', role: 'user' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
        });
    });

    it('shows SUPER badge for superuser', async () => {
        const mockToken = 'valid-token';
        const mockSuperuser = { username: 'admin', role: 'superuser' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockSuperuser })
        });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('admin')).toBeInTheDocument();
            expect(screen.getByText('SUPER')).toBeInTheDocument();
        });
    });

    it('shows Users link for superuser', async () => {
        const mockToken = 'valid-token';
        const mockSuperuser = { username: 'admin', role: 'superuser' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockSuperuser })
        });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Kullanıcılar')).toBeInTheDocument();
        });
    });

    it('does not show Users link for regular user', async () => {
        const mockToken = 'valid-token';
        const mockUser = { username: 'testuser', role: 'user' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
        });

        expect(screen.queryByText('Kullanıcılar')).not.toBeInTheDocument();
    });

    it('shows logout button when user is logged in', async () => {
        const mockToken = 'valid-token';
        const mockUser = { username: 'testuser', role: 'user' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Çıkış')).toBeInTheDocument();
        });
    });

    it('handles logout click', async () => {
        const user = userEvent.setup();
        const mockToken = 'valid-token';
        const mockUser = { username: 'testuser', role: 'user' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Çıkış')).toBeInTheDocument();
        });

        const logoutButton = screen.getByText('Çıkış');
        await user.click(logoutButton);

        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('does not show user section when not logged in', async () => {
        localStorage.getItem.mockReturnValue(null);

        render(
            <MemoryRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('GitOPS Mini')).toBeInTheDocument();
        });

        expect(screen.queryByText('Çıkış')).not.toBeInTheDocument();
    });
});
