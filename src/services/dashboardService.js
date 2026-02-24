import api from './axiosInstance';
import { DASHBOARD } from './apiEndpoints';

export const dashboardService = {
    getStats: (params) => api.get(DASHBOARD.STATS, { params }),
};
