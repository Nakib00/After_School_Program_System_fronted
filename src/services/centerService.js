import api from './axiosInstance';
import { CENTERS } from './apiEndpoints';

export const centerService = {
    getAll: (params) => api.get(CENTERS.LIST, { params }),
    getById: (id) => api.get(CENTERS.DETAIL(id)),
    create: (data) => api.post(CENTERS.CREATE, data),
    update: (id, data) => api.put(CENTERS.UPDATE(id), data),
    delete: (id) => api.delete(CENTERS.DELETE(id)),
    getStats: (id) => api.get(CENTERS.STATS(id)),
};
