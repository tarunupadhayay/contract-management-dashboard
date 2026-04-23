import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import contractReducer from './contractSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contracts: contractReducer,
  },
  devTools: import.meta.env.DEV,
});
