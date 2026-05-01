import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TextureTarget =
  | { type: 'list'; boardId: number; listId: number }
  | { type: 'card'; boardId: number; listId: number; cardId: number }
  | { type: 'board'; boardId: number };

type CardMenuTarget = {
  boardId: number;
  listId: number;
  cardId: number;
};

interface UiState {
  textureModal: {
    isOpen: boolean;
    target: TextureTarget | null;
    coords: { top: number; left: number } | null;
  };
  cardMenu: {
    isOpen: boolean;
    target: CardMenuTarget | null;
  };
}

const initialState: UiState = {
  textureModal: {
    isOpen: false,
    target: null,
    coords: null,
  },
  cardMenu: {
    isOpen: false,
    target: null,
  },
};

const uiSlice = createSlice({
  name: 'ui/textureModal',
  initialState,
  reducers: {
    openTextureModal(state, action: PayloadAction<{ target: TextureTarget; coords: { top: number; left: number } }>) {
      const modalState = state;
      modalState.textureModal.isOpen = true;
      modalState.textureModal.target = action.payload.target;
      modalState.textureModal.coords = action.payload.coords;
    },
    closeTextureModal(state) {
      const modalState = state;
      modalState.textureModal.isOpen = false;
      modalState.textureModal.target = null;
      modalState.textureModal.coords = null;
    },
    openCardModal(state, action: PayloadAction<CardMenuTarget>) {
      const modalState = state;
      modalState.cardMenu.isOpen = true;
      modalState.cardMenu.target = action.payload;
    },
    closeCardModal(state) {
      const modalState = state;
      modalState.cardMenu.isOpen = false;
      modalState.cardMenu.target = null;
    },
  },
});

export const { openTextureModal, closeTextureModal, openCardModal, closeCardModal } = uiSlice.actions;
export default uiSlice.reducer;
