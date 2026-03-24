import api from './api';

export const encounterService = {
  // 1. Upload a PDF
  uploadRecord: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/encounters/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // 2. Get list of all records
  getEncounters: async () => {
    const res = await api.get('/encounters');
    return res.data;
  },

  // 3. Get the temporary Google Cloud viewing link
  getSecureViewUrl: async (encounterId) => {
    const res = await api.get(`/encounters/${encounterId}/view`);
    return res.data;
  }
};