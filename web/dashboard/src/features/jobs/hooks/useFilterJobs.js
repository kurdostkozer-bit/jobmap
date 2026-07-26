import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to filter jobs based on selected filters
 * Handles: category, employment type, experience level, salary range
 */
export const useFilterJobs = (jobs) => {
  const filters = useSelector((state) => state.jobs.filters);

  return useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    return jobs.filter((job) => {
      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(job.category)) {
        return false;
      }

      // Employment type filter
      if (
        filters.employmentType.length > 0 &&
        !filters.employmentType.includes(job.employmentType)
      ) {
        return false;
      }

      // Experience level filter (note: job.experienceLevel might not exist, handle gracefully)
      if (filters.experienceLevel.length > 0 && job.experienceLevel) {
        if (!filters.experienceLevel.includes(job.experienceLevel)) {
          return false;
        }
      }

      // Salary range filter
      if (filters.salaryMin && job.salaryMax && job.salaryMax < filters.salaryMin) {
        return false;
      }
      if (filters.salaryMax && job.salaryMin && job.salaryMin > filters.salaryMax) {
        return false;
      }

      return true;
    });
  }, [jobs, filters]);
};
