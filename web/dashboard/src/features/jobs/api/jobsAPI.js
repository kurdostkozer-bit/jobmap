import apiClient from '../../../core/api/apiClient';

export const jobsAPI = {
  getByGovernorate: (governorate) => 
    apiClient.get(`/jobs/governorate/${governorate}`),
  
  search: (params) => {
    let path = `/jobs/search?q=${params.query}`;
    if (params.governorate) path += `&governorate=${params.governorate}`;
    if (params.salaryMin) path += `&salaryMin=${params.salaryMin}`;
    if (params.salaryMax) path += `&salaryMax=${params.salaryMax}`;
    return apiClient.get(path);
  },

  getNearby: (lat, lng, radius = 50) =>
    apiClient.get(`/jobs/location/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),

  getById: (id) => apiClient.get(`/jobs/${id}`),

  create: (data) => apiClient.post('/jobs', data),

  update: (id, data) => apiClient.put(`/jobs/${id}`, data),

  delete: (id) => apiClient.delete(`/jobs/${id}`),

  getByCompany: (companyId) => apiClient.get(`/jobs/company/${companyId}`),
};
