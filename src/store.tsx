// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/UserSlice';

export const store = configureStore({
  reducer: {
    userState: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
