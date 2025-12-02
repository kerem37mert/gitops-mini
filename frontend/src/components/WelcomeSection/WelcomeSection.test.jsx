import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import WelcomeSection from './WelcomeSection';

describe('WelcomeSection', () => {
    it('renders welcome title', () => {
        render(
            <MemoryRouter>
                <WelcomeSection />
            </MemoryRouter>
        );

        expect(screen.getByText("GitOps Mini'ye Hoş Geldin")).toBeInTheDocument();
    });

    it('renders description text', () => {
        render(
            <MemoryRouter>
                <WelcomeSection />
            </MemoryRouter>
        );

        expect(screen.getByText(/Kubernetes uygulamalarını Git repository'lerinden/i)).toBeInTheDocument();
    });

    it('renders "Yeni Uygulama Ekle" link', () => {
        render(
            <MemoryRouter>
                <WelcomeSection />
            </MemoryRouter>
        );

        const newAppLink = screen.getByText('Yeni Uygulama Ekle');
        expect(newAppLink).toBeInTheDocument();
        expect(newAppLink.closest('a')).toHaveAttribute('href', '/newApp');
    });

    it('renders "Uygulamalarımı Gör" link', () => {
        render(
            <MemoryRouter>
                <WelcomeSection />
            </MemoryRouter>
        );

        const appsLink = screen.getByText('Uygulamalarımı Gör');
        expect(appsLink).toBeInTheDocument();
        expect(appsLink.closest('a')).toHaveAttribute('href', '/apps');
    });

    it('applies correct CSS classes', () => {
        const { container } = render(
            <MemoryRouter>
                <WelcomeSection />
            </MemoryRouter>
        );

        expect(container.querySelector('.welcome')).toBeInTheDocument();
        expect(container.querySelector('.content')).toBeInTheDocument();
        expect(container.querySelector('.title')).toBeInTheDocument();
        expect(container.querySelector('.description')).toBeInTheDocument();
        expect(container.querySelector('.actions')).toBeInTheDocument();
    });
});
