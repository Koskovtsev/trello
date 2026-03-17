import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import './list.scss';

export function List({ title, cards }: IList): JSX.Element {
  return (
    <div className="list">
      <h2 className="list__title">{title}</h2>
      <ul className="list__cards">
        {cards.map((elem) => (
          <Card key={elem.id} id={elem.id} title={elem.title} />
        ))}
      </ul>
    </div>
  );
}
