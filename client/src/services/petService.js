import api from './api';

export const getPets = async (filters = {}) => {
  const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));
  const { data } = await api.get('/pets', { params });
  return data;
};

export const getPetById = async (id) => {
  const { data } = await api.get(`/pets/${id}`);
  return data;
};

export const createPet = async (pet) => {
  const { data } = await api.post('/pets', pet);
  return data;
};

export const updatePet = async (id, pet) => {
  const { data } = await api.put(`/pets/${id}`, pet);
  return data;
};

export const deletePet = async (id) => api.delete(`/pets/${id}`);
