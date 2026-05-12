import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteBoard,
  deleteCard,
  deleteList,
  getBoard,
  getBoards,
  postCard,
  postList,
  postNewBoard,
  putBoardUpdates,
  putCardsUpdates,
  putCardUpdates,
  putListsUpdates,
  putListUpdates,
} from '../../api/boardsService';
import { IBoard } from '../../common/interfaces/IBoard';
import { IList } from '../../common/interfaces/IList';
import { ICard } from '../../common/interfaces/ICard';
import { handleCardInternalMove } from '../../pages/Board/utils/dndHandlers/handleCardInternalMove';
import { handleCardCrossListMove } from '../../pages/Board/utils/dndHandlers/handleCardCrossListMove';
import { handleListReorder } from '../../pages/Board/utils/dndHandlers/handleListReorder';
import { IDragCardPayload } from '../../common/interfaces/IDragCardPayload';

interface UpdateBoardPayload {
  boardId: number;
  boardData: IBoard;
}

interface UpdateListPayload {
  boardId: number;
  listData: IList;
}

interface UpdateCardPayload {
  boardId: number;
  cardData: ICard;
}

interface UpdateGroupListsPayload {
  boardId: number;
  listsData: IList[];
}

interface UpdateGroupCardsPayload {
  boardId: number;
  cardsData: ICard[];
}
interface BoardsState {
  boards: IBoard[];
  activeBoard: IBoard | null;
}
export const fetchAllBoardsThunk = createAsyncThunk('boards/fetchAll', async () => {
  const data = await getBoards();
  return data;
});

export const fetchBoardThunk = createAsyncThunk('board/fetchBoard', async (boardId: number, { rejectWithValue }) => {
  try {
    const response = await getBoard(boardId);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteBoardThunk = createAsyncThunk('board/deleteBoard', async (boardId: number, { rejectWithValue }) => {
  try {
    await deleteBoard(boardId);
    return boardId;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createBoardThunk = createAsyncThunk(
  `board/createBoard`,
  async (boardData: IBoard, { rejectWithValue }) => {
    try {
      await postNewBoard(boardData);
      return boardData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateBoardThunk = createAsyncThunk(
  'board/updateBoard',
  async (payload: UpdateBoardPayload, { rejectWithValue }) => {
    const { boardData, boardId } = payload;
    try {
      await putBoardUpdates(boardId, boardData);
      return payload;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createListThunk = createAsyncThunk<UpdateListPayload, UpdateListPayload, { rejectValue: unknown }>(
  'list/createList',
  async (payload: UpdateListPayload, { rejectWithValue }) => {
    const { boardId, listData } = payload;
    try {
      if (!listData.title) return rejectWithValue('List have no title');
      await postList(boardId, listData);
      return payload;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateListThunk = createAsyncThunk<UpdateListPayload, UpdateListPayload, { rejectValue: unknown }>(
  'list/updateList',
  async (payload: UpdateListPayload, { rejectWithValue }) => {
    const { boardId, listData } = payload;
    try {
      if (!listData.id) return rejectWithValue('List id is not found');
      await putListUpdates(boardId, listData.id, listData);
      return payload;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteListThunk = createAsyncThunk<UpdateListPayload, UpdateListPayload, { rejectValue: unknown }>(
  'list/deleteList',
  async (payload: UpdateListPayload, { rejectWithValue }) => {
    const { boardId, listData } = payload;
    try {
      if (!listData.id) return rejectWithValue('List id is not found');
      await deleteList(boardId, listData.id);
      return payload;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createCardThunk = createAsyncThunk<number, UpdateCardPayload, { rejectValue: unknown }>(
  'list/createCard',
  async (payload: UpdateCardPayload, { rejectWithValue }) => {
    const { boardId, cardData } = payload;
    try {
      if (!cardData.title) return rejectWithValue('Card have no title');
      return await postCard(boardId, cardData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateGroupListsThunk = createAsyncThunk<
  UpdateGroupListsPayload,
  UpdateGroupListsPayload,
  { rejectValue: unknown }
>('card/updateGroupLists', async (payload: UpdateGroupListsPayload, { rejectWithValue }) => {
  const { boardId, listsData } = payload;
  try {
    await putListsUpdates(boardId, listsData);
    return payload;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateGroupCardsThunk = createAsyncThunk<
  UpdateGroupCardsPayload,
  UpdateGroupCardsPayload,
  { rejectValue: unknown }
>('card/updateGroupCards', async (payload: UpdateGroupCardsPayload, { rejectWithValue }) => {
  const { boardId, cardsData } = payload;
  try {
    await putCardsUpdates(boardId, cardsData);
    return payload;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateCardThunk = createAsyncThunk<UpdateCardPayload, UpdateCardPayload, { rejectValue: unknown }>(
  'card/updateCard',
  async (payload: UpdateCardPayload, { rejectWithValue }) => {
    const { boardId, cardData } = payload;
    try {
      if (!cardData.id) return rejectWithValue('Card id is not found');
      await putCardUpdates(boardId, cardData.id, cardData);
      return payload;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCardThunk = createAsyncThunk<UpdateCardPayload, UpdateCardPayload, { rejectValue: unknown }>(
  'card/deleteCard',
  async (payload: UpdateCardPayload, { rejectWithValue, getState, dispatch }) => {
    const { boardId, cardData } = payload;
    try {
      if (!cardData.position || !cardData.id) return rejectWithValue('Card id is not found or position is not present');
      await deleteCard(boardId, cardData.id);
      const state = getState() as { boards: BoardsState };
      const lists = state.boards.activeBoard?.lists ?? [];

      const list = lists.find((l) => l.id === cardData.list_id);
      if (list) {
        const updatedCards =
          list.cards
            ?.filter((card) => card.id !== cardData.id)
            .map((card, index) => ({
              id: card.id!,
              position: index + 1,
              list_id: list.id,
            })) ?? [];
        await dispatch(updateGroupCardsThunk({ boardId, cardsData: updatedCards })).unwrap();
      }
      return payload;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const processCardMoveThunk = createAsyncThunk(
  'board/processCardMove',
  async (payload: IDragCardPayload, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { boards: BoardsState };
    const lists = state.boards.activeBoard?.lists;
    if (!lists) return rejectWithValue('No lists found');
    const isInternal = payload.sourceListId === payload.targetListId;
    const cardsToUpdate = isInternal ? handleCardInternalMove(payload, lists) : handleCardCrossListMove(payload, lists);

    try {
      await dispatch(updateGroupCardsThunk({ boardId: payload.boardId, cardsData: cardsToUpdate })).unwrap();
      return undefined;
    } catch (error) {
      return rejectWithValue('Failed to sync card positions');
    }
  }
);

export const processListMoveThunk = createAsyncThunk(
  'board/processListMove',
  async (
    payload: { listId: number; targetPosition: number; boardId: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as { boards: BoardsState };
    const lists = state.boards.activeBoard?.lists;
    if (!lists) return rejectWithValue('No lists found');
    const listsToUpdate = handleListReorder({ listId: payload.listId, targetPosition: payload.targetPosition }, lists);
    try {
      await dispatch(updateGroupListsThunk({ boardId: payload.boardId, listsData: listsToUpdate })).unwrap();
      return undefined;
    } catch (error) {
      return rejectWithValue('Failed to sync list positions');
    }
  }
);
