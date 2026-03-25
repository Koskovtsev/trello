import { useState, useEffect, useRef } from 'react';
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
  const scrollToEnd = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const width = scrollToEnd?.current?.scrollWidth || 0;
    if (scrollToEnd?.current?.scrollLeft) {
      scrollToEnd.current.scrollLeft = width;
    }
  }, [isVisibleAddBoardForm, boards.length]);
  useEffect(() => {
    async function fetchBoards(): Promise<void> {
      const data = await getBoards();
      setBoards(data);
    }
    fetchBoards();
  }, []);
  // const handleAddBoard = async (): Promise<void> => {
  //   setVisibleAddBoardForm(true);
  //   // eslint-disable-next-line no-console
  //   // console.log('Кнопка натиснута!');
  // };
  const removeBoard = (id: number): void => {
    setBoards(boards.filter((elem) => elem.id !== id));
  };
  const updateTitle = (boardId: number, newTitle: string): void => {
    setBoards(
      boards.map((elem) => {
        if (elem.id !== boardId) {
          return elem;
        }
        return { ...elem, title: newTitle };
      })
    );
  };

  const handleBoardAdded = (newBoard: IBoard): void => {
    setBoards([...boards, newBoard]);
    setVisibleAddBoardForm(false);
  };
  return (
    <>
      <span className="home__page_title">Мої дошки</span>
      <div className="board__preview_list" ref={scrollToEnd}>
        {boards.map((elem) => (
          <Link key={elem.id} to={`/board/${elem.id}`}>
            <Board key={elem.id} {...elem} removeDeletedBoard={removeBoard} updateBoardTitle={updateTitle} />
          </Link>
        ))}
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
