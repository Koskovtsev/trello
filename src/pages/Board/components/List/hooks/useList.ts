import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../store/store';
import { deleteListThunk, updateListThunk } from '../../../../../store/boards/thunks';

interface IUseListData {
  deleteListById(): Promise<void>;
  changeTitle(title: string): Promise<void>;
}

interface IUseListProps {
  boardId: number;
  listId: number;
  // onRefreshList(): void;
}
export function useList({ boardId, listId }: IUseListProps): IUseListData {
  const dispatch = useDispatch<AppDispatch>();

  const deleteListById = async (): Promise<void> => {
    try {
      const payload = {
        boardId,
        listData: {
          id: listId,
        },
      };
      await dispatch(deleteListThunk(payload)).unwrap();
    } catch (error) {
      toast.error(`Error deleting list`);
    }
  };

  const changeTitle = async (title: string): Promise<void> => {
    try {
      const payload = {
        boardId,
        listData: {
          id: listId,
          title,
        },
      };
      await dispatch(updateListThunk(payload)).unwrap();
    } catch (error) {
      toast.error(`Error changing list title`);
    }
  };
  return { deleteListById, changeTitle };
}
