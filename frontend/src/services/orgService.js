import api from './api';

export const orgService = {
  // NEW: Fetch current branding from DB
  getBranding: async () => {
    const res = await api.get('/orgs/branding');
    return res.data;
  },

  getPublicProfile: async (subdomain) => {
  const res = await api.get(`/orgs/public-profile/${subdomain}`);
  return res.data;
},

  updateBranding: async (formData) => {
    const res = await api.put('/orgs/branding', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};