import api from './api';

export const userService = {
getCoders: async (page = 1, limit = 10) => {
  const res = await api.get(`/users/coders?page=${page}&limit=${limit}`);
  return res.data;
},
  
  createCoder: async (email, password) => {
    const res = await api.post('/users/coder', { email, password });
    return res.data;
  },

   updatePassword: async (id, newPassword) => {
    const res = await api.patch(`/users/${id}/password`, { newPassword });
    return res.data;
  },

   toggleStatus: async (id) => {
    const res = await api.patch(`/users/${id}/status`);
    return res.data;
  },

  createAgency: async (formData) => {
    const res = await api.post('/users/agency', formData);
    return res.data;
  },

     getAuditLogs: async (page = 1, limit = 10) => {
    const res = await api.get(`/users/audit-logs?page=${page}&limit=${limit}`);
    return res.data; // Now returns { logs, totalPages, ... }
  }
};