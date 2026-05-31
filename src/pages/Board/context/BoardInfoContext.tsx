import { createContext, useContext } from 'react';
import { IBoard } from '../../../common/interfaces/IBoard';

interface IBoardInfoContext {
  boardId: number;
  activeBoard: IBoard;
}

export const BoardInfoContext = createContext<IBoardInfoContext | null>(null);

export const useBoardInfo = (): IBoardInfoContext => {
  const context = useContext(BoardInfoContext);

  if (!context) {
    throw new Error('useBoardInfo має використовуватись всередині BoardInfoProvider');
  }

  return context;
};
