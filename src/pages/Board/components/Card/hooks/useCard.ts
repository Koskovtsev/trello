import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { ICard } from '../../../../../common/interfaces/ICard';
import { AppDispatch } from '../../../../../store/store';
import {
  deleteCardThunk,
  fetchBoardThunk,
  processCardMoveThunk,
  updateCardThunk,
} from '../../../../../store/boards/thunks';
import { IDragCardPayload } from '../../../../../common/interfaces/IDragCardPayload';

interface IUseCardData {
  handleCheckedCard(): void;
  handleDeleteCard(): void;
  handleChangeTitle(title: string, setVisibleChangeCardTitle: (isVisible: boolean) => void): void;
  handleSaveDescription(descriptionText: string): void;
  handleDragCard(
    draggedCardId: number,
    sourceListId: number,
    targetListId: number,
    sourcePosition: number,
    targetPosition: number
  ): Promise<void>;
}
interface IUseCardProps {
  boardId: number;
  listId?: number;
  cardId: number;
  cardData?: ICard;
}
export function useCard({ boardId, listId, cardId, cardData }: IUseCardProps): IUseCardData {
  const dispatch = useDispatch<AppDispatch>();
  const handleCheckedCard = async (): Promise<void> => {
    if (!cardData) return;
    const payload = {
      boardId,
      cardData: {
        ...cardData,
        custom: {
          ...cardData.custom,
          isChecked: !cardData.custom?.isChecked,
        },
        list_id: listId,
      },
    };
    try {
      await dispatch(updateCardThunk(payload)).unwrap();
    } catch (error) {
      toast.error('Error updating card properties.');
    }
  };
  const handleDeleteCard = async (): Promise<void> => {
    try {
      const payload = {
        boardId,
        cardData: {
          id: cardId,
          position: cardData?.position,
          list_id: listId,
        },
      };
      await dispatch(deleteCardThunk(payload)).unwrap();
      await dispatch(fetchBoardThunk(boardId)).unwrap();
    } catch (error) {
      toast.error(`Error deleting card ${String(error)}`);
    }
  };
  const handleChangeTitle = async (
    newTitle: string,
    setVisibleChangeCardTitle: (isVisible: boolean) => void
  ): Promise<void> => {
    if (!cardData) return;
    try {
      const payload = {
        boardId,
        cardData: {
          ...cardData,
          title: newTitle,
          list_id: listId,
        },
      };
      await dispatch(updateCardThunk(payload)).unwrap();
    } catch (error) {
      toast.error('Error updating card properties.');
    } finally {
      setVisibleChangeCardTitle(false);
    }
  };
  const handleSaveDescription = async (descriptionText: string): Promise<void> => {
    const payload = {
      boardId,
      cardData: {
        ...cardData,
        description: descriptionText,
        list_id: listId,
      },
    };
    try {
      await dispatch(updateCardThunk(payload)).unwrap();
    } catch (error) {
      toast.error('Error updating card properties.');
    }
  };
  const handleDragCard = async (
    draggedCardId: number,
    sourceListId: number,
    targetListId: number,
    sourcePosition: number,
    targetPosition: number
  ): Promise<void> => {
    const payload: IDragCardPayload = {
      cardId: draggedCardId,
      sourceListId,
      targetListId,
      sourcePosition,
      targetPosition,
      boardId,
    };
    await dispatch(processCardMoveThunk(payload)).unwrap();
  };
  return { handleCheckedCard, handleDeleteCard, handleChangeTitle, handleSaveDescription, handleDragCard };
}
