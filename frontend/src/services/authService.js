import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  
  logout: async () => {
    // In Week 2, we will add a backend call here to clear the cookie
    return true;
  }
};