import api from './axiosInstance';
import { SUBJECTS } from './apiEndpoints';

export const subjectService = {
    getAllActive: () => api.get(SUBJECTS.LIST),
    getAll: () => api.get(SUBJECTS.ALL),
    getById: (id) => api.get(SUBJECTS.DETAIL(id)),
    create: (data) => api.post(SUBJECTS.CREATE, data),
    update: (id, data) => api.put(SUBJECTS.UPDATE(id), data),
    toggleStatus: (id) => api.patch(SUBJECTS.TOGGLE(id)),
};
