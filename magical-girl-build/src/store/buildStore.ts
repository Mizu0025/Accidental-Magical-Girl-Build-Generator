import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './buildSlice';

export const store = configureStore({
  reducer: {
    build: reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
