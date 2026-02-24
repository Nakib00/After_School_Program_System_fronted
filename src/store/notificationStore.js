import { create } from 'zustand';
import { notificationService } from '../services/notificationService';

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,

    fetchNotifications: async () => {
        set({ loading: true });
        try {
            const { data } = await notificationService.getAll();
            set({ notifications: data, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const { data } = await notificationService.getUnreadCount();
            set({ unreadCount: data.count });
        } catch (error) { }
    },

    markAsRead: async (id) => {
        try {
            await notificationService.markAsRead(id);
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, read_at: new Date().toISOString() } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));
        } catch (error) { }
    },

    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead();
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read_at: new Date().toISOString() })),
                unreadCount: 0,
            }));
        } catch (error) { }
    },

    addToast: (message, type = 'success') => {
        // This could be integrated with a toast system, for now we just handle it in UI components
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}));
