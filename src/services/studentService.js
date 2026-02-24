import api from './axiosInstance';
import { STUDENTS } from './apiEndpoints';

export const studentService = {
    getAll: (params) => api.get(STUDENTS.LIST, { params }),
    getById: (id) => api.get(STUDENTS.DETAIL(id)),
    create: (data) => api.post(STUDENTS.CREATE, data),
    update: (id, data) => api.put(STUDENTS.UPDATE(id), data),
    remove: (id) => api.delete(STUDENTS.DELETE(id)),
    getProgress: (id) => api.get(STUDENTS.PROGRESS(id)),
    getAssignments: (id, params) => api.get(STUDENTS.ASSIGNMENTS(id), { params }),
    getAttendance: (id, params) => api.get(STUDENTS.ATTENDANCE(id), { params }),
    getFees: (id) => api.get(STUDENTS.FEES(id)),
};
