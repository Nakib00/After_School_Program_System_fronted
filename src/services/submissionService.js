import api from './axiosInstance';
import { SUBMISSIONS } from './apiEndpoints';

export const submissionService = {
    getAll: (params) => api.get(SUBMISSIONS.LIST, { params }),
    getById: (id) => api.get(SUBMISSIONS.DETAIL(id)),
    getPending: (params) => api.get(SUBMISSIONS.PENDING, { params }),
    create: (formData) => api.post(SUBMISSIONS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getByAssignment: (assignmentId) => api.get(SUBMISSIONS.BY_ASSIGNMENT(assignmentId)),
    grade: (id, data) => api.patch(SUBMISSIONS.GRADE(id), data),
};
