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

  getEncounters: async () => {
    const res = await api.get('/encounters');
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
  }
};