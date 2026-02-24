import api from './axiosInstance';
import { CENTERS, AUTH } from './apiEndpoints';

export const adminService = {
    getCenterAdmins: () => api.get(CENTERS.ADMINS),
    getParents: () => api.get(CENTERS.PARENTS),
    registerUser: (data) => api.post(AUTH.REGISTER, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};
