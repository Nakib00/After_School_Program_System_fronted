import api from './axiosInstance';
import { SUBJECTS } from './apiEndpoints';

export const subjectService = {
    getAll: (params) => api.get(SUBJECTS.LIST, { params }),
    create: (data) => api.post(SUBJECTS.CREATE, data),
    update: (id, data) => api.put(SUBJECTS.UPDATE(id), data),
    delete: (id) => api.delete(SUBJECTS.DELETE(id)),
};
