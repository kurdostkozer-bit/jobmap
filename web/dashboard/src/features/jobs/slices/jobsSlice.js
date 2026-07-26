import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsAPI } from '../api/jobsAPI';

export const searchJobs = createAsyncThunk(
  'jobs/search',
  async (params, { rejectWithValue }) => {
    try {
      return await jobsAPI.search(params);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getJobById = createAsyncThunk(
  'jobs/getById',
  async (id, { rejectWithValue }) => {
    try {
      return await jobsAPI.getById(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getNearbyJobs = createAsyncThunk(
  'jobs/getNearby',
  async ({ lat, lng, radius }, { rejectWithValue }) => {
    try {
      return await jobsAPI.getNearby(lat, lng, radius);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchJobsByBounds = createAsyncThunk(
  'jobs/searchByBounds',
  async (boundsQuery, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const sortBy = state.jobs.sortBy;
      
      // إضافة sortBy إلى الـ query
      const queryWithSort = {
        ...boundsQuery,
        sortBy,
      };
      
      const response = await jobsAPI.searchByBounds(queryWithSort);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData, { rejectWithValue }) => {
    try {
      return await jobsAPI.create(jobData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await jobsAPI.update(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await jobsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  jobs: [],
  selectedJob: null,
  isLoading: false,
  error: null,
  filters: {
    query: '',
    governorate: null,
    salaryMin: null,
    salaryMax: null,
    category: [],
    employmentType: [],
    experienceLevel: [],
  },
  sortBy: 'relevance', // relevance, salary-asc, salary-desc, date, distance
  totalResults: 0,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.selectedJob = action.payload;
      })
      .addCase(getNearbyJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNearbyJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })
      .addCase(searchJobsByBounds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchJobsByBounds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs || [];
        state.totalResults = action.payload.stats?.totalFound || 0;
      })
      .addCase(searchJobsByBounds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setSortBy, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
