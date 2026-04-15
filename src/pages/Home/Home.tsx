import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBoards } from '../../hooks/useBoards';
import { AddBoardModal } from './components/AddBoard/AddBoardModal';
import { BoardItem } from './components/BoardItem/BoardItem';
import './home.scss';

export function Home(): JSX.Element {
  const { boards, fetchBoards, createBoard, deleteBoardById } = useBoards();
  const [addBoardModalActive, setaddBoardModalActive] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const removeBoard = (boardId: number): void => {
    if (boardId) {
      deleteBoardById(boardId);
    }
  };

  const handleBoardAdded = async (title: string, texture: string): Promise<void> => {
    const response = await createBoard(title, texture);
    if (response) setaddBoardModalActive(false);
  };

  return (
    <>
      <span className="home__page_title">Мої дошки</span>
      <div className="board__preview_list">
        {boards.map((elem) => {
          if (!elem.id) return null;
          return (
            <Link key={elem.id} to={`/board/${elem.id}`}>
              <BoardItem key={elem.id} id={elem.id} {...elem} onBoardDelete={removeBoard} />
            </Link>
          );
        })}
        <button className="board__add_button" onClick={() => setaddBoardModalActive((prop) => !prop)}>
          <span className="button__add_title">+ Додати дошку</span>
        </button>
        <AddBoardModal
          active={addBoardModalActive}
          setActive={setaddBoardModalActive}
          onBoardAdded={handleBoardAdded}
        />
      </div>
    </>
  );
}
