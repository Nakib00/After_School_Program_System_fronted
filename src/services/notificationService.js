import api from './axiosInstance';
import { NOTIFICATIONS } from './apiEndpoints';

export const notificationService = {
    getAll: (params) => api.get(NOTIFICATIONS.LIST, { params }),
    getUnreadCount: () => api.get(NOTIFICATIONS.UNREAD_COUNT),
    markAsRead: (id) => api.put(NOTIFICATIONS.MARK_READ(id)),
    markAllAsRead: () => api.put(NOTIFICATIONS.MARK_ALL),
    remove: (id) => api.delete(NOTIFICATIONS.DELETE(id)),
};
