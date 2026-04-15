import { IBoard } from '../../../../common/interfaces/IBoard';
import { DeleteButtonWithModal } from '../../../../components/DeleteButtonWithModal/DeleteButtonWithModal';
import './boardItem.scss';

interface IBoardProps extends IBoard {
  id: number;
  onBoardDelete(boardId: number): void;
}
export function BoardItem({ id, title, custom, onBoardDelete }: IBoardProps): JSX.Element {
  async function handleDeleteBoard(boardId: number): Promise<void> {
    // e.stopPropagation();
    // e.preventDefault();
    onBoardDelete(boardId);
  }

  return (
    <div className="home__board_card">
      <div className="home__board_image" style={{ backgroundImage: `url(${custom?.background})` }} />
      <div className="home__board_footer">
        <span className="home__board_title" title={title}>
          {title}
        </span>
        <DeleteButtonWithModal onDeletedItem={() => handleDeleteBoard(id)} />
        {/* <button className="home__button_delete-item" aria-label="Delete" onClick={handleDeleteBoard}>
          <i className="fa fa-trash" />
        </button> */}
      </div>
    </div>
  );
}
