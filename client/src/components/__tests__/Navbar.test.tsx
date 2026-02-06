import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';
import { BrowserRouter } from 'react-router-dom';

// Mock Clerk hooks
vi.mock('@clerk/clerk-react', () => ({
    useUser: () => ({
        user: {
            fullName: 'Test User',
            primaryEmailAddress: { emailAddress: 'test@example.com' },
            imageUrl: 'https://example.com/avatar.jpg'
        },
        isSignedIn: true
    }),
    useClerk: () => ({
        signOut: vi.fn()
    })
}));

describe('Navbar', () => {
    it('renders correctly', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
        // Default route is / so it should show Admin Dashboard
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
});
