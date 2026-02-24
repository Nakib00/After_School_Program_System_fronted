import api from './axiosInstance';
import { LEVELS } from './apiEndpoints';

export const levelService = {
    getAll: () => api.get(LEVELS.LIST),
    getById: (id) => api.get(LEVELS.DETAIL(id)),
    create: (data) => api.post(LEVELS.CREATE, data),
    update: (id, data) => api.put(LEVELS.UPDATE(id), data),
    delete: (id) => api.delete(LEVELS.DELETE(id)),
};
