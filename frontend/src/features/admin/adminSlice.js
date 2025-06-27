// frontend/src/features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';

const initialState = { users: [], userTasks: [], report: '', isError: false, isLoading: false, message: '' };

const handleError = (error) => (error.response?.data?.message) || error.message || error.toString();
export const getUsers = createAsyncThunk('admin/getUsers', async (_, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.user.token; return await adminService.getUsers(token); }
    catch (error) { return thunkAPI.rejectWithValue(handleError(error)); }
});
export const deactivateUser = createAsyncThunk('admin/deactivate', async (id, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.user.token; await adminService.deactivateUser(id, token); return id; }
    catch (error) { return thunkAPI.rejectWithValue(handleError(error)); }
});
export const getUserTasks = createAsyncThunk('admin/getUserTasks', async (id, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.user.token; return await adminService.getUserTasks(id, token); }
    catch (error) { return thunkAPI.rejectWithValue(handleError(error)); }
});
export const generateReport = createAsyncThunk('admin/generateReport', async (_, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.user.token; return await adminService.generateReport(token); }
    catch (error) { return thunkAPI.rejectWithValue(handleError(error)); }
});

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetUserTasks: (state) => { state.userTasks = []; },
    resetReport: (state) => { state.report = ''; }
  },
  extraReducers: (builder) => {
    builder
        .addCase(getUsers.pending, (state) => { state.isLoading = true; })
        .addCase(getUsers.fulfilled, (state, action) => { state.isLoading = false; state.users = action.payload; })
        .addCase(deactivateUser.fulfilled, (state, action) => {
            state.users = state.users.map((user) => user._id === action.payload ? { ...user, isActive: false } : user );
        })
        .addCase(getUserTasks.pending, (state) => { state.isLoading = true; })
        .addCase(getUserTasks.fulfilled, (state, action) => { state.isLoading = false; state.userTasks = action.payload; })
        .addCase(generateReport.pending, (state) => { state.isLoading = true; state.report = ''; })
        .addCase(generateReport.fulfilled, (state, action) => { state.isLoading = false; state.report = action.payload.report; })
        .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
            state.isLoading = false; state.isError = true; state.message = action.payload;
        });
  },
});

export const { reset, resetUserTasks, resetReport } = adminSlice.actions;
export default adminSlice.reducer;