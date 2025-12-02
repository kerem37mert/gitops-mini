import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock fetch
global.fetch = vi.fn();

// Test component to use the hook
const TestComponent = () => {
    const { user, token, loading, isSuperuser } = useAuth();

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div data-testid="user">{user ? user.username : 'No user'}</div>
            <div data-testid="token">{token || 'No token'}</div>
            <div data-testid="is-superuser">{isSuperuser() ? 'Yes' : 'No'}</div>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
        localStorage.clear();
        global.fetch.mockClear();
    });

    it('throws error when useAuth is used outside AuthProvider', () => {
        // Suppress console.error for this test
        const originalError = console.error;
        console.error = vi.fn();

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useAuth must be used within AuthProvider');

        console.error = originalError;
    });

    it('initializes with no user when no token in localStorage', async () => {
        localStorage.getItem.mockReturnValue(null);

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('No user');
            expect(screen.getByTestId('token')).toHaveTextContent('No token');
        });
    });

    it('fetches current user when token exists in localStorage', async () => {
        const mockToken = 'test-token';
        const mockUser = { username: 'testuser', role: 'user' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('testuser');
            expect(screen.getByTestId('token')).toHaveTextContent(mockToken);
        });

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/auth/me'),
            expect.objectContaining({
                headers: {
                    'Authorization': `Bearer ${mockToken}`
                }
            })
        );
    });

    it('identifies superuser correctly', async () => {
        const mockToken = 'test-token';
        const mockSuperuser = { username: 'admin', role: 'superuser' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockSuperuser })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('is-superuser')).toHaveTextContent('Yes');
        });
    });

    it('identifies regular user correctly', async () => {
        const mockToken = 'test-token';
        const mockUser = { username: 'testuser', role: 'user' };

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('is-superuser')).toHaveTextContent('No');
        });
    });

    it('logs out user when token is invalid', async () => {
        const mockToken = 'invalid-token';

        localStorage.getItem.mockReturnValue(mockToken);
        global.fetch.mockResolvedValueOnce({
            ok: false
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('No user');
            expect(screen.getByTestId('token')).toHaveTextContent('No token');
        });

        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
});
