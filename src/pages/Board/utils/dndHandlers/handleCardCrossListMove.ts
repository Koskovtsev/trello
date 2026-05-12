import { ICard } from '../../../../common/interfaces/ICard';
import { IDragCardPayload } from '../../../../common/interfaces/IDragCardPayload';
import { IList } from '../../../../common/interfaces/IList';

export const handleCardCrossListMove = (payload: IDragCardPayload, lists: IList[]): ICard[] => {
  const { sourceListId, targetListId, cardId, targetPosition } = payload;

  const sourceList = lists.find((l) => l.id === sourceListId);
  const targetList = lists.find((l) => l.id === targetListId);

  if (!sourceList || !targetList) return [];
  const sourceCards = (sourceList.cards || []).filter((c) => c.id !== cardId);
  const movedCard = (sourceList.cards || []).find((c) => c.id === cardId);
  if (!movedCard) return [];
  const targetCards = [...(targetList.cards || [])];
  targetCards.splice(targetPosition - 1, 0, movedCard);
  const updatedSource = sourceCards.map((c, i) => ({ ...c, position: i + 1, list_id: sourceListId }));
  const updatedTarget = targetCards.map((c, i) => ({ ...c, position: i + 1, list_id: targetListId }));

  return [...updatedSource, ...updatedTarget] as ICard[];
};
