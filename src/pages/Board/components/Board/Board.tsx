import { IBoard } from '../../../../common/interfaces/IBoard';

export function Board({ title }: IBoard): JSX.Element {
  return <div className="board__home_title">{title}</div>;
}
