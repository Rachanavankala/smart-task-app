// frontend/src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/tasks/taskSlice';
import adminReducer from '../features/admin/adminSlice'; 
import statsReducer from '../features/stats/statsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    admin: adminReducer,
    stats: statsReducer,
  },
  // devTools is true by default, so it will connect automatically
});
