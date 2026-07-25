import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { locationsAPI } from '../api/locationsAPI';

export const fetchAllGovernorates = createAsyncThunk(
  'map/fetchGovernorates',
  async (_, { rejectWithValue }) => {
    try {
      return await locationsAPI.getAllGovernorates();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchDistrictsByGovernorate = createAsyncThunk(
  'map/fetchDistricts',
  async (governorateId, { rejectWithValue }) => {
    try {
      return await locationsAPI.getDistrictsByGovernorate(governorateId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchNeighborhoodsByDistrict = createAsyncThunk(
  'map/fetchNeighborhoods',
  async (districtId, { rejectWithValue }) => {
    try {
      return await locationsAPI.getNeighborhoodsByDistrict(districtId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLocationDrillDown = createAsyncThunk(
  'map/fetchDrillDown',
  async (governorateId, { rejectWithValue }) => {
    try {
      return await locationsAPI.getLocationDrillDown(governorateId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  governorates: [],
  selectedGovernorate: null,
  districts: [],
  selectedDistrict: null,
  neighborhoods: [],
  selectedNeighborhood: null,
  isLoading: false,
  error: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    selectGovernorate: (state, action) => {
      state.selectedGovernorate = action.payload;
      state.selectedDistrict = null;
      state.selectedNeighborhood = null;
      state.districts = [];
      state.neighborhoods = [];
    },
    selectDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
      state.selectedNeighborhood = null;
      state.neighborhoods = [];
    },
    selectNeighborhood: (state, action) => {
      state.selectedNeighborhood = action.payload;
    },
    resetSelection: (state) => {
      state.selectedGovernorate = null;
      state.selectedDistrict = null;
      state.selectedNeighborhood = null;
      state.districts = [];
      state.neighborhoods = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGovernorates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllGovernorates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.governorates = action.payload;
      })
      .addCase(fetchAllGovernorates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDistrictsByGovernorate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDistrictsByGovernorate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.districts = action.payload;
      })
      .addCase(fetchNeighborhoodsByDistrict.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNeighborhoodsByDistrict.fulfilled, (state, action) => {
        state.isLoading = false;
        state.neighborhoods = action.payload;
      })
      .addCase(fetchLocationDrillDown.fulfilled, (state, action) => {
        state.governorates = [action.payload.governorate, ...state.governorates];
        state.districts = action.payload.districts;
      });
  },
});

export const {
  selectGovernorate,
  selectDistrict,
  selectNeighborhood,
  resetSelection,
  clearError,
} = mapSlice.actions;
export default mapSlice.reducer;
