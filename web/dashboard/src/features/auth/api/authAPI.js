import apiClient from '../../../core/api/apiClient';

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/me'),
  refreshToken: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
  logout: () => {
    apiClient.clearToken();
  },
};
