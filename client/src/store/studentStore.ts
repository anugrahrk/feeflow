import { create } from 'zustand';
import api from '../api/axios';

interface Student {
    _id: string;
    studentName: string; // Changed from name
    email: string;
    role: 'student';
    organizationId?: string;
    mobileNumber?: string; // Changed from mobile
    feeRecurringDate: string; // ISO Date string from API
    amount: number;
    isEnabled: boolean;
}

interface StudentState {
    students: Student[];
    currentStudent: Student | null;
    monthlyStats: any | null;
    chartData: any | null;
    transactions: any[];
    isLoading: boolean;
    error: string | null;

    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        startIndex: number;
        endIndex: number;
    } | null;

    transactionPagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        startIndex: number;
        endIndex: number;
    } | null;

    // For student dashboard
    studentProfile: Student | null;
    outstandingBalance: number;

    fetchStudents: (params?: any) => Promise<void>;
    fetchStudentProfile: () => Promise<void>;
    registerStudent: (studentData: any) => Promise<void>;
    updateStudent: (id: string, data: any) => Promise<void>;
    toggleStatus: (id: string) => Promise<void>;
    sendReminder: (id: string) => Promise<void>;
    fetchMonthlyStats: () => Promise<void>;
    fetchChartData: () => Promise<void>;
    fetchTransactions: (params?: any) => Promise<void>;
    fetchMyTransactions: () => Promise<void>;

    pendingCount: number;
    fetchPendingCount: () => Promise<void>;
    sendBulkReminders: () => Promise<any>;
}

export const useStudentStore = create<StudentState>((set, get) => ({
    students: [],
    currentStudent: null,
    monthlyStats: null,
    chartData: null,
    transactions: [],
    isLoading: false,
    error: null,
    pagination: null,
    transactionPagination: null,
    studentProfile: null,
    outstandingBalance: 0,

    fetchStudents: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/admin/students', { params });
            // adminController.ts getStudents returns { data: [], pagination: ... }
            const { data, pagination } = response.data;
            set({ students: data || [], pagination: pagination || null, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch students', isLoading: false });
        }
    },

    registerStudent: async (studentData) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/api/admin/students', studentData);
            // Refresh stats after adding student
            await get().fetchMonthlyStats();
            await get().fetchChartData();
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to register student', isLoading: false });
            throw error;
        }
    },

    updateStudent: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/api/admin/students/${id}`, data);
            set(state => ({
                students: state.students.map(s => s._id === id ? response.data : s),
                isLoading: false
            }));
            // Refresh stats on update too, just in case amounts changed
            await get().fetchMonthlyStats();
            await get().fetchChartData();
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update student', isLoading: false });
            throw error;
        }
    },

    toggleStatus: async (id) => {
        try {
            const student = get().students.find(s => s._id === id);
            if (!student) return;
            const newStatus = !student.isEnabled;

            const response = await api.patch(`/api/admin/students/${id}/status`, { isEnabled: newStatus });
            set(state => ({
                students: state.students.map(s => s._id === id ? response.data : s)
            }));
        } catch (error: any) {
            console.error("Failed to toggle status:", error);
            throw error;
        }
    },

    sendReminder: async (id) => {
        try {
            await api.post(`/api/admin/students/reminder/${id}`);
        } catch (error: any) {
            console.error("Failed to send reminder:", error);
            throw error;
        }
    },

    fetchStudentProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/student/profile');
            // response: { student, outstandingBalance, ... }
            set({
                studentProfile: response.data.student,
                outstandingBalance: response.data.outstandingBalance,
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch profile', isLoading: false });
        }
    },

    fetchMonthlyStats: async () => {
        try {
            const response = await api.get('/api/admin/stats/monthly');
            set({ monthlyStats: response.data });
        } catch (error: any) {
            // console.error("Failed to fetch monthly stats", error);
        }
    },

    fetchChartData: async () => {
        try {
            const response = await api.get('/api/admin/stats/chart');
            const apiData = response.data || [];

            // Logic: Always show 6 months (current + 5 previous). 
            // If data exists, use it. If not, 0.

            const result = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthName = d.toLocaleString('default', { month: 'short' });
                const existing = apiData.find((item: any) => item.name.slice(0, 3) === monthName);
                if (existing) {
                    result.push({ name: monthName, value: existing.value });
                } else {
                    result.push({ name: monthName, value: 0 });
                }
            }
            set({ chartData: result });
        } catch (error: any) {
            set({ chartData: [] });
        }
    },

    fetchTransactions: async (params) => {
        set({ isLoading: true });
        try {
            const response = await api.get('/api/admin/transactions', { params });

            const { data, pagination } = response.data;
            if (Array.isArray(response.data)) {
                set({ transactions: response.data, isLoading: false, transactionPagination: null });
            } else {
                set({ transactions: data || [], transactionPagination: pagination || null, isLoading: false });
            }
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch transactions', isLoading: false });
        }
    },

    fetchMyTransactions: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/api/student/transactions');
            set({ transactions: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch my transactions', isLoading: false });
        }
    },

    pendingCount: 0,

    fetchPendingCount: async () => {
        try {
            const response = await api.get('/api/admin/students/pending-count');
            set({ pendingCount: response.data.count });
        } catch (error: any) {
            console.error("Failed to fetch pending count", error);
        }
    },

    sendBulkReminders: async () => {
        try {
            const response = await api.post('/api/admin/students/reminder-all');
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }
}));
