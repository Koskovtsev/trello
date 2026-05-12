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
  updateGroupCardsThunk,
  updateGroupListsThunk,
  updateListThunk,
  processCardMoveThunk,
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
      const updatedBoard = action.payload.boardData;
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
    builder.addCase(deleteListThunk.fulfilled, (state, action) => {
      const builderState = state;
      const deletedListId = action.payload.listData.id;
      if (!builderState.activeBoard?.lists) return;
      builderState.activeBoard.lists = builderState.activeBoard.lists.filter((list) => list.id !== deletedListId);
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
    builder.addCase(deleteCardThunk.fulfilled, (state, action) => {
      const { id: deletedCardId, list_id: currentListId } = action.payload.cardData;
      if (!state.activeBoard) return;
      const list = state.activeBoard.lists?.find((l) => l.id === currentListId);
      if (list?.cards) {
        list.cards = list.cards.filter((card) => card.id !== deletedCardId);
      }
    });
    builder.addCase(updateGroupListsThunk.fulfilled, (state, action) => {
      const { listsData } = action.payload;
      const builderState = state;
      if (!builderState.activeBoard) return;
      builderState.activeBoard.lists = listsData.sort((a, b) => {
        const posA = a.position ?? 0;
        const posB = b.position ?? 0;
        return posA - posB;
      });
    });
    builder.addCase(updateGroupCardsThunk.fulfilled, (state, action) => {
      const { cardsData } = action.payload;
      const builderState = state;
      if (!builderState.activeBoard?.lists) return;

      builderState.activeBoard.lists = builderState.activeBoard.lists.map((list) => {
        const updatesForList = cardsData.filter((card) => card.list_id === list.id);
        if (!updatesForList.length || !list.cards) {
          return list;
        }
        const updatesMap = new Map(
          updatesForList.map((card) => [
            card.id,
            {
              position: card.position,
              list_id: card.list_id,
            },
          ])
        );

        const updatedCards = list.cards.map((existingCard) => {
          const update = updatesMap.get(existingCard.id);
          if (!update) {
            return existingCard;
          }
          return {
            ...existingCard,
            position: update.position,
            list_id: update.list_id,
          };
        });
        return {
          ...list,
          cards: updatedCards.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
        };
      });
    });

    builder.addCase(processCardMoveThunk.fulfilled, (state, action) => {
      const { cardId, sourceListId, targetListId, targetPosition } = action.meta.arg;
      const { activeBoard } = state;
      if (!activeBoard?.lists) return;
      const sourceList = activeBoard.lists.find((l) => l.id === sourceListId);
      const targetList = activeBoard.lists.find((l) => l.id === targetListId);

      if (!sourceList?.cards || !targetList) return;
      const cardIndex = sourceList.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return;
      const [movedCard] = sourceList.cards.splice(cardIndex, 1);
      movedCard.list_id = targetListId;
      movedCard.position = targetPosition;

      if (!targetList.cards) targetList.cards = [];
      targetList.cards.splice(targetPosition - 1, 0, movedCard);
      sourceList.cards = sourceList.cards.map((card, i) => ({
        ...card,
        position: i + 1,
      }));
      targetList.cards = targetList.cards.map((card, i) => ({
        ...card,
        position: i + 1,
      }));
    });
  },
});

export default boardSlice.reducer;
