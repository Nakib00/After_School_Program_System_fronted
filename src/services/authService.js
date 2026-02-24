import api from './axiosInstance';
import { AUTH } from './apiEndpoints';

export const authService = {
    login: (credentials) => api.post(AUTH.LOGIN, credentials),
    logout: () => api.post(AUTH.LOGOUT),
    me: () => api.get(AUTH.ME),
    forgotPassword: (email) => api.post(AUTH.FORGOT_PASSWORD, { email }),
    resetPassword: (data) => api.post(AUTH.RESET_PASSWORD, data),
    updateProfile: (data) => api.put(AUTH.UPDATE_PROFILE, data),
    changePassword: (data) => api.put(AUTH.CHANGE_PASSWORD, data),
};
