import api from './axiosInstance';
import { FEES } from './apiEndpoints';

export const feeService = {
    getAll: (params) => api.get(FEES.LIST, { params }),
    generate: (data) => api.post(FEES.GENERATE, data),
    getById: (id) => api.get(FEES.DETAIL(id)),
    pay: (id, data) => api.post(FEES.PAY(id), data),
    markOverdue: (id) => api.post(FEES.OVERDUE(id)),
    getReport: (params) => api.get(FEES.REPORT, { params }),
    getPending: (params) => api.get(FEES.PENDING, { params }),
};
