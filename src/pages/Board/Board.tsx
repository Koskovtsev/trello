import toast from 'react-hot-toast';
import { IBoard } from '../../common/interfaces/IBoard';
import { deleteBoard } from '../../api/boardsService';
import './board.scss';

interface IBoardProps extends IBoard {
  id: number;
  removeDeletedBoard(id: number): void;
}

export function Board({ id, title, custom, removeDeletedBoard }: IBoardProps): JSX.Element {
  async function handleDeleteBoard(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    e.stopPropagation();
    e.preventDefault();
    try {
      const response = await deleteBoard(id);
      if (response === 'Deleted') {
        removeDeletedBoard(id);
      }
    } catch (error) {
      toast.error(`Error deleting board`);
    }
  }

  return (
    <div className="home__header" style={{ backgroundImage: `url(${custom?.background})`, backgroundColor: '#acacac' }}>
      <span className="home__board_title">{title}</span>
      <button className="home__button_delete-item" aria-label="Delete" onClick={handleDeleteBoard}>
        <i className="fa fa-trash" />
      </button>
    </div>
  );
}
