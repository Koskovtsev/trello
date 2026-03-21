import { IBoard } from './IBoard';
import { IList } from './IList';

export interface IBoardData extends IBoard {
  users: [
    {
      id: number;
      username: string;
    },
  ];
  lists: [IList];
}
