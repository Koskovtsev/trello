import { ICard } from '../../../../common/interfaces/ICard';
import { IDragCardPayload } from '../../../../common/interfaces/IDragCardPayload';
import { IList } from '../../../../common/interfaces/IList';

export const handleCardInternalMove = (payload: IDragCardPayload, lists: IList[]): ICard[] => {
  const { sourceListId, cardId, targetPosition } = payload;
  const list = lists.find((l) => l.id === sourceListId);
  if (!list || !list.cards) return [];
  const updatedCards = [...list.cards];
  const cardIndex = updatedCards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return [];
  const [movedCard] = updatedCards.splice(cardIndex, 1);
  updatedCards.splice(targetPosition - 1, 0, movedCard);
  return updatedCards.map((card, index) => ({
    ...card,
    position: index + 1,
    list_id: sourceListId,
  }));
};
