import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { AppDispatch, RootState } from '../../../store/store';
import { updateBoardThunk } from '../../../store/boards/thunks';
import { closeTextureModal, openTextureModal } from '../../../store/uiSlice';

type TextureTarget =
  | { type: 'list'; boardId: number; listId: number }
  | { type: 'card'; boardId: number; listId: number; cardId: number }
  | { type: 'board'; boardId: number };

interface UseBoardData {
  handleChangeTitle(title: string): void;
  handleTextureModal(e: React.MouseEvent<HTMLButtonElement>, target: TextureTarget): void;
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
  return { handleChangeTitle, handleTextureModal };
}
