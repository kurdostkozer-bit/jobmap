/**
 * Job Service - Handles all job-related API calls
 */

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

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

      const response = await fetch(`${API_BASE}/api/jobs?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }

      return await response.json();
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
      const response = await fetch(`${API_BASE}/api/jobs/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      return await response.json();
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
      const response = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({
          jobId,
          ...applicationData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Application failed: ${response.statusText}`);
      }

      return await response.json();
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
      const response = await fetch(`${API_BASE}/api/users/saved-jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  }

  /**
   * Helper: Get JWT token from localStorage
   */
  getToken() {
    return localStorage.getItem('jwt_token') || '';
  }
}

export default new JobService();
