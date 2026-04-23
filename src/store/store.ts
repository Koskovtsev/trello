import { configureStore } from '@reduxjs/toolkit';
import cardsReduser from './cardsSlice';
import boardsReduser from './boardsSlice';

export const store = configureStore({
  reducer: {
    cards: cardsReduser,
    boards: boardsReduser,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
