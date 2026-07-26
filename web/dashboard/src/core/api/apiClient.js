import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jobmap-backend-57v5.onrender.com/api';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    this.isRefreshing = false;
    this.failedQueue = [];

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
          hasToken: !!token,
          data: config.data,
        });
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('❌ Request Interceptor Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor with automatic token refresh
    this.client.interceptors.response.use(
      (response) => {
        console.log(`📥 API Response: ${response.status}`, response.data);
        return response.data;
      },
      async (error) => {
        console.error('❌ Response Error:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          url: error.config?.url,
        });
        const originalRequest = error.config;

        // If 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Prevent multiple simultaneous refresh attempts
          if (this.isRefreshing) {
            // Queue this request to retry after refresh completes
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Call refresh endpoint
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;

            // Update tokens
            localStorage.setItem('auth_token', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken);
            }

            // Process queued requests
            this.failedQueue.forEach((prom) => prom.resolve(accessToken));
            this.failedQueue = [];

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect
            this.failedQueue.forEach((prom) => prom.reject(refreshError));
            this.failedQueue = [];

            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(
          error.response?.data?.message || 'خطأ في الاتصال'
        );
      }
    );
  }

  async get(path) {
    return this.client.get(path);
  }

  async post(path, data) {
    return this.client.post(path, data);
  }

  async put(path, data) {
    return this.client.put(path, data);
  }

  async delete(path) {
    return this.client.delete(path);
  }

  setToken(token) {
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  clearToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}

const apiClient = new ApiClient();
export { apiClient };
export default apiClient;
