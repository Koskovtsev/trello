import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { putCardUpdates } from '../api/boardsService';
import { ICard } from '../common/interfaces/ICard';

interface UpdateCardPayload {
  cardData: ICard;
  boardId: number;
  cardId: number;
}

interface CardsState {
  isOpen: boolean;
  activeCard: ICard | null;
}

export const updateCardThunk = createAsyncThunk('cards/updateCard', async (payload: UpdateCardPayload) => {
  const { cardData, boardId, cardId } = payload;
  try {
    const response = await putCardUpdates(cardData, boardId, cardId);
    if (response === 'Updated') {
      return payload.cardData;
    }
    return null;
  } catch (error) {
    toast.error(`Error updating card properties.`);
    return error;
  }
});
const initialState: CardsState = {
  isOpen: false,
  activeCard: null,
};
const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const modalState = state;
      modalState.activeCard = action.payload;
      modalState.isOpen = true;
    },
    closeModal: (state) => {
      const modalState = state;
      modalState.activeCard = null;
      modalState.isOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCardThunk.fulfilled, (state, action) => {
      const builderState = state;
      builderState.activeCard = action.payload ?? null;
    });
  },
});
export const { openModal, closeModal } = cardsSlice.actions;
export default cardsSlice.reducer;
