import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBoard } from '../common/interfaces/IBoard';

type TextureTarget =
  | { type: 'list'; boardId: number; listId: number }
  | { type: 'card'; boardId: number; listId: number; cardId: number }
  | { type: 'board'; boardId: number };

interface UiState {
  textureModal: {
    isOpen: boolean;
    target: TextureTarget | null;
    coords: { top: number; left: number } | null;
  };
  activeBoard: IBoard | null;
}

const initialState: UiState = {
  textureModal: {
    isOpen: false,
    target: null,
    coords: null,
  },
  activeBoard: null,
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
  },
});

export const { openTextureModal, closeTextureModal } = uiSlice.actions;
export default uiSlice.reducer;
