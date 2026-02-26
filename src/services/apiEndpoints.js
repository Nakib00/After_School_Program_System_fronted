const BASE = import.meta.env.VITE_API_BASE_URL;
const PREFIX = import.meta.env.VITE_API_PREFIX || '/api';
export const API_BASE = `${BASE}${PREFIX}`;

export const AUTH = {
    LOGIN: `${API_BASE}/login`,
    LOGOUT: `${API_BASE}/logout`,
    REGISTER: `${API_BASE}/register`,
    ME: `${API_BASE}/profile`,
    FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`, // Keeping as is, assuming it might be in missing file or planned
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
    UPDATE_PROFILE: `${API_BASE}/update-profile`,
    CHANGE_PASSWORD: `${API_BASE}/change-password`,
};

export const CENTERS = {
    LIST: `${API_BASE}/center`,
    CREATE: `${API_BASE}/center`,
    DETAIL: (id) => `${API_BASE}/center/${id}`,
    UPDATE: (id) => `${API_BASE}/center/${id}`,
    DELETE: (id) => `${API_BASE}/center/${id}`,
    STATS: (id) => `${API_BASE}/center/stats/${id}`,
    ADMINS: `${API_BASE}/center-admins`,
    PARENTS: `${API_BASE}/parents`,
    PARENT_DETAIL: (id) => `${API_BASE}/parents/${id}`,
    PARENT_UPDATE: (id) => `${API_BASE}/parents/${id}`,
    PARENT_DELETE: (id) => `${API_BASE}/parents/${id}`,
};

export const STUDENTS = {
    LIST: `${API_BASE}/student`,
    CREATE: `${API_BASE}/student`,
    DETAIL: (id) => `${API_BASE}/student/${id}`,
    UPDATE: (id) => `${API_BASE}/student/${id}`,
    DELETE: (id) => `${API_BASE}/student/${id}`,
    PROGRESS: (id) => `${API_BASE}/student/${id}/progress`,
    ASSIGNMENTS: (id) => `${API_BASE}/student/${id}/assignments`,
    MY_ASSIGNMENTS: `${API_BASE}/student/my-assignments`,
    ATTENDANCE: (id) => `${API_BASE}/student/${id}/attendance`,
    FEES: (id) => `${API_BASE}/student/${id}/fees`,
};

export const TEACHERS = {
    LIST: `${API_BASE}/teacher`,
    CREATE: `${API_BASE}/teacher`,
    DETAIL: (id) => `${API_BASE}/teacher/${id}`,
    UPDATE: (id) => `${API_BASE}/teacher/${id}`,
    STUDENTS: (id) => `${API_BASE}/teacher/${id}/students`,
    ASSIGN_STUDENTS: `${API_BASE}/teacher/assign-students`,
    UNASSIGN_STUDENTS: `${API_BASE}/teacher/unassign-students`,
    DASHBOARD: `${API_BASE}/teacher/dashboard`,
};

export const SUBJECTS = {
    LIST: `${API_BASE}/subject`,
    ALL: `${API_BASE}/subject/all`,
    CREATE: `${API_BASE}/subject`,
    DETAIL: (id) => `${API_BASE}/subject/${id}`,
    UPDATE: (id) => `${API_BASE}/subject/${id}`,
    TOGGLE: (id) => `${API_BASE}/subject/${id}/toggle-status`,
};

export const LEVELS = {
    LIST: `${API_BASE}/level`,
    CREATE: `${API_BASE}/level`,
    DETAIL: (id) => `${API_BASE}/level/${id}`,
    UPDATE: (id) => `${API_BASE}/level/${id}`,
    DELETE: (id) => `${API_BASE}/level/${id}`,
};

export const WORKSHEETS = {
    LIST: `${API_BASE}/worksheet`,
    CREATE: `${API_BASE}/worksheet`,
    DETAIL: (id) => `${API_BASE}/worksheet/${id}`,
    UPDATE: (id) => `${API_BASE}/worksheet/${id}`,
    DELETE: (id) => `${API_BASE}/worksheet/${id}`,
    DOWNLOAD: (id) => `${API_BASE}/worksheet/${id}/download`,
};

export const ASSIGNMENTS = {
    LIST: `${API_BASE}/assignment`,
    CREATE: `${API_BASE}/assignment`,
    BULK_CREATE: `${API_BASE}/assignment/bulk`,
    DETAIL: (id) => `${API_BASE}/assignment/${id}`,
    UPDATE: (id) => `${API_BASE}/assignment/${id}`,
    DELETE: (id) => `${API_BASE}/assignment/${id}`,
};

export const SUBMISSIONS = {
    LIST: `${API_BASE}/submission`,
    CREATE: `${API_BASE}/submission`,
    DETAIL: (id) => `${API_BASE}/submission/${id}`,
    BY_ASSIGNMENT: (assignmentId) => `${API_BASE}/submission/assignment/${assignmentId}`,
    PENDING: `${API_BASE}/submission/pending`,
    GRADE: (id) => `${API_BASE}/submission/${id}/grade`,
};

export const ATTENDANCE = {
    LIST: `${API_BASE}/attendance`,
    MARK_BULK: `${API_BASE}/attendance/bulk`,
    UPDATE: (id) => `${API_BASE}/attendance/${id}`,
    SUMMARY: `${API_BASE}/attendance/summary`,
    TODAY: `${API_BASE}/attendance/today`,
};

export const FEES = {
    LIST: `${API_BASE}/fees`,
    GENERATE: `${API_BASE}/fees/generate`,
    DETAIL: (id) => `${API_BASE}/fees/${id}`,
    PAY: (id) => `${API_BASE}/fees/${id}/pay`,
    MARK_OVERDUE_ALL: `${API_BASE}/fees/mark-overdue`,
    REPORT: `${API_BASE}/fees/report`,
    UNPAID_OVERDUE: `${API_BASE}/fees/unpaid-overdue`,
    PENDING: `${API_BASE}/fees/pending`,
};

export const DASHBOARD = {
    STATS: `${API_BASE}/dashboard/kpis`,
};

export const REPORTS = {
    CENTER: (id) => `${API_BASE}/reports/center/${id}`,
    TEACHER: (id) => `${API_BASE}/reports/teacher/${id}`,
    STUDENT: (id) => `${API_BASE}/reports/student/${id}`,
    FEES: `${API_BASE}/reports/fees`,
    ATTENDANCE: `${API_BASE}/reports/attendance`,
    PROGRESS: `${API_BASE}/reports/progress`,
};

export const NOTIFICATIONS = {
    LIST: `${API_BASE}/notifications`,
    UNREAD_COUNT: `${API_BASE}/notifications/unread-count`,
    MARK_READ: (id) => `${API_BASE}/notifications/${id}/read`,
    MARK_ALL: `${API_BASE}/notifications/read-all`,
    DELETE: (id) => `${API_BASE}/notifications/${id}`,
};
