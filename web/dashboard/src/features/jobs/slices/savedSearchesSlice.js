import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { savedSearchesAPI } from '../api/savedSearchesAPI';

export const createSavedSearch = createAsyncThunk(
  'savedSearches/create',
  async (data, { rejectWithValue }) => {
    try {
      return await savedSearchesAPI.create(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSavedSearches = createAsyncThunk(
  'savedSearches/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await savedSearchesAPI.findAll();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSavedSearch = createAsyncThunk(
  'savedSearches/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await savedSearchesAPI.update(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteSavedSearch = createAsyncThunk(
  'savedSearches/delete',
  async (id, { rejectWithValue }) => {
    try {
      await savedSearchesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const executeSavedSearch = createAsyncThunk(
  'savedSearches/execute',
  async (id, { rejectWithValue }) => {
    try {
      return await savedSearchesAPI.execute(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  searches: [],
  isLoading: false,
  error: null,
};

const savedSearchesSlice = createSlice({
  name: 'savedSearches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedSearches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedSearches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searches = action.payload;
      })
      .addCase(fetchSavedSearches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createSavedSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSavedSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searches.push(action.payload);
      })
      .addCase(createSavedSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateSavedSearch.fulfilled, (state, action) => {
        const index = state.searches.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.searches[index] = action.payload;
        }
      })
      .addCase(deleteSavedSearch.fulfilled, (state, action) => {
        state.searches = state.searches.filter((s) => s.id !== action.payload);
      })
      .addCase(executeSavedSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(executeSavedSearch.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(executeSavedSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = savedSearchesSlice.actions;
export default savedSearchesSlice.reducer;
