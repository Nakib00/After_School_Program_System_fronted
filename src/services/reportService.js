import api from './axiosInstance';
import { REPORTS } from './apiEndpoints';

export const reportService = {
    getCenterPerformance: (params) => api.get(REPORTS.CENTER_PERFORMANCE, { params }),
    getTeacherPerformance: (params) => api.get(REPORTS.TEACHER_PERFORMANCE, { params }),
    getStudentDetailedReport: (id) => api.get(REPORTS.STUDENT_DETAILED(id)),
    getFeeCollectionReport: (params) => api.get(REPORTS.FEE_COLLECTION, { params }),
    getAttendanceReport: (params) => api.get(REPORTS.ATTENDANCE_REPORT, { params }),
    getLevelProgressionReport: (params) => api.get(REPORTS.LEVEL_PROGRESSION, { params }),
    getFullSystemReport: () => api.get(REPORTS.FULL_SYSTEM),
};
