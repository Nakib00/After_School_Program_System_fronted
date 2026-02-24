import api from './axiosInstance';
import { AUTH } from './apiEndpoints';

export const authService = {
    login: (credentials) => api.post(AUTH.LOGIN, credentials),
    logout: () => api.post(AUTH.LOGOUT),
    me: () => api.get(AUTH.ME),
    forgotPassword: (email) => api.post(AUTH.FORGOT_PASSWORD, { email }),
    resetPassword: (data) => api.post(AUTH.RESET_PASSWORD, data),
    updateProfile: (data) => api.post(AUTH.UPDATE_PROFILE, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    changePassword: (data) => api.post(AUTH.CHANGE_PASSWORD, data),
};
