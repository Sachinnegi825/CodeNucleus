import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error);
    }
    return true;
  }
};