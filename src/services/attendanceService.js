import api from './axiosInstance';
import { ATTENDANCE } from './apiEndpoints';

export const attendanceService = {
    getAll: (params) => api.get(ATTENDANCE.LIST, { params }),
    mark: (data) => api.post(ATTENDANCE.MARK, data),
    update: (id, data) => api.put(ATTENDANCE.UPDATE(id), data),
    getReport: (params) => api.get(ATTENDANCE.REPORT, { params }),
    getToday: (params) => api.get(ATTENDANCE.TODAY, { params }),
};
