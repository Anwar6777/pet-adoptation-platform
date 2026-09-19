import api from './api';

export const updateUserProfile = async (id, profile) => {
  const { data } = await api.put(`/users/${id}`, profile);
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const deleteUser = async (id) => api.delete(`/users/${id}`);
