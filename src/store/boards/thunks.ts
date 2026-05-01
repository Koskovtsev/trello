import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
  deleteBoard,
  deleteCard,
  deleteList,
  getBoard,
  getBoards,
  postCard,
  postList,
  putBoardUpdates,
  putCardUpdates,
  putListUpdates,
} from '../../api/boardsService';
import { IBoard } from '../../common/interfaces/IBoard';
import { IList } from '../../common/interfaces/IList';
import { ICard } from '../../common/interfaces/ICard';

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

export const fetchAllBoardsThunk = createAsyncThunk('boards/fetchAll', async () => {
  const data = await getBoards();
  return data;
});

export const fetchBoardThunk = createAsyncThunk('board/fetchBoard', async (boardId: number, { rejectWithValue }) => {
  try {
    const response = await getBoard(boardId);
    if (!response) return rejectWithValue('No boards found');
    return { ...response, id: Number(boardId) };
  } catch (error) {
    toast.error(`Error getting board data id: ${boardId}`);
    return rejectWithValue(error);
  }
});

export const deleteBoardThunk = createAsyncThunk('board/deleteBoard', async (boardId: number, { rejectWithValue }) => {
  try {
    const response = await deleteBoard(boardId);
    if (response !== 'Deleted') return rejectWithValue('No board found');
    return boardId;
  } catch (error) {
    toast.error(`Error deleting board id: ${boardId}`);
    return rejectWithValue(error);
  }
});

export const updateBoardThunk = createAsyncThunk(
  'board/updateBoard',
  async (payload: UpdateBoardPayload, { rejectWithValue }) => {
    const { boardData, boardId } = payload;
    try {
      const response = await putBoardUpdates(boardId, boardData);
      if (response !== 'Updated') return rejectWithValue('No board found');
      return { ...boardData, id: boardId };
    } catch (error) {
      toast.error(`Error updating board properties id: ${boardId}`);
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
      const response = await postList(boardId, listData);
      if (response !== 'Created') return rejectWithValue('No board found');
      return payload;
    } catch (error) {
      toast.error(`Error creating list with title: ${listData.title}`);
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
      const response = await putListUpdates(boardId, listData.id, listData);
      if (response !== 'Updated') return rejectWithValue('No list found');
      return payload;
    } catch (error) {
      toast.error(`Error updating list properties id: ${listData.id}`);
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
      const response = await deleteList(boardId, listData.id);
      if (response !== 'Deleted') return rejectWithValue('No list found');
      return payload;
    } catch (error) {
      toast.error(`Error deleting list id: ${listData.id}`);
      return rejectWithValue(error);
    }
  }
);

export const createCardThunk = createAsyncThunk<UpdateCardPayload, UpdateCardPayload, { rejectValue: unknown }>(
  'list/createCard',
  async (payload: UpdateCardPayload, { rejectWithValue }) => {
    const { boardId, cardData } = payload;
    try {
      if (!cardData.title) return rejectWithValue('Card have no title');
      const response = await postCard(boardId, cardData);
      if (response !== 'Created') return rejectWithValue('No board found');
      return payload;
    } catch (error) {
      toast.error(`Error creating card with title: ${cardData.title}`);
      return rejectWithValue(error);
    }
  }
);

export const updateCardThunk = createAsyncThunk<UpdateCardPayload, UpdateCardPayload, { rejectValue: unknown }>(
  'card/updateCard',
  async (payload: UpdateCardPayload, { rejectWithValue }) => {
    const { boardId, cardData } = payload;
    try {
      if (!cardData.id) return rejectWithValue('Card id is not found');
      const response = await putCardUpdates(boardId, cardData.id, cardData);
      if (response !== 'Updated') return rejectWithValue('No card found');
      return payload;
    } catch (error) {
      toast.error(`Error updating card propertes id: ${cardData.id}`);
      return rejectWithValue(error);
    }
  }
);

export const deleteCardThunk = createAsyncThunk<UpdateCardPayload, UpdateCardPayload, { rejectValue: unknown }>(
  'card/deleteCard',
  async (payload: UpdateCardPayload, { rejectWithValue }) => {
    const { boardId, cardData } = payload;
    try {
      if (!cardData.id) return rejectWithValue('Card id is not found');
      const response = await deleteCard(boardId, cardData.id);
      if (response !== 'Updated') return rejectWithValue('No card found');
      return payload;
    } catch (error) {
      toast.error(`Error updating card propertes id: ${cardData.id}`);
      return rejectWithValue(error);
    }
  }
);
