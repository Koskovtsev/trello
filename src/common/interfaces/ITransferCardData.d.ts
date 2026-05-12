import { ICard } from './ICard';

export interface ITransferCardData {
  cardData: ICard;
  mode: 'move' | 'copy';
  fromBoardId: number;
  toBoardId: number;
  toListId: number;
  position: number;
}
