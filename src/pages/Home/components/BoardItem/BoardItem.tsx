import { IBoard } from '../../../../common/interfaces/IBoard';
import { DeleteAction } from '../../../../components/DeleteButtonWithModal/DeleteAction';
import './boardItem.scss';

interface IBoardProps extends IBoard {
  id: number;
  onDelete(boardId: number): void;
}
export function BoardItem({ id, title, custom, onDelete }: IBoardProps): JSX.Element {
  return (
    <div className="home__board_card">
      <div className="home__board_image" style={{ backgroundImage: `url(${custom?.background})` }} />
      <div className="home__board_footer">
        <span className="home__board_title" title={title}>
          {title}
        </span>
        <DeleteAction onConfirm={() => onDelete(id)} />
      </div>
    </div>
  );
}
