import toast from 'react-hot-toast';
import { deleteCard, putCardUpdates } from '../../../../../api/boardsService';
import { ICard } from '../../../../../common/interfaces/ICard';

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
  onListChanged(): void;
}
export function useCard({ boardId, listId, cardId, cardData, onListChanged }: IUseCardProps): IUseCardData {
  const handleCheckedCard = async (): Promise<void> => {
    if (!cardData) return;
    const newCard: ICard = {
      ...cardData,
      custom: {
        ...cardData.custom,
        isChecked: !cardData.custom?.isChecked,
      },
      list_id: listId,
    };
    try {
      const response = await putCardUpdates(newCard, boardId, cardId);
      if (response === 'Updated') onListChanged();
    } catch (error) {
      toast.error('Error updating card properties.');
    }
  };
  const handleDeleteCard = async (): Promise<void> => {
    try {
      const response = await deleteCard(boardId, cardId);
      if (response === 'Deleted') onListChanged();
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
      if (newTitle) {
        const newCard: ICard = { title: newTitle, list_id: listId };
        const response = await putCardUpdates(newCard, boardId, cardData.id!);
        if (response === 'Updated') onListChanged();
      }
    } catch (error) {
      toast.error('Error updating card properties.');
    } finally {
      setVisibleChangeCardTitle(false);
    }
  };
  return { handleCheckedCard, handleDeleteCard, handleChangeTitle };
}
