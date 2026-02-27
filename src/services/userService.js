import api from './axiosInstance';
import { USERS } from './apiEndpoints';

export const userService = {
    toggleStatus: (id) => api.patch(USERS.TOGGLE_STATUS(id)),
};
