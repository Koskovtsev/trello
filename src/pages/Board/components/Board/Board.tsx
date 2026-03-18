import { IBoard } from '../../../../common/interfaces/IBoard';
// import { RenderBackground } from '../RenderBackground';
import { PencilWrapper } from '../PencilWrapper';

export function Board({ title, custom }: IBoard): JSX.Element {
  return (
    <PencilWrapper className="home__board_item" color={custom.background}>
      {/* <RenderBackground color={custom?.background} /> */}
      {title}
    </PencilWrapper>
  );
}
