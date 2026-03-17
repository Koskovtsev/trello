import { ICard } from '../../../../common/interfaces/ICard';
import './card.scss';

export function Card({ title }: ICard): JSX.Element {
  return <li className="card__title">{title}</li>;
}
