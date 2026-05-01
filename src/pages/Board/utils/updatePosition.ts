import { putCardsUpdates, putListsUpdates } from '../../../api/boardsService';
import { ICard } from '../../../common/interfaces/ICard';
import { IList } from '../../../common/interfaces/IList';
import { IDragEvent } from '../../../common/interfaces/IDragEvent';
// TODO: три різні події під різні випадки. Кожен випадок має викликати свою подію в окремому файлі. + має бути файл-диригент який управлятиме BoardService.syncPositions().
// handleListReorder.ts — рух списків. handleCardInternalMove.ts — рух картки в межах одного списку. handleCardCrossListMove.ts — переміщення картки між списками.
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
// TODO: погана назва для файлу та і функції в цілому, не зрозуміло що воно робить.
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
      return (await putCardsUpdates(boardId, cardsPayload)) === 'Updated'; // TODO: винести в окремий файл зв'язок з сервером?
    }
    const sourceIds = sourceCards.map((elem) => elem.id!).filter((id) => id !== draggedId);
    const targetIds = getReorderedIds(targetCards, draggedId, targetId);
    const cardsPayload = [
      ...mapCardsToPayload(sourceIds, sourceContainerId),
      ...mapCardsToPayload(targetIds, targetContainerId),
    ];
    return (await putCardsUpdates(boardId, cardsPayload)) === 'Updated'; // TODO: винести в окремий файл зв'язок з сервером?
  }
  const updatedIds = getReorderedIds(lists, draggedId, targetId);
  const listsPayload = mapListsToPayload(updatedIds);
  return (await putListsUpdates(boardId, listsPayload)) === 'Updated'; // TODO: винести в окремий файл зв'язок з сервером?
}
// export async function updatePosition(event: IDragEvent, lists: IList[], boardId: number): Promise<boolean> {
//   // 1. Вибираємо сценарій (Handler)
//   const handler = getHandlerForEvent(event);
//   // 2. Отримуємо дані для відправки (чиста логіка)
//   const payload = handler.calculate(event, lists);
//   // 3. Диригент каже API-сервісу: "Відправ це", не знаючи деталей самого API
//   const result = await handler.sync(payload, boardId);
//   return result;
// }

// або

// export async function updatePosition(event: IDragEvent, lists: IList[], boardId: number): Promise<boolean> {
//   const { sourceContainerId, targetContainerId } = event;
//   // Визначаємо тип події (сценарій)
//   const isCardMove = !!sourceContainerId && !!targetContainerId;
//   const isInternal = sourceContainerId === targetContainerId;
//   // Викликаємо відповідний сценарій
//   if (isCardMove) {
//     return isInternal
//       ? handleInternalCardMove(event, lists, boardId)
//       : handleCrossListCardMove(event, lists, boardId);
//   }
//   return handleListMove(event, lists, boardId);
// }
