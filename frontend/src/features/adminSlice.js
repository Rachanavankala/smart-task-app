// frontend/src/features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';

const initialState = { users: [], isError: false, isLoading: false, message: '' };

export const getUsers = createAsyncThunk('admin/getUsers', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getUsers(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deactivateUser = createAsyncThunk('admin/deactivate', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        await adminService.deactivateUser(id, token);
        return id; // Return the ID of the deactivated user
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: { reset: (state) => initialState },
  extraReducers: (builder) => {
    builder
        .addCase(getUsers.pending, (state) => { state.isLoading = true; })
        .addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.users = action.payload;
        })
        .addCase(getUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
         })
        .addCase(deactivateUser.fulfilled, (state, action) => {
            state.users = state.users.map((user) =>
                user._id === action.payload ? { ...user, isActive: false } : user
            );
        });
  },
});

export const { reset} = adminSlice.actions;
export default adminSlice.reducer;