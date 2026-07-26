import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import jobsReducer from '../features/jobs/slices/jobsSlice';
import applicationsReducer from '../features/applications/slices/applicationsSlice';
import notificationsReducer from '../features/notifications/slices/notificationsSlice';
import mapReducer from '../features/map/slices/mapSlice';
import companiesReducer from '../features/companies/slices/companiesSlice';
import savedSearchesReducer from '../features/jobs/slices/savedSearchesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
    notifications: notificationsReducer,
    map: mapReducer,
    companies: companiesReducer,
    savedSearches: savedSearchesReducer,
  },
});

export default store;
