import api from './axiosInstance';
import { TEACHERS } from './apiEndpoints';

export const teacherService = {
    getAll: (params) => api.get(TEACHERS.LIST, { params }),
    getById: (id) => api.get(TEACHERS.DETAIL(id)),
    create: (formData) => api.post(TEACHERS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.post(`${TEACHERS.UPDATE(id)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { _method: 'PUT' } // Laravel trick to support multipart with PUT
    }),
    getStudents: (id) => api.get(TEACHERS.STUDENTS(id)),
    assignStudents: (data) => api.post(TEACHERS.ASSIGN_STUDENTS, data),
    unassignStudents: (data) => api.post(TEACHERS.UNASSIGN_STUDENTS, data),
    delete: (id) => api.delete(TEACHERS.DETAIL(id)),
    getDashboardStats: () => api.get(TEACHERS.DASHBOARD),
};
