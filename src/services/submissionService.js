import api from './axiosInstance';
import { SUBMISSIONS } from './apiEndpoints';

export const submissionService = {
    getAll: (params) => api.get(SUBMISSIONS.LIST, { params }),
    create: (data) => api.post(SUBMISSIONS.CREATE, data),
    getByAssignment: (assignmentId) => api.get(SUBMISSIONS.BY_ASSIGNMENT(assignmentId)),
    grade: (id, data) => api.put(SUBMISSIONS.GRADE(id), data),
};
