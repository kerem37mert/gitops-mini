import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock fetch for AuthContext
global.fetch = vi.fn();

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('shows loading state while checking authentication', () => {
        localStorage.getItem.mockReturnValue('test-token');
        global.fetch.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(
            <MemoryRouter>
                <AuthProvider>
                    <ProtectedRoute>
                        <div>Protected Content</div>
                    </ProtectedRoute>
                </AuthProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('redirects to login when user is not authenticated', async () => {
        localStorage.getItem.mockReturnValue(null);

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/protected" element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        } />
                        <Route path="/login" element={<div>Login Page</div>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Login Page')).toBeInTheDocument();
        });
    });

    it('renders children when user is authenticated', async () => {
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
                    <ProtectedRoute>
                        <div>Protected Content</div>
                    </ProtectedRoute>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Protected Content')).toBeInTheDocument();
        });
    });

    it('allows superuser to access superuser-required routes', async () => {
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
                    <ProtectedRoute requireSuperuser={true}>
                        <div>Admin Panel</div>
                    </ProtectedRoute>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Admin Panel')).toBeInTheDocument();
        });
    });

    it('redirects regular user from superuser-required routes', async () => {
        const mockToken = 'valid-token';
        const mockUser = { username: 'regularuser', role: 'user' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <AuthProvider>
                    <Routes>
                        <Route path="/admin" element={
                            <ProtectedRoute requireSuperuser={true}>
                                <div>Admin Panel</div>
                            </ProtectedRoute>
                        } />
                        <Route path="/" element={<div>Home Page</div>} />
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });
    });

    it('works without requireSuperuser prop', async () => {
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
                    <ProtectedRoute>
                        <div>Regular Content</div>
                    </ProtectedRoute>
                </AuthProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Regular Content')).toBeInTheDocument();
        });
    });
});
