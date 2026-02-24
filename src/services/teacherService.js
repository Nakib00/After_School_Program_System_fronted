import api from './axiosInstance';
import { TEACHERS } from './apiEndpoints';

export const teacherService = {
    getAll: (params) => api.get(TEACHERS.LIST, { params }),
    getById: (id) => api.get(TEACHERS.DETAIL(id)),
    create: (data) => api.post(TEACHERS.CREATE, data),
    update: (id, data) => api.put(TEACHERS.UPDATE(id), data),
    getStudents: (id) => api.get(TEACHERS.STUDENTS(id)),
    assignStudents: (id, studentIds) => api.post(TEACHERS.ASSIGN_STUDENTS(id), { student_ids: studentIds }),
};
