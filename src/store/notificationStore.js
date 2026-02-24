import { create } from 'zustand';
import { notificationService } from '../services/notificationService';

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async () => {
        // Mocking for now as backend lacks notifications
        set({ notifications: [], loading: false });
    },

    fetchUnreadCount: async () => {
        // Mocking for now as backend lacks notifications
        set({ unreadCount: 0 });
    },

    markAsRead: async (id) => {
        // No-op - backend lacks notifications
    },

    markAllAsRead: async () => {
        // No-op - backend lacks notifications
    },

    addToast: (message, type = 'success') => {
        // This could be integrated with a toast system, for now we just handle it in UI components
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}));
