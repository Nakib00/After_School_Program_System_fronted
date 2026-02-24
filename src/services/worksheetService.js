import api from './axiosInstance';
import { WORKSHEETS } from './apiEndpoints';

export const worksheetService = {
    getAll: (params) => api.get(WORKSHEETS.LIST, { params }),
    getById: (id) => api.get(WORKSHEETS.DETAIL(id)),
    create: (data) => api.post(WORKSHEETS.CREATE, data),
    update: (id, data) => api.put(WORKSHEETS.UPDATE(id), data),
    remove: (id) => api.delete(WORKSHEETS.DELETE(id)),
    download: (id) => api.get(WORKSHEETS.DOWNLOAD(id), { responseType: 'blob' }),
};
