import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { IBoard } from '../common/interfaces/IBoard';
import { getBoard, putBoardUpdates } from '../api/boardsService';
import { updateCardThunk } from './cardsSlice';
import { ICard } from '../common/interfaces/ICard';

interface UpdateBoardPayload {
  boardId: number;
  boardData: IBoard;
}

interface BoardState {
  activeBoard: IBoard | null;
}

export const fetchBoardThunk = createAsyncThunk('board/fetchBoard', async (boardId: number, { rejectWithValue }) => {
  try {
    const response = await getBoard(boardId);
    if (!response) return rejectWithValue('No board found');
    return response;
  } catch (error) {
    toast.error(`Error getting borad data.`);
    return rejectWithValue(error);
  }
});

export const updateBoardThunk = createAsyncThunk(
  'board/updateBoard',
  async (payload: UpdateBoardPayload, { rejectWithValue }) => {
    const { boardData } = payload;
    try {
      const response = await putBoardUpdates(boardData);
      if (response !== 'Updated') return rejectWithValue('No board found');
      return payload.boardData;
    } catch (error) {
      toast.error(`Error updating borad properties.`);
      return rejectWithValue(error);
    }
  }
);

const initialState: BoardState = {
  activeBoard: null,
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBoardThunk.fulfilled, (state, action) => {
      const builderState = state;
      builderState.activeBoard = action.payload ?? null;
    });
    builder.addCase(updateCardThunk.fulfilled, (state, action) => {
      const builderState = state;
      if (!action.payload || !builderState.activeBoard) return;
      const updatedCard = action.payload as ICard;
      builderState.activeBoard.lists = builderState.activeBoard.lists?.map((list) => {
        if (list.id === updatedCard.list_id) {
          const result = {
            ...list,
            cards: list.cards?.map((card) => (card.id === updatedCard.id ? { ...card, ...updatedCard } : card)),
          };
          return result;
        }
        return list;
      });
    });
  },
});

export default boardSlice.reducer;
