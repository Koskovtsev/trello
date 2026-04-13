import toast from 'react-hot-toast';
import { IBoard } from '../../../../common/interfaces/IBoard';
import { deleteBoard } from '../../../../api/boardsService';
import './boardItem.scss';

interface IBoardProps extends IBoard {
  id: number;
  removeDeletedBoard(id: number): void;
}
// TODO: це має бути компонентом в соответственній папці.
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
    <div
      className="home__board_card"
      style={{
        backgroundImage: `url(${custom?.background})`,
        backgroundColor: '#acacac',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="home__board_footer">
        <span className="home__board_title" title={title}>
          {title}
        </span>
        <button className="home__button_delete-item" aria-label="Delete" onClick={handleDeleteBoard}>
          <i className="fa fa-trash" />
        </button>
      </div>
    </div>
  );
}
