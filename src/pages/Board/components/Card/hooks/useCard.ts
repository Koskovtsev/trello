import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
// import { deleteCard, putCardUpdates } from '../../../../../api/boardsService';
import { ICard } from '../../../../../common/interfaces/ICard';
import { AppDispatch } from '../../../../../store/store';
import { deleteCardThunk, fetchBoardThunk, updateCardThunk } from '../../../../../store/boards/thunks';
// import { title } from 'process';

interface IUseCardData {
  handleCheckedCard(): void;
  handleDeleteCard(): void;
  handleChangeTitle(title: string, setVisibleChangeCardTitle: (isVisible: boolean) => void): void;
}
interface IUseCardProps {
  boardId: number;
  listId?: number;
  cardId: number;
  cardData?: ICard;
  // onListChanged(): void;
}
export function useCard({ boardId, listId, cardId, cardData }: IUseCardProps): IUseCardData {
  const dispatch = useDispatch<AppDispatch>();
  const handleCheckedCard = (): void => {
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
      dispatch(updateCardThunk(payload));
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
        },
      };
      dispatch(deleteCardThunk(payload));
      dispatch(fetchBoardThunk(boardId));
    } catch (error) {
      toast.error('Error updating card properties.');
    }
  };
  const handleChangeTitle = async (
    newTitle: string,
    setVisibleChangeCardTitle: (isVisible: boolean) => void
  ): Promise<void> => {
    if (!cardData) return;
    try {
      // const newCard: ICard = { title: newTitle, list_id: listId };
      // const response = await putCardUpdates(boardId, cardData.id!, newCard);
      // if (response === 'Updated') onListChanged();
      const payload = {
        boardId,
        cardData: {
          title: newTitle,
          list_id: listId,
        },
      };
      dispatch(updateCardThunk(payload));
    } catch (error) {
      toast.error('Error updating card properties.');
    } finally {
      setVisibleChangeCardTitle(false);
    }
  };
  return { handleCheckedCard, handleDeleteCard, handleChangeTitle };
}
