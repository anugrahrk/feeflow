import { create } from 'zustand';
import api from '../api/axios';

interface UserState {
    user: any | null;
    role: string | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: (token: string) => Promise<string | null>; // Returns role
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    role: null,
    isLoading: false,
    error: null,

    fetchProfile: async (_token: string) => {
        set({ isLoading: true, error: null });
        try {
            // Token is now handled by AxiosInterceptor automatically
            const response = await api.get('/api/auth/me');
            const { role, user } = response.data;

            // Should be structured as { role: '...', user: { ... } } based on server docs
            // Server docs say: GET /me returns current logged-in user's role and details.

            set({ user, role, isLoading: false });
            return role;
        } catch (error: any) {
            console.error("Failed to fetch profile:", error);
            set({
                error: error.response?.data?.message || 'Failed to fetch profile',
                isLoading: false,
                role: null,
                user: null
            });
            return null;
        }
    },

    logout: () => {
        set({ user: null, role: null, error: null });
    }
}));
