import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getBoards } from '../../api/boardsService';
import { Board } from './Board';
import { IBoard } from '../../common/interfaces/IBoard';
import { AddBoardForm } from './components/AddBoard/AddBoardForm';
import './board.scss';
import './home.scss';

export function Home(): JSX.Element {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isVisibleAddBoardForm, setVisibleAddBoardForm] = useState(false);

  async function fetchBoards(): Promise<void> {
    try {
      const data = await getBoards();
      setBoards(data);
    } catch (error) {
      toast.error(`Error to get boards data`);
    }
  }

  useEffect(() => {
    fetchBoards();
  }, []);

  const removeBoard = (id: number): void => {
    setBoards(boards.filter((elem) => elem.id !== id));
  };

  const handleBoardAdded = (newBoard: IBoard): void => {
    setBoards([...boards, newBoard]);
    setVisibleAddBoardForm(false);
  };
  return (
    <>
      <span className="home__page_title">Мої дошки</span>
      <div className="board__preview_list">
        {boards.map((elem) => {
          if (!elem.id) return null;
          return (
            <Link key={elem.id} to={`/board/${elem.id}`}>
              <Board key={elem.id} id={elem.id} {...elem} removeDeletedBoard={removeBoard} />
            </Link>
          );
        })}
        {isVisibleAddBoardForm && <AddBoardForm onBoardAdded={handleBoardAdded} />}
        {!isVisibleAddBoardForm && (
          <button className="board__add_button" onClick={() => setVisibleAddBoardForm(true)}>
            <span className="button__add_title">+ Додати дошку</span>
          </button>
        )}
      </div>
    </>
  );
}
