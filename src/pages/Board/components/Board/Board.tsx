import { IBoard } from '../../../../common/interfaces/IBoard';
import { RenderBackground } from '../RenderBackground';

export function Board({ title, custom }: IBoard): JSX.Element {
  return (
    <div className="home__board_item">
      <RenderBackground color={custom?.background} />
      {title}
    </div>
  );
}
