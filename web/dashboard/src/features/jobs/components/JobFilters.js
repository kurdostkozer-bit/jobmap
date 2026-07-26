import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters, setSortBy } from '../slices/jobsSlice';
import './JobFilters.css';

const JobFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.jobs.filters);
  const sortBy = useSelector((state) => state.jobs.sortBy);
  const [isExpanded, setIsExpanded] = useState(false);

  // Category options
  const categoryOptions = [
    'IT', 'Design', 'Sales', 'Marketing', 'HR',
    'Finance', 'Operations', 'Management'
  ];

  // Employment type options
  const employmentTypeOptions = [
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' },
    { value: 'freelance', label: 'Freelance' }
  ];

  // Experience level options
  const experienceLevelOptions = [
    { value: 'Entry', label: 'Entry Level' },
    { value: 'Mid', label: 'Mid-Level' },
    { value: 'Senior', label: 'Senior' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'salary-desc', label: 'Salary: High to Low' },
    { value: 'salary-asc', label: 'Salary: Low to High' },
    { value: 'date', label: 'Newest First' },
    { value: 'distance', label: 'Closest First' }
  ];

  const handleCategoryChange = (category) => {
    const updatedCategories = filters.category.includes(category)
      ? filters.category.filter((c) => c !== category)
      : [...filters.category, category];
    dispatch(setFilters({ category: updatedCategories }));
  };

  const handleEmploymentTypeChange = (type) => {
    const updatedTypes = filters.employmentType.includes(type)
      ? filters.employmentType.filter((t) => t !== type)
      : [...filters.employmentType, type];
    dispatch(setFilters({ employmentType: updatedTypes }));
  };

  const handleExperienceLevelChange = (level) => {
    const updatedLevels = filters.experienceLevel.includes(level)
      ? filters.experienceLevel.filter((l) => l !== level)
      : [...filters.experienceLevel, level];
    dispatch(setFilters({ experienceLevel: updatedLevels }));
  };

  const handleSalaryChange = (field, value) => {
    dispatch(setFilters({
      [field]: value ? parseInt(value) : null
    }));
  };

  const handleSortChange = (newSort) => {
    dispatch(setSortBy(newSort));
  };

  const hasActiveFilters = 
    filters.category.length > 0 ||
    filters.employmentType.length > 0 ||
    filters.experienceLevel.length > 0 ||
    filters.salaryMin ||
    filters.salaryMax;

  return (
    <div className="job-filters">
      <div className="filters-header">
        <h3>Refine Search</h3>
        <button 
          className="toggle-filters"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="filters-content">
          {/* Sort */}
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Range */}
          <div className="filter-group">
            <label className="filter-label">Salary Range (IQD)</label>
            <div className="salary-inputs">
              <input
                type="number"
                placeholder="Min"
                className="salary-input"
                value={filters.salaryMin || ''}
                onChange={(e) => handleSalaryChange('salaryMin', e.target.value)}
              />
              <span>−</span>
              <input
                type="number"
                placeholder="Max"
                className="salary-input"
                value={filters.salaryMax || ''}
                onChange={(e) => handleSalaryChange('salaryMax', e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="checkbox-group">
              {categoryOptions.map((cat) => (
                <label key={cat} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Employment Type */}
          <div className="filter-group">
            <label className="filter-label">Employment Type</label>
            <div className="checkbox-group">
              {employmentTypeOptions.map((emp) => (
                <label key={emp.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.employmentType.includes(emp.value)}
                    onChange={() => handleEmploymentTypeChange(emp.value)}
                  />
                  {emp.label}
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="filter-group">
            <label className="filter-label">Experience Level</label>
            <div className="checkbox-group">
              {experienceLevelOptions.map((exp) => (
                <label key={exp.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.experienceLevel.includes(exp.value)}
                    onChange={() => handleExperienceLevelChange(exp.value)}
                  />
                  {exp.label}
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              className="clear-filters-btn"
              onClick={() => dispatch(clearFilters())}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilters;
