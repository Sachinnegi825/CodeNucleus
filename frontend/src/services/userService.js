import api from './api';

export const userService = {
  getCoders: async () => {
    const res = await api.get('/users/coders');
    return res.data;
  },
  
  createCoder: async (email, password) => {
    const res = await api.post('/users/coder', { email, password });
    return res.data;
  },

  createAgency: async (formData) => {
    const res = await api.post('/users/agency', formData);
    return res.data;
  }
};