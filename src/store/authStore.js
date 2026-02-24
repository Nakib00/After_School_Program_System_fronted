import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isInitializing: !!localStorage.getItem('token'),

    login: async (email, password) => {
        try {
            const { data: response } = await authService.login({ email, password });
            // response is { status, message, data: { user, token } }
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isInitializing: false });
            return user;
        } catch (error) {
            console.error('[Login Error]', error);
            set({ isInitializing: false });
            throw error;
        }
    },

    logout: async () => {
        try { await authService.logout(); } catch (_) { }
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
    },

    fetchMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ user: null, isAuthenticated: false, isInitializing: false });
            return null;
        }

        try {
            set({ isInitializing: true });
            const { data: response } = await authService.me();
            console.log('[Fetch Me Success]', response);
            // The backend consistently wraps data in a 'data' property
            const userData = response.data || response;
            set({ user: userData, isAuthenticated: true, isInitializing: false });
            return userData;
        } catch (error) {
            console.error('[Fetch Me Error]', error);
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
            throw error;
        }
    },

    setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, isInitializing: false });
    }
}));
