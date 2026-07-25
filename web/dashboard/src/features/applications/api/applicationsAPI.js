import apiClient from '../../../core/api/apiClient';

export const applicationsAPI = {
  getMyApplications: () => apiClient.get('/applications/user/my-applications'),

  apply: (data) => apiClient.post('/applications', data),

  withdraw: (applicationId) => apiClient.delete(`/applications/${applicationId}`),

  getById: (applicationId) => apiClient.get(`/applications/${applicationId}`),

  getByJobId: (jobId) => apiClient.get(`/applications/job/${jobId}`),
};
