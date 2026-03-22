import { useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
// import { ICard } from '../../../../common/interfaces/ICard';
import { Card } from '../Card/Card';
import './list.scss';
import { AddCardForm } from '../Card/AddCardForm';

interface IAddCardChangesProps extends IList {
  onCardAdded(): void;
  boardId: number;
}
export function List({ id, title, cards, onCardAdded, boardId }: IAddCardChangesProps): JSX.Element {
  const [isVisibleAddCardForm, setVisibleAddCardForm] = useState(false);
  // const [cards, setCards] = useState<ICard[]>([]);
  const listId = id || 0;
  // eslint-disable-next-line no-console
  // console.log(`айді той шо приходть в ліст: ${id}`);
  const handleCardAdded = (): void => {
    onCardAdded();
    setVisibleAddCardForm(false);
  };
  return (
    <div className="list">
      <h2 className="list__title">{title}</h2>
      <ul className="list__cards">{cards?.map((elem) => <Card key={elem.id} {...elem} />)}</ul>
      {isVisibleAddCardForm && (
        <AddCardForm
          key={id}
          title={title}
          onCardAdded={handleCardAdded}
          position={(cards?.length ?? 0) + 1}
          boardId={boardId}
          list_id={listId}
        />
      )}
      <button className="button__add_card" onClick={() => setVisibleAddCardForm(true)}>
        + додати карту
      </button>
    </div>
  );
}
