import { useState } from 'react';
import { IList } from '../../common/interfaces/IList';
import { List } from './components/List/List';
// import { IList } from '../../common/interfaces/IList';
// import { List } from './components/List/List';
import 'wired-elements';
import './components/Board/board.scss';

export function Board(): JSX.Element {
  const [title] = useState('Моя тестова дошка');

  const [lists] = useState<IList[]>([
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 2,
      title: 'В процесі',
      cards: [{ id: 4, title: 'подивитися серіал' }],
    },
    {
      id: 3,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
      ],
    },
  ]);

  return (
    <div className="board">
      <span className="board__title">{title}</span>
      <div className="board__list">
        {lists.map((elem) => (
          <List key={elem.id} title={elem.title} cards={elem.cards} />
        ))}
        <wired-button elevation="2" className="board__add-button">
          + Додати список
        </wired-button>
      </div>
    </div>
  );
}
