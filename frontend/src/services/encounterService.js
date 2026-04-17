import api from './api';

export const encounterService = {
  uploadRecord: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/encounters/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

 getEncounters: async (status, page = 1, limit = 10) => {
  const res = await api.get(`/encounters?status=${status}&page=${page}&limit=${limit}`);
  return res.data;
},

  // Get Coder Performance
  getCoderStats: async () => {
    const res = await api.get('/encounters/stats/performance');
    return res.data;
  },

  getSecureViewUrl: async (encounterId) => {
    const res = await api.get(`/encounters/${encounterId}/view`);
    return res.data;
  },

  // 🔴 NEW: Trigger Google Cloud DLP Scrubbing
  scrubRecord: async (encounterId) => {
    const res = await api.post(`/encounters/${encounterId}/scrub`);
    return res.data;
  },

    analyzeRecord: async (encounterId) => {
    const res = await api.post(`/encounters/${encounterId}/analyze`);
    return res.data;
  },

  updateRecord:async (encounterId, data)=>{
    const res = await api.put(`/encounters/${encounterId}`, data);
    return res.data;
  },

  exportFHIR: async (encounterId) => {
  const res = await api.get(`/encounters/${encounterId}/export`);
  return res.data;
},

getAdminStats: async () => {
    const res = await api.get('/encounters/stats/admin-overview');
    return res.data;
  }
};