import api from './api';

export const getDashboardSummary = async () => {
  const { data } = await api.get('/admin/dashboard');
  return data;
};
