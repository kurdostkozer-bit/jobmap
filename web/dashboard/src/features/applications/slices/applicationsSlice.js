import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationsAPI } from '../api/applicationsAPI';

export const getMyApplications = createAsyncThunk(
  'applications/getMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationsAPI.getMyApplications();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const applyForJob = createAsyncThunk(
  'applications/apply',
  async (applicationData, { rejectWithValue }) => {
    try {
      return await applicationsAPI.apply(applicationData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const withdrawApplication = createAsyncThunk(
  'applications/withdraw',
  async (applicationId, { rejectWithValue }) => {
    try {
      await applicationsAPI.withdraw(applicationId);
      return applicationId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  applications: [],
  isLoading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.applications.push(action.payload);
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter(
          (app) => app.id !== action.payload
        );
      });
  },
});

export const { clearError } = applicationsSlice.actions;
export default applicationsSlice.reducer;
