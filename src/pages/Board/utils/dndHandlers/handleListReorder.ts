import { IList } from '../../../../common/interfaces/IList';

interface IListReorderPayload {
  listId: number;
  targetPosition: number;
}

export const handleListReorder = (payload: IListReorderPayload, lists: IList[]): IList[] => {
  const { listId, targetPosition } = payload;

  const updatedLists = structuredClone(lists);
  const currentIndex = updatedLists.findIndex((l: IList) => l.id === listId);
  if (currentIndex === -1) return [];
  const [movedList] = updatedLists.splice(currentIndex, 1);
  updatedLists.splice(targetPosition - 1, 0, movedList);
  return updatedLists.map((list: IList, index: number) => ({
    ...list,
    position: index + 1,
  }));
};
