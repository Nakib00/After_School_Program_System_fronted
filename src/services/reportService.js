import api from './axiosInstance';
import { REPORTS } from './apiEndpoints';

export const reportService = {
    getCenterReport: (id) => api.get(REPORTS.CENTER(id)),
    getTeacherReport: (id) => api.get(REPORTS.TEACHER(id)),
    getStudentReport: (id) => api.get(REPORTS.STUDENT(id)),
    getFeesReport: (params) => api.get(REPORTS.FEES, { params }),
    getAttendanceReport: (params) => api.get(REPORTS.ATTENDANCE, { params }),
    getProgressReport: (params) => api.get(REPORTS.PROGRESS, { params }),
    getChildrenReports: () => api.get(REPORTS.PARENT_CHILDREN),
};
