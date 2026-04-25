import { create } from 'zustand';
import api from '../api/axios';

interface Org {
    _id: string;
    orgName: string;
    ownerName: string;
    email: string;
    mobileNumber: string;
    isEnabled: boolean; // mapped from status in frontend logic if needed, but easier to use raw
    createdAt?: string;
    avatarBg?: string; // frontend ui
    initials?: string; // frontend ui
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
}

interface OrgState {
    organizations: Org[];
    suggestions: Org[]; // For search dropdown
    pagination: Pagination | null;
    stats: {
        total: number;
        active: number;
        disabled: number;
    };
    isLoading: boolean;
    error: string | null;

    fetchOrganizations: (page?: number, search?: string) => Promise<void>;
    fetchSuggestions: (query: string) => Promise<void>;
    fetchStats: () => Promise<void>;
    addOrganization: (orgData: any) => Promise<void>;
    updateOrganization: (id: string, orgData: any) => Promise<void>;
    toggleStatus: (id: string) => Promise<void>;
}

export const useOrgStore = create<OrgState>((set, get) => ({
    organizations: [],
    suggestions: [],
    pagination: null,
    stats: { total: 0, active: 0, disabled: 0 },
    isLoading: false,
    error: null,

    fetchOrganizations: async (page = 1, search = '') => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/api/su/organizations?page=${page}&search=${search}`);
            // response.data structure: { data: Org[], pagination: Pagination }
            const { data, pagination } = response.data;

            set({ organizations: data || [], pagination, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch organizations', isLoading: false });
        }
    },

    fetchSuggestions: async (query: string) => {
        if (!query) {
            set({ suggestions: [] });
            return;
        }
        try {
            const response = await api.get(`/api/su/organizations?search=${query}&limit=5`);
            const { data } = response.data;
            set({ suggestions: data || [] });
        } catch (error: any) {
            console.error("Failed to fetch suggestions", error);
            set({ suggestions: [] });
        }
    },

    fetchStats: async () => {
        try {
            const response = await api.get('/api/su/organizations/stats');
            set({ stats: response.data });
        } catch (error: any) {
            console.error("Failed to fetch stats:", error);
            // Fallback: calculate from current list if API fails
            const { organizations } = get();
            set({
                stats: {
                    total: organizations.length,
                    active: organizations.filter(o => o.isEnabled).length,
                    disabled: organizations.filter(o => !o.isEnabled).length
                }
            });
        }
    },

    addOrganization: async (orgData) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/api/su/organizations', orgData);
            // Re-fetch everything to ensure consistent state (pagination, stats, etc.)
            await get().fetchOrganizations(1);
            await get().fetchStats();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to add organization', isLoading: false });
            throw error;
        }
    },

    updateOrganization: async (id, orgData) => {
        set({ isLoading: true, error: null });
        try {
            await api.put(`/api/su/organizations/${id}`, orgData);
            // Refresh current page
            const currentPage = get().pagination?.page || 1;
            await get().fetchOrganizations(currentPage);
            await get().fetchStats();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update organization', isLoading: false });
            throw error;
        }
    },

    toggleStatus: async (id) => {
        set({ isLoading: true, error: null });
        try {
            // We need to know current status to toggle
            // But here we rely on backend response.
            // The backend endpoint is PATCH /:id/status and expects { isEnabled: boolean } in body.
            // Let's find the org first to know current state.
            const org = get().organizations.find(o => o._id === id);
            if (!org) throw new Error("Organization not found locally");

            const newStatus = !org.isEnabled;

            await api.patch(`/api/su/organizations/${id}/status`, { isEnabled: newStatus });

            // Refresh current page and stats
            const currentPage = get().pagination?.page || 1;
            await get().fetchOrganizations(currentPage);
            await get().fetchStats();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to toggle status', isLoading: false });
            throw error;
        }
    }
}));
