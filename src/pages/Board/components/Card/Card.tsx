import { ICard } from '../../../../common/interfaces/ICard';
import './card.scss';

export function Card({ title }: ICard): JSX.Element {
  return (
    <li className="card__item">
      <label className="card__label">
        <input type="checkbox" className="card__checkbox" />
        <span>{title}</span>
      </label>
    </li>
  );
}
