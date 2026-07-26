import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to sort jobs based on selected sort option
 * Handles: relevance, salary, date, distance
 */
export const useSortJobs = () => {
  const jobs = useSelector((state) => state.jobs.jobs);
  const sortBy = useSelector((state) => state.jobs.sortBy);

  return useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    const jobsCopy = [...jobs];

    switch (sortBy) {
      case 'salary-asc':
        return jobsCopy.sort((a, b) => {
          const salaryA = a.salaryMin || 0;
          const salaryB = b.salaryMin || 0;
          return salaryA - salaryB;
        });

      case 'salary-desc':
        return jobsCopy.sort((a, b) => {
          const salaryA = a.salaryMax || 0;
          const salaryB = b.salaryMax || 0;
          return salaryB - salaryA;
        });

      case 'date':
        return jobsCopy.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // Newest first
        });

      case 'distance':
        // Distance sorting would require user location
        // For now, return as-is (no distance data in current API)
        return jobsCopy;

      case 'relevance':
      default:
        // Keep original order (from API ranking)
        return jobsCopy;
    }
  }, [jobs, sortBy]);
};
