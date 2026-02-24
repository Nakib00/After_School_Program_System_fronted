import api from './axiosInstance';
import { ASSIGNMENTS } from './apiEndpoints';

export const assignmentService = {
    getAll: (params) => api.get(ASSIGNMENTS.LIST, { params }),
    getById: (id) => api.get(ASSIGNMENTS.DETAIL(id)),
    create: (data) => api.post(ASSIGNMENTS.CREATE, data),
    bulkCreate: (data) => api.post(ASSIGNMENTS.BULK_CREATE, data),
    update: (id, data) => api.put(ASSIGNMENTS.UPDATE(id), data),
    remove: (id) => api.delete(ASSIGNMENTS.DELETE(id)),
};
