import api from './api';

export const submitAdoptionRequest = async (application) => {
  const { data } = await api.post('/adoptions', application);
  return data;
};

export const getMyAdoptionRequests = async () => {
  const { data } = await api.get('/adoptions/my');
  return data;
};

export const cancelAdoptionRequest = async (id) => api.delete(`/adoptions/${id}`);

export const getAllAdoptionRequests = async () => {
  const { data } = await api.get('/adoptions');
  return data;
};

export const updateAdoptionStatus = async (id, status) => {
  const { data } = await api.put(`/adoptions/${id}/status`, { status });
  return data;
};
