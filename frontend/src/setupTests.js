import '@testing-library/jest-dom';

// Mock environment variables
if (!import.meta.env.VITE_API_URL) {
    import.meta.env.VITE_API_URL = 'http://localhost:5174';
}

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Reset mocks before each test
beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
});
