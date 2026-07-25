import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../api/authAPI';
import apiClient from '../../../core/api/apiClient';

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(credentials);
      // Handle Backend Response: { user, accessToken, refreshToken }
      apiClient.setToken(response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken || '');
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      // Handle Backend Response: { user, accessToken, refreshToken }
      apiClient.setToken(response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken || '');
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authAPI.getProfile();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await authAPI.refreshToken(refreshToken);
      apiClient.setToken(response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }
      return { accessToken: response.accessToken };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      authAPI.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');
      if (token) {
        state.accessToken = token;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Refresh Token
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.isAuthenticated = false;
        state.accessToken = null;
        state.user = null;
      });
  },
});

export const { logout, clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
