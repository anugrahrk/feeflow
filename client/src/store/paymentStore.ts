import { create } from 'zustand';
import api from '../api/axios';

interface PaymentState {
    isLoading: boolean;
    error: string | null;
    paymentStatus: { paid: boolean; message: string } | null;

    createOrder: (studentId: string, amount: number) => Promise<any>;
    verifyPayment: (paymentData: any) => Promise<boolean>;
    fetchPaymentStatus: (studentId: string) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
    isLoading: false,
    error: null,
    paymentStatus: null,

    createOrder: async (studentId, amount) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/payments/create-order', { studentId, amount });
            set({ isLoading: false });
            return response.data;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to create order', isLoading: false });
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/payments/verify-payment', paymentData);
            set({ isLoading: false });
            return response.data.success;
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Payment verification failed', isLoading: false });
            return false;
        }
    },

    fetchPaymentStatus: async (studentId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/payments/payment-status/${studentId}`);
            set({ paymentStatus: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch payment status', isLoading: false });
        }
    }
}));
