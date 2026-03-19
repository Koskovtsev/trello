import { useState } from 'react';
// import { useEffect } from 'react';
// import api from '../../api/request';
import { Link } from 'react-router-dom';
import { Board } from './components/Board/Board';
import { IBoard } from '../../common/interfaces/IBoard';
import { AddBoardForm } from './components/AddBoard/AddBoardForm';
import './components/Board/board.scss';
import './home.scss';

export function Home(): JSX.Element {
  // const [items, setItems] = useState<IBoard[]>([]);
  const [items] = useState<IBoard[]>([
    { id: 1, title: 'покупки', custom: { background: 'red' } },
    { id: 2, title: 'підготовка до весілля', custom: { background: 'green' } },
    { id: 3, title: 'розробка інтернет-магазину', custom: { background: 'blue' } },
    { id: 4, title: 'курс по просуванню у соцмережах', custom: { background: 'grey' } },
  ]);
  // useEffect(() => {
  //   async function fetchData(): Promise<void> {
  //     const response = await api.get<unknown, { boards: IBoard[] }>('board');
  //     setItems(response.boards);
  //   }
  //   fetchData();
  // }, []);
  const [isVisibleAddBoardForm, setVisibleAddBoardForm] = useState(false);
  const handleAddBoard = async (): Promise<void> => {
    setVisibleAddBoardForm(true);
    // eslint-disable-next-line no-console
    console.log('Кнопка натиснута!');
    // AddBoardForm(items.length);
    // setItems();
  };
  return (
    <>
      <span className="home__page_title">Мої дошки</span>
      <div className="board__preview_list">
        {items.map((elem) => (
          <Link key={elem.id} to={`/board/${elem.id}`}>
            <Board key={elem.id} {...elem} /* id={elem.id} title={elem.title} custom={elem.custom} */ />
          </Link>
        ))}
        {isVisibleAddBoardForm && <AddBoardForm numberOfElements={items.length} />}
        {!isVisibleAddBoardForm && (
          <wired-button elevation="2" className="Board__add-button" onClick={handleAddBoard}>
            <span className="button__add_title">+ Додати дошку</span>
          </wired-button>
        )}
      </div>
    </>
  );
}
