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
};

export const STUDENTS = {
    LIST: `${API_BASE}/students`,
    CREATE: `${API_BASE}/students`,
    DETAIL: (id) => `${API_BASE}/students/${id}`,
    UPDATE: (id) => `${API_BASE}/students/${id}`,
    DELETE: (id) => `${API_BASE}/students/${id}`,
    PROGRESS: (id) => `${API_BASE}/students/${id}/progress`,
    ASSIGNMENTS: (id) => `${API_BASE}/students/${id}/assignments`,
    ATTENDANCE: (id) => `${API_BASE}/students/${id}/attendance`,
    FEES: (id) => `${API_BASE}/students/${id}/fees`,
};

export const TEACHERS = {
    LIST: `${API_BASE}/teacher`,
    CREATE: `${API_BASE}/teacher`,
    DETAIL: (id) => `${API_BASE}/teacher/${id}`,
    UPDATE: (id) => `${API_BASE}/teacher/${id}`,
    STUDENTS: (id) => `${API_BASE}/teacher/${id}/students`,
    ASSIGN_STUDENTS: `${API_BASE}/teacher/assign-students`,
};

export const SUBJECTS = {
    LIST: `${API_BASE}/subjects`,
    CREATE: `${API_BASE}/subjects`,
    UPDATE: (id) => `${API_BASE}/subjects/${id}`,
    DELETE: (id) => `${API_BASE}/subjects/${id}`,
};

export const LEVELS = {
    LIST: `${API_BASE}/levels`,
    CREATE: `${API_BASE}/levels`,
    UPDATE: (id) => `${API_BASE}/levels/${id}`,
    DELETE: (id) => `${API_BASE}/levels/${id}`,
};

export const WORKSHEETS = {
    LIST: `${API_BASE}/worksheets`,
    CREATE: `${API_BASE}/worksheets`,
    DETAIL: (id) => `${API_BASE}/worksheets/${id}`,
    UPDATE: (id) => `${API_BASE}/worksheets/${id}`,
    DELETE: (id) => `${API_BASE}/worksheets/${id}`,
    DOWNLOAD: (id) => `${API_BASE}/worksheets/${id}/download`,
};

export const ASSIGNMENTS = {
    LIST: `${API_BASE}/assignments`,
    CREATE: `${API_BASE}/assignments`,
    BULK_CREATE: `${API_BASE}/assignments/bulk`,
    DETAIL: (id) => `${API_BASE}/assignments/${id}`,
    UPDATE: (id) => `${API_BASE}/assignments/${id}`,
    DELETE: (id) => `${API_BASE}/assignments/${id}`,
};

export const SUBMISSIONS = {
    LIST: `${API_BASE}/submissions`,
    CREATE: `${API_BASE}/submissions`,
    BY_ASSIGNMENT: (assignmentId) => `${API_BASE}/submissions/${assignmentId}`,
    GRADE: (id) => `${API_BASE}/submissions/${id}/grade`,
};

export const ATTENDANCE = {
    LIST: `${API_BASE}/attendance`,
    MARK: `${API_BASE}/attendance/mark`,
    UPDATE: (id) => `${API_BASE}/attendance/${id}`,
    REPORT: `${API_BASE}/attendance/report`,
    TODAY: `${API_BASE}/attendance/today`,
};

export const FEES = {
    LIST: `${API_BASE}/fees`,
    GENERATE: `${API_BASE}/fees/generate`,
    DETAIL: (id) => `${API_BASE}/fees/${id}`,
    PAY: (id) => `${API_BASE}/fees/${id}/pay`,
    OVERDUE: (id) => `${API_BASE}/fees/${id}/overdue`,
    REPORT: `${API_BASE}/fees/report`,
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
