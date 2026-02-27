import api from './axiosInstance';
import { CENTERS, AUTH, STUDENTS } from './apiEndpoints';

export const adminService = {
    getCenterAdmins: (params) => api.get(CENTERS.ADMINS, { params }),
    getParents: (params) => api.get(CENTERS.PARENTS, { params }),
    registerUser: (data) => api.post(AUTH.REGISTER, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getStudents: (params) => api.get(STUDENTS.LIST, { params }),
    updateParent: (id, data) => api.post(CENTERS.PARENT_UPDATE(id), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { _method: 'PUT' }
    }),
    deleteParent: (id) => api.delete(CENTERS.PARENT_DELETE(id)),
    deleteCenterAdmin: (id) => api.delete(CENTERS.ADMIN_DELETE(id)),
};
