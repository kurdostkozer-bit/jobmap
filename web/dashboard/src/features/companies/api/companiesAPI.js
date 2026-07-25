import apiClient from '../../../core/api/apiClient';

export const companiesAPI = {
  create: (data) => apiClient.post('/companies', data),

  getById: (id) => apiClient.get(`/companies/${id}`),

  getMyCompanies: () => apiClient.get('/companies/my-companies'),

  getByGovernorate: (governorate) => 
    apiClient.get(`/companies/governorate/${governorate}`),

  update: (id, data) => apiClient.put(`/companies/${id}`, data),

  delete: (id) => apiClient.delete(`/companies/${id}`),
};
