import api from './axiosInstance';
import { ATTENDANCE } from './apiEndpoints';

export const attendanceService = {
    getAll: (params) => api.get(ATTENDANCE.LIST, { params }),
    markBulk: (data) => api.post(ATTENDANCE.MARK_BULK, data),
    update: (id, data) => api.put(ATTENDANCE.UPDATE(id), data),
    getSummary: (params) => api.get(ATTENDANCE.SUMMARY, { params }),
    getToday: (params) => api.get(ATTENDANCE.TODAY, { params }),
};
