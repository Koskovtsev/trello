import { putCardsUpdates, putListsUpdates } from '../../../../api/boardsService';
import { ICard } from '../../../../common/interfaces/ICard';
import { IList } from '../../../../common/interfaces/IList';
import { IDragEvent } from '../../../../common/interfaces/IDragEvent';

function getReorderedIds(items: ICard[] | IList[], draggedId: number, targetId: number): number[] {
  const currentIds = items.map((item) => item.id!);
  const targetIndex = currentIds.indexOf(targetId);
  const reorderedIds = currentIds.filter((id) => id !== draggedId);
  reorderedIds.splice(targetIndex, 0, draggedId);
  return reorderedIds;
}
function mapCardsToPayload(cardIds: number[], listId: number): { id: number; position: number; list_id: number }[] {
  return cardIds.map((id, index) => ({ id, position: index + 1, list_id: listId }));
}
function mapListsToPayload(listIds: number[]): { id: number; position: number }[] {
  return listIds.map((id, index) => ({ id, position: index + 1 }));
}
export async function updatePosition(
  { draggedId, targetId, sourceContainerId, targetContainerId }: IDragEvent,
  lists: IList[],
  boardId: number
): Promise<boolean> {
  const isCardMove = sourceContainerId !== undefined && targetContainerId !== undefined;
  if (isCardMove) {
    const sourceCards = lists.find((elem) => elem.id === sourceContainerId)?.cards ?? [];
    const targetCards =
      sourceContainerId === targetContainerId
        ? sourceCards
        : lists.find((elem) => elem.id === targetContainerId)?.cards ?? [];
    if (sourceContainerId === targetContainerId) {
      const updatedIds = getReorderedIds(sourceCards, draggedId, targetId);
      const cardsPayload = mapCardsToPayload(updatedIds, sourceContainerId);
      return (await putCardsUpdates(cardsPayload, boardId)) === 'Updated';
    }
    const sourceIds = sourceCards.map((elem) => elem.id!).filter((id) => id !== draggedId);
    const targetIds = getReorderedIds(targetCards, draggedId, targetId);
    const cardsPayload = [
      ...mapCardsToPayload(sourceIds, sourceContainerId),
      ...mapCardsToPayload(targetIds, targetContainerId),
    ];
    return (await putCardsUpdates(cardsPayload, boardId)) === 'Updated';
  }
  const updatedIds = getReorderedIds(lists, draggedId, targetId);
  const listsPayload = mapListsToPayload(updatedIds);
  return (await putListsUpdates(listsPayload, boardId)) === 'Updated';
}
