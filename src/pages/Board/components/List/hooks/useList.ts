import toast from 'react-hot-toast';
import { deleteList, putListUpdates } from '../../../../../api/boardsService';

interface IUseListData {
  deleteListById(): Promise<void>;
  changeTitle(title: string): Promise<void>;
}

interface IUseListProps {
  boardId: number;
  listId: number;
  onRefreshList(): void;
}
export function useList({ boardId, listId, onRefreshList }: IUseListProps): IUseListData {
  const deleteListById = async (): Promise<void> => {
    try {
      const response = await deleteList(boardId, listId);
      if (response === 'Deleted') {
        onRefreshList();
      } else {
        toast.error(`Error deleting list`);
      }
    } catch (error) {
      toast.error(`Error deleting list`);
    }
  };

  const changeTitle = async (title: string): Promise<void> => {
    try {
      const listData = { title };
      const response = await putListUpdates(boardId, listId, listData);
      if (response === 'Updated') onRefreshList();
    } catch (error) {
      toast.error(`Error changing list title`);
    }
  };
  return { deleteListById, changeTitle };
}
