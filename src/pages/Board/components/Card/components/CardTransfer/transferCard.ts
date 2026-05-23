import toast from 'react-hot-toast';
import { ITransferCardData } from '../../../../../../common/interfaces/ITransferCardData';
import { AppDispatch } from '../../../../../../store/store';
import {
  createCardThunk,
  deleteCardThunk,
  processCardMoveThunk,
  updateGroupCardsThunk,
} from '../../../../../../store/boards/thunks';
import { ICard } from '../../../../../../common/interfaces/ICard';
import { IBoard } from '../../../../../../common/interfaces/IBoard';
import { IDragCardPayload } from '../../../../../../common/interfaces/IDragCardPayload';
import { getBoard } from '../../../../../../api/boardsService';

function buildCardsAfterInsert(
  boardData: IBoard,
  boardId: number,
  newCardId: number,
  targetPosition: number,
  listId: number
): { boardId: number; cardsData: ICard[] } | null {
  const currentList = boardData.lists?.find((list) => list.id === listId);
  if (!currentList?.cards) return null;
  const cardsIds = currentList.cards.map((card) => card.id);
  cardsIds.splice(targetPosition - 1, 0, newCardId);
  const newCardsList = cardsIds.map((cardId, index) => ({
    id: cardId,
    position: index + 1,
    list_id: listId,
  }));
  return { boardId, cardsData: newCardsList };
}

export async function transferCard(payload: ITransferCardData, dispatch: AppDispatch): Promise<void> {
  const { cardData, mode, fromBoardId, toBoardId, toListId, position } = payload;
  const newCard: ICard = {
    title: cardData.title,
    list_id: toListId,
    position,
    description: cardData.description,
    custom: cardData.custom,
  };
  const createAndReorderCard = async (): Promise<void> => {
    const createdCardId = await dispatch(createCardThunk({ boardId: toBoardId, cardData: newCard })).unwrap();
    const newboardData = await getBoard(toBoardId);
    const groupCardsPayload = buildCardsAfterInsert(newboardData, toBoardId, createdCardId, position, toListId);
    if (groupCardsPayload) await dispatch(updateGroupCardsThunk(groupCardsPayload)).unwrap();
  };
  try {
    if (mode === 'copy') {
      await createAndReorderCard();
      return;
    }
    const isCrossBoardMove = fromBoardId !== toBoardId;
    if (isCrossBoardMove) {
      await createAndReorderCard();
      await dispatch(deleteCardThunk({ boardId: fromBoardId, cardData })).unwrap();
      return;
    }
    const movePayload: IDragCardPayload = {
      cardId: cardData.id!,
      sourceListId: cardData.list_id!,
      targetListId: toListId,
      sourcePosition: cardData.position!,
      targetPosition: position,
      boardId: toBoardId,
    };
    await dispatch(processCardMoveThunk(movePayload)).unwrap();
  } catch (error) {
    toast.error(`error while transfer card`);
  }
}
