import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateBoardThunk, updateCardThunk } from './boards/thunks';
import { RootState } from './store';
import { ICard } from '../common/interfaces/ICard';

export const applyTexture = createAsyncThunk('texture/apply', async (texture: string, { getState, dispatch }) => {
  const state = getState() as RootState;
  const { target } = state.ui.textureModal;
  const board = state.boards.activeBoard;
  if (!target || !board) return;
  switch (target.type) {
    case 'list': {
      const listTextures = board?.custom?.listTextures || {};

      const updated = {
        ...listTextures,
        [target.listId]: texture,
      };

      await dispatch(
        updateBoardThunk({
          boardId: target.boardId,
          boardData: {
            title: board.title,
            custom: {
              ...board.custom,
              listTextures: updated,
            },
          },
        })
      );
      break;
    }

    case 'card': {
      const list = board.lists?.find((l) => l.id === target.listId);
      const currentCard = list?.cards?.find((c) => c.id === target.cardId);

      await dispatch(
        updateCardThunk({
          boardId: target.boardId,
          cardData: {
            ...currentCard,
            id: target.cardId,
            list_id: target.listId,
            custom: {
              ...currentCard?.custom,
              background: texture,
            },
          } as ICard,
        })
      );
      break;
    }

    case 'board':
      await dispatch(
        updateBoardThunk({
          boardId: target.boardId,
          boardData: {
            title: board.title,
            custom: {
              ...board.custom,
              background: texture,
            },
          },
        })
      );
      break;
    default:
      break;
  }
});
