import api from './axiosInstance';
import { FEES } from './apiEndpoints';

export const feeService = {
    getAll: (params) => api.get(FEES.LIST, { params }),
    generate: (data) => api.post(FEES.GENERATE, data),
    getById: (id) => api.get(FEES.DETAIL(id)),
    pay: (id, data) => api.put(FEES.PAY(id), data),
    markAllOverdue: () => api.post(FEES.MARK_OVERDUE_ALL),
    getReport: (params) => api.get(FEES.REPORT, { params }),
    getUnpaidOverdue: (params) => api.get(FEES.UNPAID_OVERDUE, { params }),
    getChildrenFees: () => api.get(FEES.PARENT_CHILDREN),
};
