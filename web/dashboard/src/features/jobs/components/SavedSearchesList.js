import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSavedSearches,
  deleteSavedSearch,
  executeSavedSearch,
  updateSavedSearch,
} from '../slices/savedSearchesSlice';
import './SavedSearchesList.css';

const SavedSearchesList = ({ onSelectSearch }) => {
  const dispatch = useDispatch();
  const searches = useSelector((state) => state.savedSearches.searches);
  const isLoading = useSelector((state) => state.savedSearches.isLoading);

  useEffect(() => {
    dispatch(fetchSavedSearches());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this saved search?')) {
      dispatch(deleteSavedSearch(id));
    }
  };

  const handleExecute = (search) => {
    dispatch(executeSavedSearch(search.id));
    onSelectSearch(search);
  };

  const handleToggleNotification = (search) => {
    dispatch(
      updateSavedSearch({
        id: search.id,
        data: {
          notifyOnNewJobs: !search.notifyOnNewJobs,
        },
      })
    );
  };

  if (isLoading) {
    return <div className="saved-searches-loading">Loading saved searches...</div>;
  }

  if (searches.length === 0) {
    return (
      <div className="saved-searches-empty">
        <p>No saved searches yet</p>
        <small>Save your search filters to quickly find jobs again</small>
      </div>
    );
  }

  return (
    <div className="saved-searches-list">
      <h3>Saved Searches</h3>
      <div className="searches-container">
        {searches.map((search) => (
          <div key={search.id} className="search-card">
            <div className="search-header">
              <h4>{search.name}</h4>
              <div className="search-actions">
                <button
                  className="btn-icon"
                  title="Execute search"
                  onClick={() => handleExecute(search)}
                >
                  ▶
                </button>
                <button
                  className={`btn-icon ${search.notifyOnNewJobs ? 'active' : ''}`}
                  title="Toggle notifications"
                  onClick={() => handleToggleNotification(search)}
                >
                  🔔
                </button>
                <button
                  className="btn-icon btn-delete"
                  title="Delete search"
                  onClick={() => handleDelete(search.id)}
                >
                  ✕
                </button>
              </div>
            </div>

            {search.description && (
              <p className="search-description">{search.description}</p>
            )}

            <div className="search-filters">
              {search.filters?.category?.length > 0 && (
                <span className="filter-badge">
                  📁 {search.filters.category.join(', ')}
                </span>
              )}
              {search.filters?.employmentType?.length > 0 && (
                <span className="filter-badge">
                  💼 {search.filters.employmentType.join(', ')}
                </span>
              )}
              {search.filters?.salaryMin && (
                <span className="filter-badge">
                  💰 {search.filters.salaryMin?.toLocaleString?.()} - {search.filters.salaryMax?.toLocaleString?.()}
                </span>
              )}
            </div>

            <div className="search-footer">
              <small>
                {search.lastExecutedAt
                  ? `Last executed: ${new Date(search.lastExecutedAt).toLocaleDateString()}`
                  : 'Never executed'}
              </small>
              {search.notifyOnNewJobs && (
                <small className="notification-info">
                  Notifications: {search.notificationFrequency}
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSearchesList;
