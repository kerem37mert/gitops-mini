import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        css: {
            modules: {
                classNameStrategy: 'non-scoped'
            }
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/setupTests.js',
                '**/*.config.js',
                '**/main.jsx',
                '**/index.css'
            ]
        }
    }
});
