import { useState } from 'react';
import { Board } from './components/Board/Board';
import { IBoard } from '../../common/interfaces/IBoard';
import './components/Board/board.scss';
import './home.scss';

export function Home(): JSX.Element {
  const [boards] = useState<IBoard[]>([
    { id: 1, title: 'покупки', custom: { background: 'red' } },
    { id: 2, title: 'підготовка до весілля', custom: { background: 'green' } },
    { id: 3, title: 'розробка інтернет-магазину', custom: { background: 'blue' } },
    { id: 4, title: 'курс по просуванню у соцмережах', custom: { background: 'grey' } },
  ]);

  return (
    <>
      <span className="home__page_title">Мої дошки</span>
      <div className="board__preview_list">
        {boards.map((elem) => (
          <Board key={elem.id} id={elem.id} title={elem.title} custom={elem.custom} />
        ))}
        <wired-button elevation="2" className="Board__add-button">
          <span className="button__add_title">+ Додати дошку</span>
        </wired-button>
      </div>
    </>
  );
}
