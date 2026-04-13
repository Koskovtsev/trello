import { IList } from '../../../common/interfaces/IList';

export const calculateNewPositionsAfterDelete = (lists: IList[], deletedListId: number): void => {
  lists.filter((list) => list.id !== deletedListId).map((list, index) => ({ id: list.id!, position: index + 1 }));
};
