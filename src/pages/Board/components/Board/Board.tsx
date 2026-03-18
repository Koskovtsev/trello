import { IBoard } from '../../../../common/interfaces/IBoard';
import { PencilWrapper } from '../PencilWrapper';

export function Board({ title, custom }: IBoard): JSX.Element {
  return (
    <PencilWrapper className="home__board_item" color={custom.background}>
      {title}
    </PencilWrapper>
  );
}
