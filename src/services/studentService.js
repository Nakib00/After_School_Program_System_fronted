import api from './axiosInstance';
import { STUDENTS } from './apiEndpoints';

export const studentService = {
    getAll: (params) => api.get(STUDENTS.LIST, { params }),
    getById: (id) => api.get(STUDENTS.DETAIL(id)),
    create: (formData) => api.post(STUDENTS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.post(`${STUDENTS.UPDATE(id)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { _method: 'PUT' } // Laravel trick to support multipart with PUT
    }),
    delete: (id) => api.delete(STUDENTS.DELETE(id)),
    getAssignments: (id) => api.get(STUDENTS.ASSIGNMENTS(id)),
    getMyAssignments: () => api.get(STUDENTS.MY_ASSIGNMENTS),
    getAttendance: (id) => api.get(STUDENTS.ATTENDANCE(id)),
    getFees: (id) => api.get(STUDENTS.FEES(id)),
    getProgress: (id) => api.get(STUDENTS.PROGRESS(id)),
    getDashboard: () => api.get(STUDENTS.DASHBOARD),
    getReports: (id) => api.get(STUDENTS.REPORTS(id)),
};
