import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { vi } from 'vitest';

// Mock the translations so we don't need real i18next initialized here
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' }
    })
}));

describe('Landing Page', () => {
    it('renders the hero section correctly', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        
        // Since we mocked useTranslation to return the key itself, 
        // we can check if the translation keys are present in the document.
        expect(screen.getByText(/hero\.title1/i)).toBeInTheDocument();
        expect(screen.getByText('hero.subtitle')).toBeInTheDocument();
    });

    it('renders the call to action buttons', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        // Check for the Analyze button (key: hero.analyzeBtn)
        const analyzeBtn = screen.getByText('hero.analyzeBtn');
        expect(analyzeBtn).toBeInTheDocument();
    });
});
