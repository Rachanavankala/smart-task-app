// frontend/src/features/tasks/taskSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import taskService from './taskService';

const initialState = {
  tasks: [], tasksDueToday: [], upcomingTasks: [],
  sortOption: 'newest-first', isError: false, isLoading: false,
  message: '', lastCUDTimestamp: null,
};

const handleError = (error) => (error.response?.data?.message) || error.message || error.toString();
export const createTask = createAsyncThunk('tasks/create', async (data, thunkAPI) => { try { const token = thunkAPI.getState().auth.user.token; return await taskService.createTask(data, token); } catch (e) { return thunkAPI.rejectWithValue(handleError(e)); } });
export const getTasks = createAsyncThunk('tasks/getAll', async (_, thunkAPI) => { try { const token = thunkAPI.getState().auth.user.token; return await taskService.getTasks(token); } catch (e) { return thunkAPI.rejectWithValue(handleError(e)); } });
export const getTasksDueToday = createAsyncThunk('tasks/getToday', async (_, thunkAPI) => { try { const token = thunkAPI.getState().auth.user.token; return await taskService.getTasksDueToday(token); } catch (e) { return thunkAPI.rejectWithValue(handleError(e)); } });
export const getUpcomingTasks = createAsyncThunk('tasks/getUpcoming', async (_, thunkAPI) => { try { const token = thunkAPI.getState().auth.user.token; return await taskService.getUpcomingTasks(token); } catch (e) { return thunkAPI.rejectWithValue(handleError(e)); } });
export const updateTask = createAsyncThunk('tasks/update', async (data, thunkAPI) => { try { const token = thunkAPI.getState().auth.user.token; return await taskService.updateTask(data, token); } catch (e) { return thunkAPI.rejectWithValue(handleError(e)); } });
export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => { try { const token = thunkAPI.getState().auth.user.token; return await taskService.deleteTask(id, token); } catch (e) { return thunkAPI.rejectWithValue(handleError(e)); } });

const selectTasks = (state) => state.task.tasks;
const selectSortOption = (state) => state.task.sortOption;
export const selectSortedTasks = createSelector(
  [selectTasks, selectSortOption],
  (tasks, sortOption) => {
    const sortedTasks = [...tasks];
    switch (sortOption) {
      case 'oldest-first': sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'due-date': sortedTasks.sort((a, b) => { if (!a.dueDate) return 1; if (!b.dueDate) return -1; return new Date(a.dueDate) - new Date(b.dueDate); }); break;
      default: sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    }
    return sortedTasks;
  }
);

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    reset: (state) => initialState,
    setSortOption: (state, action) => { state.sortOption = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => { state.isLoading = true; })
      .addCase(getTasks.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      .addCase(getTasks.fulfilled, (state, action) => { state.isLoading = false; state.tasks = action.payload; })
      .addCase(getTasksDueToday.fulfilled, (state, action) => { state.tasksDueToday = action.payload; })
      .addCase(getUpcomingTasks.fulfilled, (state, action) => { state.upcomingTasks = action.payload; })
      .addMatcher(
        (action) => ['tasks/create/fulfilled', 'tasks/update/fulfilled', 'tasks/delete/fulfilled'].includes(action.type),
        (state) => { state.lastCUDTimestamp = new Date().getTime(); }
      );
  },
});
export const { reset, setSortOption } = taskSlice.actions;
export default taskSlice.reducer;