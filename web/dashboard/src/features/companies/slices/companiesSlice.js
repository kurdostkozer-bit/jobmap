import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companiesAPI } from '../api/companiesAPI';

export const createCompany = createAsyncThunk(
  'companies/create',
  async (companyData, { rejectWithValue }) => {
    try {
      return await companiesAPI.create(companyData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getMyCompanies = createAsyncThunk(
  'companies/getMyCompanies',
  async (_, { rejectWithValue }) => {
    try {
      return await companiesAPI.getMyCompanies();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCompanyById = createAsyncThunk(
  'companies/getById',
  async (id, { rejectWithValue }) => {
    try {
      return await companiesAPI.getById(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await companiesAPI.update(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/delete',
  async (id, { rejectWithValue }) => {
    try {
      await companiesAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  companies: [],
  selectedCompany: null,
  isLoading: false,
  error: null,
};

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getMyCompanies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.selectedCompany = action.payload;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
        if (state.selectedCompany?.id === action.payload.id) {
          state.selectedCompany = action.payload;
        }
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearError } = companiesSlice.actions;
export default companiesSlice.reducer;
