import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './boards/slice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    boards: boardsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
