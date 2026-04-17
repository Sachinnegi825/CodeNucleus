import api from './api';

export const payerRuleService = {
   getRules: async (page = 1, limit = 10) => {
    const res = await api.get(`/payer-rules?page=${page}&limit=${limit}`);
    return res.data;
  },
  createRule: async (data) => {
    const res = await api.post('/payer-rules', data);
    return res.data;
  },
  deleteRule: async (id) => {
    const res = await api.delete(`/payer-rules/${id}`);
    return res.data;
  }
};