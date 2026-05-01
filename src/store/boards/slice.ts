import { createSlice } from '@reduxjs/toolkit';
import { IBoard } from '../../common/interfaces/IBoard';
import {
  deleteBoardThunk,
  deleteCardThunk,
  deleteListThunk,
  fetchAllBoardsThunk,
  fetchBoardThunk,
  updateBoardThunk,
  updateCardThunk,
  updateListThunk,
} from './thunks';

interface BoardState {
  boards: IBoard[];
  activeBoard: IBoard | null;
}

const initialState: BoardState = {
  boards: [],
  activeBoard: null,
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBoardThunk.fulfilled, (state, action) => {
      const builderState = state;
      builderState.activeBoard = action.payload;
    });
    builder.addCase(fetchAllBoardsThunk.fulfilled, (state, action) => {
      const builderState = state;
      builderState.boards = action.payload;
    });
    builder.addCase(updateBoardThunk.fulfilled, (state, action) => {
      const builderState = state;
      const updatedBoard = action.payload;
      if (!updatedBoard || !builderState.activeBoard) return;
      if (builderState.activeBoard.id === updatedBoard.id) {
        builderState.activeBoard = {
          ...state.activeBoard,
          ...updatedBoard,
          custom: {
            ...state.activeBoard?.custom,
            ...updatedBoard.custom,
          },
        };
      }
      const boardIndex = state.boards.findIndex((board) => board.id === updatedBoard.id);
      if (boardIndex !== -1) {
        builderState.boards[boardIndex] = {
          ...state.boards[boardIndex],
          title: updatedBoard.title,
          custom: {
            ...state.boards[boardIndex].custom,
            background: updatedBoard.custom?.background,
          },
        };
      }
    });
    builder.addCase(deleteBoardThunk.fulfilled, (state, action) => {
      const deletedBoardId = action.payload;
      const builderState = state;
      builderState.boards = state.boards.filter((board) => board.id !== deletedBoardId);
      if (builderState.activeBoard && builderState.activeBoard.id === deletedBoardId) {
        builderState.activeBoard = null;
      }
    });
    builder.addCase(updateListThunk.fulfilled, (state, action) => {
      const builderState = state;
      const updatedList = action.payload;
      if (!updatedList) return;
      if (builderState.activeBoard?.lists && builderState.activeBoard.id === updatedList.boardId) {
        const list = builderState.activeBoard.lists.find((l) => l.id === updatedList.listData.id);
        if (list) {
          Object.assign(list, updatedList.listData);
        }
      }
    });
    builder.addCase(updateCardThunk.fulfilled, (state, action) => {
      const builderState = state;
      const updatedCard = action.payload;
      if (!updatedCard) return;
      const list = builderState.activeBoard?.lists?.find((l) => l.id === updatedCard.cardData.list_id);
      const card = list?.cards?.find((c) => c.id === updatedCard.cardData.id);
      if (card) {
        Object.assign(card, updatedCard.cardData);
      }
    });
    builder.addCase(deleteListThunk.fulfilled, (state, action) => {
      const builderState = state;
      const deletedListId = action.payload.listData.id;
      if (!builderState.activeBoard?.lists) return;
      builderState.activeBoard.lists = builderState.activeBoard.lists.filter((list) => list.id !== deletedListId);
    });
    builder.addCase(deleteCardThunk.fulfilled, (state, action) => {
      const { id: deletedCardId, list_id: currentListId } = action.payload.cardData;
      if (!state.activeBoard) return;
      const list = state.activeBoard.lists?.find((l) => l.id === currentListId);
      if (list?.cards) {
        list.cards = list.cards.filter((card) => card.id !== deletedCardId);
      }
    });
  },
});

export default boardSlice.reducer;
