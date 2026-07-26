/**
 * Job Service - Handles all job-related API calls
 */

import apiClient from '../api/apiClient';

class JobService {
  /**
   * Get all jobs or filtered jobs
   */
  async getJobs(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.location) params.append('location', filters.location);
      if (filters.search) params.append('search', filters.search);
      if (filters.minSalary) params.append('minSalary', filters.minSalary);
      if (filters.maxSalary) params.append('maxSalary', filters.maxSalary);
      if (filters.jobType) params.append('type', filters.jobType);
      
      // Bounds filtering for map
      if (filters.bounds) {
        params.append('ne_lat', filters.bounds.north);
        params.append('ne_lng', filters.bounds.east);
        params.append('sw_lat', filters.bounds.south);
        params.append('sw_lng', filters.bounds.west);
      }

      return await apiClient.get(`/jobs?${params}`);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  /**
   * Search jobs by query
   */
  async searchJobs(query) {
    try {
      return await apiClient.get(`/jobs/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }

  /**
   * Apply for a job
   */
  async applyForJob(jobId, applicationData) {
    try {
      return await apiClient.post('/applications', {
        jobId,
        ...applicationData,
      });
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  }

  /**
   * Save job (bookmark)
   */
  async saveJob(jobId) {
    try {
      return await apiClient.post('/users/saved-jobs', { jobId });
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  /**
   * Helper: Get JWT token from localStorage
   */
  getToken() {
    return localStorage.getItem('auth_token') || '';
  }
}

export default new JobService();
