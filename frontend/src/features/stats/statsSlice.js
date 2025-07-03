// frontend/src/features/stats/statsSlice.js
// --- FINAL, CORRECTED VERSION ---

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import statsService from './statsService';

const initialState = {
  data: [], // For the chart
  popularCategories: [], // For the new list
  createdVsCompleted: { labels: [], createdData: [], completedData: [] }, 
  isError: false,
  isLoading: false,
  message: '',
};

// --- ASYNC THUNKS ---

// Thunk for getting chart data
export const getTaskStats = createAsyncThunk(
  'stats/getTaskStats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await statsService.getTaskStats(token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- THIS IS THE MISSING THUNK ---
// Thunk for getting popular categories
export const getPopularCategories = createAsyncThunk(
  'stats/getPopular',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await statsService.getPopularCategories(token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getCreatedVsCompletedStats = createAsyncThunk('stats/getCreatedVsCompleted', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await statsService.getCreatedVsCompletedStats(token);
    } catch (error) { const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message); }
});


// --- THE SLICE ---
export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Cases for the chart data
      .addCase(getTaskStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaskStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getTaskStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // --- ADD CASES FOR THE NEW ACTION ---
      .addCase(getPopularCategories.fulfilled, (state, action) => {
        state.popularCategories = action.payload;
      })
      .addCase(getPopularCategories.rejected, (state, action) => {
        // We can share the same error state
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCreatedVsCompletedStats.fulfilled, (state, action) => {
    state.createdVsCompleted = action.payload;
});
  },
});

export const { reset } = statsSlice.actions;
export default statsSlice.reducer;