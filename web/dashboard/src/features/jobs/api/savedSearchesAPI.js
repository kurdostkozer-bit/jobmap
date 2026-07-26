import apiClient from '../../../core/api/apiClient';

export const savedSearchesAPI = {
  create: (data) =>
    apiClient.post('/saved-searches', data),

  findAll: () =>
    apiClient.get('/saved-searches'),

  findById: (id) =>
    apiClient.get(`/saved-searches/${id}`),

  update: (id, data) =>
    apiClient.put(`/saved-searches/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/saved-searches/${id}`),

  execute: (id) =>
    apiClient.post(`/saved-searches/${id}/execute`),
};
