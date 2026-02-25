import { create } from 'zustand';
import { authService } from '../services/authService';

const getInitialState = () => {
    try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        console.log('[AuthStore] Rehydrating state:', {
            hasToken: !!token,
            hasUser: !!user,
            role: user?.role,
            center_id: user?.center_id
        });

        return {
            user,
            token,
            isAuthenticated: !!token && !!user,
            // Only block if we have a token but no user data yet
            isInitializing: !!token && !user
        };
    } catch (error) {
        console.error('[AuthStore] Initial state error:', error);
        localStorage.removeItem('user');
        return { user: null, token: null, isAuthenticated: false, isInitializing: false };
    }
};

const initialState = getInitialState();

export const useAuthStore = create((set, get) => ({
    ...initialState,

    login: async (email, password) => {
        try {
            const { data: response } = await authService.login({ email, password });
            const { user, token } = response.data;

            const normalizedUser = {
                ...user,
                role: user.role === 'parent' ? 'parents' : user.role,
                center_id: user.center?.id || user.student?.center_id || user.center_id
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            set({ user: normalizedUser, token, isAuthenticated: true, isInitializing: false });
            return normalizedUser;
        } catch (error) {
            console.error('[Login Error]', error);
            set({ isInitializing: false });
            throw error;
        }
    },

    logout: async () => {
        try { await authService.logout(); } catch (_) { }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
    },

    fetchMe: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ user: null, isAuthenticated: false, isInitializing: false });
            return null;
        }

        try {
            // Only set loading if we don't have a user yet
            if (!get().user) {
                set({ isInitializing: true });
            }

            const { data: response } = await authService.me();
            const userData = response.data || response;
            const currentUser = get().user;

            const normalizedUser = {
                ...(currentUser || {}),
                ...userData,
                role: userData.role === 'parent' ? 'parents' : (userData.role || currentUser?.role),
                center_id: userData.center?.id || userData.student?.center_id || userData.center_id || currentUser?.center_id
            };

            localStorage.setItem('user', JSON.stringify(normalizedUser));
            console.log('[AuthStore] fetchMe success, session preserved for:', normalizedUser.name);
            set({ user: normalizedUser, isAuthenticated: true, isInitializing: false });
            return normalizedUser;
        } catch (error) {
            console.error('[AuthStore] fetchMe error:', error.response?.status, error.message);
            // If the token is invalid (401/403), clear everything
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.warn('[AuthStore] Session invalid, clearing storage');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
            } else {
                // For other errors (network etc.), keep the cached user but stop initializing
                set({ isInitializing: false });
            }
            throw error;
        }
    },

    setAuth: (user, token) => {
        const normalizedUser = {
            ...user,
            role: user.role === 'parent' ? 'parents' : user.role,
            center_id: user.center?.id || user.student?.center_id || user.center_id
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        set({ user: normalizedUser, token, isAuthenticated: true, isInitializing: false });
    }
}));
