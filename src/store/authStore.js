import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (email, password) => {
        try {
            const { data: response } = await authService.login({ email, password });
            // response is { status, message, data: { user, token } }
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true });
            return user;
        } catch (error) {
            console.error('[Login Error]', error);
            throw error;
        }
    },

    logout: async () => {
        try { await authService.logout(); } catch (_) { }
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    fetchMe: async () => {
        try {
            const { data } = await authService.me();
            set({ user: data, isAuthenticated: true });
            return data;
        } catch (error) {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false });
            throw error;
        }
    },

    setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
    }
}));
