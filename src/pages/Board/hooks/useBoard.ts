import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { AppDispatch, RootState } from '../../../store/store';
import { createListThunk, updateBoardThunk } from '../../../store/boards/thunks';
import { closeTextureModal, openTextureModal } from '../../../store/uiSlice';
import { IList } from '../../../common/interfaces/IList';
import { getBoard } from '../../../api/boardsService';
import { IBoard } from '../../../common/interfaces/IBoard';

type TextureTarget =
  | { type: 'list'; boardId: number; listId: number }
  | { type: 'card'; boardId: number; listId: number; cardId: number }
  | { type: 'board'; boardId: number };

interface UseBoardData {
  handleChangeTitle(title: string): Promise<void>;
  handleTextureModal(e: React.MouseEvent<HTMLButtonElement>, target: TextureTarget): void;
  handleListAdded(title: string, texture: string, position: number): Promise<void>;
}

export function useBoard(boardId: number): UseBoardData {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen } = useSelector((state: RootState) => state.ui.textureModal);
  const handleChangeTitle = async (title: string): Promise<void> => {
    try {
      const payload = {
        boardId,
        boardData: {
          title,
        },
      };
      await dispatch(updateBoardThunk(payload));
    } catch (error) {
      toast.error(`Error changing board title`);
    }
  };
  const handleTextureModal = (e: React.MouseEvent<HTMLButtonElement>, target: TextureTarget): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const coords = {
      top: rect.top + window.scrollY,
      left: rect.right + window.scrollX + 10,
    };
    try {
      if (isOpen) {
        dispatch(closeTextureModal());
      } else {
        dispatch(openTextureModal({ target, coords }));
      }
    } catch (error) {
      toast.error(`Error change texture`);
    }
  };

  const handleListAdded = async (title: string, texture: string, position: number): Promise<void> => {
    const listData: IList = {
      title: title.trim(),
      position,
    };
    try {
      await dispatch(createListThunk({ boardId, listData })).unwrap();
      const newBoard = await getBoard(boardId);
      const newListId = newBoard.lists?.find((list) => list.position === position)?.id;
      if (!newListId) return;
      const boardData: IBoard = {
        ...newBoard,
        custom: {
          ...newBoard.custom,
          listTextures: {
            ...newBoard.custom?.listTextures,
            [newListId]: texture,
          },
        },
      };
      await dispatch(updateBoardThunk({ boardId, boardData }));
    } catch (error) {
      toast.error(`Error changing board title`);
    }
  };
  return { handleChangeTitle, handleTextureModal, handleListAdded };
}
