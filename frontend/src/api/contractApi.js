import apiClient from './apiClient';

export const contractApi = {
  getContracts: (params) => apiClient.get('/contracts', { params }),
  getContractById: (id) => apiClient.get(`/contracts/${id}`),
  createContract: (data) => apiClient.post('/contracts', data),
  updateContract: (id, data) => apiClient.put(`/contracts/${id}`, data),
  deleteContract: (id) => apiClient.delete(`/contracts/${id}`),
  getVersions: (id) => apiClient.get(`/contracts/${id}/versions`),
  getVersionById: (id, versionId) => apiClient.get(`/contracts/${id}/versions/${versionId}`),
};

export const userApi = {
  getUsers: (params) => apiClient.get('/users', { params }),
  updateUserRole: (id, role) => apiClient.patch(`/users/${id}/role`, { role }),
};
