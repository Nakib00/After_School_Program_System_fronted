import api from './axiosInstance';
import { DASHBOARD } from './apiEndpoints';

export const dashboardService = {
    getStats: (params) => api.get(DASHBOARD.STATS, { params }),
    getParentDashboard: () => api.get(DASHBOARD.PARENT),
    getSuperAdminStats: () => api.get(DASHBOARD.SUPER_ADMIN),
    getDashboardKpis: () => api.get(DASHBOARD.KPIS),
};
