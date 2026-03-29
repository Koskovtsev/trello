import { useState } from 'react';
import { ICard } from '../../../../common/interfaces/ICard';
import './card.scss';

export function Card({ title }: ICard): JSX.Element {
  const [isVisibleChangeCardTitle, setVisibleChangeCardTitle] = useState(false);
  return (
    <div className="card__item">
      <li>
        <label className="card__label">
          <input type="checkbox" className="card__checkbox" />
          {!isVisibleChangeCardTitle && <span>{title}</span>}
        </label>
      </li>
      <button
        className="button__card_change-title"
        aria-label="Change card title"
        onClick={() => setVisibleChangeCardTitle(true)}
      >
        <i className="fa fa-pencil-alt" />
      </button>
    </div>
  );
}
