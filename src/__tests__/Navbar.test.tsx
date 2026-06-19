import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { vi } from 'vitest';

// Mock the App context to avoid auth errors during UI testing
vi.mock('../context/AppConext', () => ({
    useApp: () => ({
        user: null, // Simulate logged-out state
        logout: vi.fn(),
    })
}));

// We need to mock i18next to observe changes
const changeLanguageMock = vi.fn();

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { 
            language: 'en',
            changeLanguage: changeLanguageMock
        }
    })
}));

describe('Navbar Component', () => {
    it('renders the brand logo and name', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        expect(screen.getByText('Rank Pilot')).toBeInTheDocument();
    });

    it('toggles language when the language button is clicked', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Find the language button. It displays 'ع' when language is 'en'
        // We use getAllByText because there are two buttons (desktop and mobile)
        const langButtons = screen.getAllByText('ع');
        expect(langButtons[0]).toBeInTheDocument();

        // Click the first one
        fireEvent.click(langButtons[0]);

        // Verify that i18n.changeLanguage was called with 'ar'
        expect(changeLanguageMock).toHaveBeenCalledWith('ar');
    });
});
